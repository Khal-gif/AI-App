import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt = "Hello! Please respond with 'Gemini is working!' to confirm the connection." } = await request.json()
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not configured'
      }, { status: 500 })
    }

    console.log('🧪 DIRECT GEMINI TEST:')
    console.log('🔑 API Key:', apiKey.substring(0, 15) + '...')
    console.log('💬 Prompt:', prompt.substring(0, 100) + '...')

    // Method 1: Try the exact same endpoint that works for listing models
    const testModel = 'models/gemini-1.5-flash-latest'
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/${testModel}:generateContent?key=${apiKey}`
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    }

    console.log('🎯 Testing endpoint:', endpoint.replace(apiKey, 'API_KEY_HIDDEN'))
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2))

    const startTime = Date.now()
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const processingTime = Date.now() - startTime
    console.log('📥 Response status:', response.status, response.statusText)
    console.log('⏱️ Processing time:', processingTime + 'ms')

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Error response:', errorText)
      
      return NextResponse.json({
        success: false,
        method: 'direct-api-call',
        model: testModel,
        endpoint: endpoint.replace(apiKey, 'API_KEY_HIDDEN'),
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        processingTime,
        diagnosis: response.status === 400 ? 'Bad request - check model name or request format' :
                  response.status === 403 ? 'Forbidden - API key may lack permissions' :
                  response.status === 404 ? 'Model not found - try different model name' :
                  response.status === 429 ? 'Rate limit or quota exceeded' :
                  'Unknown error'
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('📋 Raw response keys:', Object.keys(data))
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!generatedText) {
      console.log('⚠️ No text found in response:', JSON.stringify(data, null, 2))
      return NextResponse.json({
        success: false,
        error: 'No text generated in response',
        rawResponse: data
      }, { status: 500 })
    }

    console.log('✅ SUCCESS! Generated text:', generatedText.substring(0, 200) + '...')
    
    return NextResponse.json({
      success: true,
      method: 'direct-api-call',
      model: testModel,
      prompt: prompt,
      generatedText: generatedText,
      processingTime,
      meta: {
        responseKeys: Object.keys(data),
        candidatesCount: data.candidates?.length || 0,
        keyStatus: 'Working Gemini API key!'
      }
    })

  } catch (error) {
    console.error('❌ Direct test failed:', error)
    
    return NextResponse.json({
      success: false,
      method: 'direct-api-call',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error?.constructor?.name
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const prompt = "Say 'Hello from Gemini 1.5!' and confirm you are working properly."
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not configured'
      }, { status: 500 })
    }

    console.log('🧪 DIRECT GEMINI GET TEST')
    
    const testModel = 'models/gemini-1.5-flash-latest'
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/${testModel}:generateContent?key=${apiKey}`
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        status: response.status,
        error: errorText.substring(0, 500)
      }, { status: response.status })
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    return NextResponse.json({
      success: true,
      generatedText: generatedText,
      model: testModel
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 })
  }
}