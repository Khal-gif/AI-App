import { NextRequest, NextResponse } from 'next/server'
import { VertexAI } from '@google-cloud/vertexai'
import { GoogleAuth } from 'google-auth-library'

export async function GET() {
  try {
    console.log('🧪 Testing hybrid approach: Service Account + Vertex AI SDK...')
    
    const projectId = process.env.VERTEX_AI_PROJECT_ID
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1'
    
    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'Project ID not configured'
      }, { status: 500 })
    }

    // Method 1: Try with fresh service account token
    try {
      console.log('🔑 Getting fresh access token from service account...')
      
      const auth = new GoogleAuth({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      })
      
      const authClient = await auth.getClient()
      const accessToken = await authClient.getAccessToken()
      
      if (accessToken.token) {
        console.log('✅ Fresh access token obtained:', accessToken.token.substring(0, 30) + '...')
        
        // Test direct REST call with fresh token
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-flash:generateContent`
        
        const requestBody = {
          contents: [{
            parts: [{
              text: "Say 'Hello from fresh service account token!' to confirm you are working."
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100
          }
        }

        console.log('🚀 Testing with fresh token...')
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken.token}`
          },
          body: JSON.stringify(requestBody)
        })

        console.log('📊 Fresh token response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Success but no text extracted'
          
          console.log('✅ Fresh token SUCCESS!')
          
          return NextResponse.json({
            success: true,
            message: 'Service account with fresh token working!',
            response: text,
            method: 'service-account-fresh-token',
            tokenPrefix: accessToken.token.substring(0, 20)
          })
        } else {
          const errorText = await response.text()
          console.log('❌ Fresh token failed:', response.status, errorText.substring(0, 200))
        }
      }
      
    } catch (serviceAccountError) {
      console.log('⚠️ Service account approach failed:', serviceAccountError)
    }

    // Method 2: Try with VertexAI SDK
    try {
      console.log('🔄 Trying VertexAI SDK approach...')
      
      const vertex = new VertexAI({
        project: projectId,
        location: location,
        googleAuthOptions: {
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        }
      })
      
      const model = vertex.preview.getGenerativeModel({
        model: 'gemini-1.5-flash'
      })
      
      const request = {
        contents: [{
          role: 'user',
          parts: [{
            text: "Say 'Hello from VertexAI SDK!' to confirm you are working."
          }]
        }],
        generation_config: {
          temperature: 0.7,
          max_output_tokens: 100
        }
      }

      const result = await model.generateContent(request)
      const response = await result.response
      
      if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
        const text = response.candidates[0].content.parts[0].text
        console.log('✅ VertexAI SDK SUCCESS!')
        
        return NextResponse.json({
          success: true,
          message: 'VertexAI SDK working!',
          response: text,
          method: 'vertex-ai-sdk'
        })
      }
      
    } catch (sdkError) {
      console.log('⚠️ VertexAI SDK approach failed:', sdkError)
    }

    return NextResponse.json({
      success: false,
      error: 'All approaches failed',
      message: 'Neither service account tokens nor VertexAI SDK worked. Check server logs for details.'
    }, { status: 500 })

  } catch (error) {
    console.error('❌ Hybrid test completely failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Hybrid test failed'
    }, { status: 500 })
  }
}