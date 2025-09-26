import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

export async function GET() {
  try {
    const projectId = process.env.VERTEX_AI_PROJECT_ID
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1'
    
    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'Vertex AI project ID not configured'
      }, { status: 500 })
    }

    console.log('🧪 Testing Vertex AI authentication...')
    
    // Test authentication
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })
    
    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token')
    }
    
    console.log('✅ Access token obtained successfully')
    
    // Test simple text generation
    const model = 'gemini-1.5-flash-002'
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`
    
    const requestBody = {
      contents: [{
        parts: [{
          text: "Say 'Hello from Vertex AI Gemini!' to confirm you are working properly."
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    }

    console.log('🚀 Testing Vertex AI endpoint:', endpoint)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.token}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📊 Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Error response:', errorText)
      
      return NextResponse.json({
        success: false,
        error: 'Vertex AI request failed',
        status: response.status,
        details: errorText
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('📋 Response keys:', Object.keys(data))
    console.log('📄 Full response:', JSON.stringify(data, null, 2))
    
    // Try to extract the text response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                        data.predictions?.[0]?.content || 
                        data.predictions?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text ||
                        'Response format not recognized'

    return NextResponse.json({
      success: true,
      message: 'Vertex AI integration working!',
      response: textResponse,
      projectId: projectId,
      location: location,
      model: model,
      fullResponse: data
    })

  } catch (error) {
    console.error('❌ Vertex AI test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      details: error
    }, { status: 500 })
  }
}