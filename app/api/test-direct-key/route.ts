import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Let's try to use one of your original API keys directly
    // with the Generative Language API endpoint
    const apiKey = 'AIzaSyBvL5IDIVOZVsioUPTRpJrYCzWo7oYhCvo' // Your second key
    
    console.log('🧪 Testing direct API key with Generative Language API...')
    
    // Test the endpoint that should work with API keys
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
    
    const requestBody = {
      contents: [{
        parts: [{
          text: "Say 'Hello from direct API key test!' to confirm you are working."
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    }

    console.log('🚀 Testing endpoint with API key:', endpoint)

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📊 Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Error response:', errorText)
      
      // Try a different model name
      const altEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
      console.log('🔄 Trying alternative model:', altEndpoint)
      
      const altResponse = await fetch(`${altEndpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log('📊 Alt response status:', altResponse.status)
      
      if (!altResponse.ok) {
        const altErrorText = await altResponse.text()
        console.log('❌ Alt error response:', altErrorText)
        
        return NextResponse.json({
          success: false,
          error: 'Both endpoints failed',
          primaryError: errorText,
          alternativeError: altErrorText
        }, { status: 500 })
      }
      
      const altData = await altResponse.json()
      const altTextResponse = altData.candidates?.[0]?.content?.parts?.[0]?.text || 'Alt response format not recognized'
      
      return NextResponse.json({
        success: true,
        message: 'Direct API key working with alternative model!',
        response: altTextResponse,
        model: 'gemini-1.5-flash',
        method: 'direct-api-key'
      })
    }

    const data = await response.json()
    console.log('📋 Response keys:', Object.keys(data))
    
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Response format not recognized'

    return NextResponse.json({
      success: true,
      message: 'Direct API key integration working!',
      response: textResponse,
      model: 'gemini-1.5-flash-latest',
      method: 'direct-api-key'
    })

  } catch (error) {
    console.error('❌ Direct API key test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      details: error
    }, { status: 500 })
  }
}