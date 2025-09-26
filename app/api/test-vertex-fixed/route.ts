import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

export async function GET() {
  try {
    const projectId = process.env.VERTEX_AI_PROJECT_ID
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1'
    
    console.log('🧪 Testing Vertex AI with corrected approach...')
    console.log('📍 Project:', projectId)
    console.log('🌍 Location:', location)
    
    // Get access token
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })
    
    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token')
    }
    
    console.log('✅ Access token obtained')
    
    // Try different Vertex AI model approaches
    const approaches = [
      {
        name: 'Standard Vertex AI',
        endpoint: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-flash:generateContent`,
        body: {
          instances: [{
            messages: [{
              role: 'user',
              content: 'Say hello from Vertex AI approach 1!'
            }]
          }],
          parameters: {
            temperature: 0.7,
            maxTokens: 100
          }
        }
      },
      {
        name: 'Generative AI Format',
        endpoint: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-flash:generateContent`,
        body: {
          contents: [{
            parts: [{
              text: 'Say hello from Vertex AI approach 2!'
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100
          }
        }
      },
      {
        name: 'Different Model',
        endpoint: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-pro:generateContent`,
        body: {
          contents: [{
            parts: [{
              text: 'Say hello from Vertex AI approach 3!'
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100
          }
        }
      }
    ]

    for (const approach of approaches) {
      try {
        console.log(`🔄 Trying: ${approach.name}`)
        console.log(`🔗 Endpoint: ${approach.endpoint}`)
        
        const response = await fetch(approach.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken.token}`
          },
          body: JSON.stringify(approach.body)
        })

        console.log(`📊 ${approach.name} status:`, response.status)

        if (response.ok) {
          const data = await response.json()
          console.log(`✅ ${approach.name} SUCCESS!`)
          console.log('📋 Response keys:', Object.keys(data))
          
          // Try multiple ways to extract text
          let textResponse = 'Response extraction failed'
          
          if (data.predictions && data.predictions[0]) {
            if (data.predictions[0].candidates) {
              textResponse = data.predictions[0].candidates[0]?.content?.parts?.[0]?.text
            } else if (data.predictions[0].content) {
              textResponse = data.predictions[0].content
            }
          } else if (data.candidates) {
            textResponse = data.candidates[0]?.content?.parts?.[0]?.text
          }
          
          return NextResponse.json({
            success: true,
            message: `${approach.name} working!`,
            response: textResponse || 'Text extraction failed but API call succeeded',
            approach: approach.name,
            fullResponse: data
          })
        } else {
          const errorText = await response.text()
          console.log(`❌ ${approach.name} failed:`, response.status, errorText.substring(0, 200))
        }
        
      } catch (approachError) {
        console.log(`💥 ${approach.name} exception:`, approachError)
      }
    }

    return NextResponse.json({
      success: false,
      error: 'All Vertex AI approaches failed',
      message: 'Check server logs for details'
    }, { status: 500 })

  } catch (error) {
    console.error('❌ Vertex AI test completely failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      details: error
    }, { status: 500 })
  }
}