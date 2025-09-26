import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

export async function GET() {
  try {
    console.log('🧪 Testing Generative Language API with service account...')
    
    // Test authentication
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/generative-language']
    })
    
    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token')
    }
    
    console.log('✅ Access token obtained successfully')
    
    // Test simple text generation with Generative Language API
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    
    const requestBody = {
      contents: [{
        parts: [{
          text: "Say 'Hello from Generative Language API!' to confirm you are working properly."
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    }

    console.log('🚀 Testing Generative Language API endpoint:', endpoint)

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
        error: 'Generative Language API request failed',
        status: response.status,
        details: errorText
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('📋 Response keys:', Object.keys(data))
    
    // Extract the text response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Response format not recognized'

    return NextResponse.json({
      success: true,
      message: 'Generative Language API integration working!',
      response: textResponse,
      fullResponse: data
    })

  } catch (error) {
    console.error('❌ Generative Language API test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      details: error
    }, { status: 500 })
  }
}