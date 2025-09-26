import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not configured'
      })
    }

    console.log('🔍 Testing Gemini API key:', apiKey.substring(0, 10) + '...')

    // Test 1: Try to list available models
    try {
      const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      
      if (!modelsResponse.ok) {
        const errorText = await modelsResponse.text()
        console.log('❌ Models list failed:', modelsResponse.status, errorText)
        
        return NextResponse.json({
          success: false,
          test: 'list-models',
          status: modelsResponse.status,
          statusText: modelsResponse.statusText,
          error: errorText.substring(0, 500),
          diagnosis: modelsResponse.status === 403 ? 'API key invalid or restricted' : 
                    modelsResponse.status === 404 ? 'Wrong API endpoint or key type' :
                    'Unknown API issue'
        })
      }

      const modelsData = await modelsResponse.json()
      console.log('✅ Models list successful, found:', modelsData.models?.length || 0, 'models')
      
      const availableModels = modelsData.models?.map((model: any) => model.name) || []
      const geminiModels = availableModels.filter((name: string) => name.includes('gemini'))
      
      return NextResponse.json({
        success: true,
        test: 'list-models',
        totalModels: availableModels.length,
        geminiModels: geminiModels,
        recommendedModel: geminiModels.find((name: string) => name.includes('1.5-flash')) || geminiModels[0],
        keyStatus: 'Valid Gemini API key',
        nextStep: 'Try generating content with recommended model'
      })

    } catch (fetchError) {
      console.error('❌ Fetch error:', fetchError)
      
      return NextResponse.json({
        success: false,
        test: 'list-models',
        error: fetchError instanceof Error ? fetchError.message : 'Network error',
        diagnosis: 'Network or API endpoint issue'
      })
    }

  } catch (error) {
    console.error('❌ General error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { model = 'gemini-1.5-flash' } = await request.json()
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not configured'
      }, { status: 500 })
    }

    console.log('🤖 Testing content generation with model:', model)

    const testPrompt = "Say 'Hello from Gemini!' and confirm you are working properly."
    
    const requestBody = {
      contents: [{
        parts: [{
          text: testPrompt
        }]
      }]
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Generation failed:', response.status, errorText)
      
      return NextResponse.json({
        success: false,
        test: 'generate-content',
        model: model,
        status: response.status,
        statusText: response.statusText,
        error: errorText.substring(0, 500)
      }, { status: response.status })
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text generated'
    
    console.log('✅ Generation successful:', generatedText.substring(0, 100) + '...')
    
    return NextResponse.json({
      success: true,
      test: 'generate-content',
      model: model,
      prompt: testPrompt,
      response: generatedText,
      keyStatus: 'Valid and working Gemini API key!'
    })

  } catch (error) {
    console.error('❌ Generation error:', error)
    
    return NextResponse.json({
      success: false,
      test: 'generate-content',
      error: error instanceof Error ? error.message : 'Generation failed'
    }, { status: 500 })
  }
}