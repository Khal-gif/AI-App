import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    console.log('🧪 Testing REAL Gemini with AI Studio API...')
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found in environment'
      }, { status: 500 })
    }

    console.log('🔑 Using API key:', apiKey.substring(0, 20) + '...')
    
    // Use the standard Google AI SDK (not Vertex AI)
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Get the Gemini 2.0 Flash model (latest and most capable)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    console.log('🤖 Model initialized: gemini-2.0-flash')
    
    // Simple test prompt
    const prompt = "Say 'Hello from REAL Gemini 2.0 Flash!' to confirm you are working correctly."
    
    console.log('🚀 Generating content...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('✅ SUCCESS! Real Gemini working!')
    console.log('💬 Response:', text.substring(0, 100) + '...')

    return NextResponse.json({
      success: true,
      message: 'REAL Gemini 2.0 Flash working perfectly!',
      response: text,
      model: 'gemini-2.0-flash',
      apiType: 'Google AI Studio (Standard)',
      keyPrefix: apiKey.substring(0, 20)
    })

  } catch (error: any) {
    console.error('❌ Real Gemini test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Real Gemini test failed',
      details: error?.toString().substring(0, 500),
      suggestion: 'Make sure your API key is from Google AI Studio, not Vertex AI'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt = 'Analyze this content and provide detailed insights.' } = await request.json()
    
    console.log('🖼️ Testing REAL Gemini content analysis...')
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY not found'
      }, { status: 500 })
    }

    // Now this will use REAL Gemini, not the fallback
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    console.log('📝 Custom prompt:', prompt.substring(0, 50) + '...')
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('✅ Content generation successful!')

    return NextResponse.json({
      success: true,
      message: 'REAL Gemini content analysis working!',
      response: text,
      model: 'gemini-2.0-flash',
      prompt: prompt,
      apiType: 'Google AI Studio (Standard)'
    })

  } catch (error: any) {
    console.error('❌ Real Gemini content analysis failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Content analysis failed',
      details: error?.toString().substring(0, 500)
    }, { status: 500 })
  }
}