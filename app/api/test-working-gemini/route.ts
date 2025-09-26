import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    console.log('🧪 Testing Working Gemini Models...')
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment'
      }, { status: 500 })
    }

    console.log('🔑 Using API key:', apiKey.substring(0, 20) + '...')
    
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Test with the most reliable models
    const testModels = [
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest', 
      'gemini-1.0-pro-latest',
      'gemini-pro'
    ]
    
    for (const modelName of testModels) {
      try {
        console.log(`🤖 Testing model: ${modelName}`)
        
        const model = genAI.getGenerativeModel({ model: modelName })
        const prompt = `Say "Hello from ${modelName}! I am working perfectly!" to confirm you are functioning.`
        
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        console.log(`✅ SUCCESS with ${modelName}!`)
        console.log('💬 Response:', text.substring(0, 100) + '...')

        return NextResponse.json({
          success: true,
          message: `REAL Gemini working with ${modelName}!`,
          response: text,
          model: modelName,
          apiType: 'Google AI Studio (Standard)',
          keyPrefix: apiKey.substring(0, 20),
          timestamp: new Date().toISOString()
        })
        
      } catch (modelError: any) {
        console.log(`⚠️ Model ${modelName} failed:`, modelError.message?.substring(0, 100))
        continue
      }
    }
    
    // If we get here, all models failed
    return NextResponse.json({
      success: false,
      error: 'All Gemini models failed to respond',
      testedModels: testModels,
      suggestion: 'API key may not have proper permissions'
    }, { status: 500 })

  } catch (error: any) {
    console.error('❌ Working Gemini test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Working Gemini test failed',
      details: error?.toString().substring(0, 500)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt = 'Provide a detailed analysis of the given content.' } = await request.json()
    
    console.log('📝 Testing Gemini content generation...')
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found'
      }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Use the most reliable model for content generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" })
    
    console.log('📝 Custom prompt:', prompt.substring(0, 50) + '...')
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('✅ Content generation successful!')

    return NextResponse.json({
      success: true,
      message: 'Gemini content generation working!',
      response: text,
      model: 'gemini-1.5-pro-latest',
      prompt: prompt,
      apiType: 'Google AI Studio (Standard)'
    })

  } catch (error: any) {
    console.error('❌ Gemini content generation failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Content generation failed',
      details: error?.toString().substring(0, 500)
    }, { status: 500 })
  }
}