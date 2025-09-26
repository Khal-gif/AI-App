import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not configured',
        debug: {
          envVars: {
            GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
            GOOGLE_GEMINI_API_KEY: !!process.env.GOOGLE_GEMINI_API_KEY,
            GOOGLE_AI_API_KEY: !!process.env.GOOGLE_AI_API_KEY
          }
        }
      })
    }

    console.log('🤖 Testing Gemini API connection...')
    console.log('🔑 API Key configured:', apiKey.substring(0, 10) + '...')

    // Initialize Gemini - try different model names
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try current available model versions (updated Dec 2024)
    const modelNames = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash-latest',
      'gemini-1.0-pro-latest',
      'gemini-pro'
    ]
    
    let model
    let modelUsed = ''
    
    for (const modelName of modelNames) {
      try {
        model = genAI.getGenerativeModel({ model: modelName })
        modelUsed = modelName
        console.log('🎯 Using model:', modelName)
        break
      } catch (err) {
        console.log('⚠️ Model', modelName, 'not available:', err)
        continue
      }
    }
    
    if (!model) {
      throw new Error('No available Gemini model found')
    }

    // Test prompt
    const prompt = `You are a product analysis expert. Analyze this product:

Product: Sony Headphones
Category: Audio/Headphones
Features: Wireless, Noise-canceling, Leather padding

Provide a JSON response with:
{
  "brand_analysis": "Brief analysis of Sony as a brand",
  "technical_specs": ["spec1", "spec2"],
  "market_position": "premium/mid-range/budget",
  "confidence": 0.95
}

Respond only with valid JSON.`

    console.log('📤 Sending prompt to Gemini...')
    
    const startTime = Date.now()
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const processingTime = Date.now() - startTime
    
    console.log('📥 Gemini response received:')
    console.log('⏱️ Processing time:', processingTime + 'ms')
    console.log('📝 Response length:', response.length + ' characters')
    console.log('📄 Raw response:', response.substring(0, 200) + '...')

    // Try to parse JSON
    let parsedResponse
    try {
      parsedResponse = JSON.parse(response)
      console.log('✅ JSON parsing successful')
    } catch (parseError) {
      console.log('⚠️ JSON parsing failed:', parseError)
      parsedResponse = { raw_text: response }
    }

    return NextResponse.json({
      success: true,
      geminiResponse: parsedResponse,
      meta: {
        processingTime,
        responseLength: response.length,
        model: modelUsed,
        jsonParseable: typeof parsedResponse === 'object' && !parsedResponse.raw_text
      }
    })

  } catch (error) {
    console.error('❌ Gemini test failed:', error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      debug: {
        hasApiKey: !!process.env.GEMINI_API_KEY,
        errorType: error?.constructor?.name,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: 'Prompt is required'
      }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not configured'
      }, { status: 500 })
    }

    console.log('🤖 Custom Gemini prompt test...')
    
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const startTime = Date.now()
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const processingTime = Date.now() - startTime

    console.log('✅ Custom prompt completed in', processingTime + 'ms')

    return NextResponse.json({
      success: true,
      response: response,
      processingTime
    })

  } catch (error) {
    console.error('❌ Custom Gemini prompt failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Custom prompt failed'
    }, { status: 500 })
  }
}