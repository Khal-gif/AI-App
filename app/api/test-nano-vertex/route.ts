import { NextRequest, NextResponse } from 'next/server'
import { VertexAI } from '@google-cloud/vertexai'

export async function GET() {
  try {
    console.log('🧪 Testing Vertex AI with nano project...')
    
    // Use your nano project configuration
    const vertex_ai = new VertexAI({
      project: 'nano', // Your working project
      location: 'us-central1',
      googleAuthOptions: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      }
    })

    const model = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-09-2025', // Your working model
    })

    console.log('✅ Vertex AI initialized with nano project')
    console.log('🎯 Model: gemini-2.5-flash-preview-09-2025')

    // Test content generation
    const result = await model.generateContent('Say "Hello from nano project with Gemini 2.5!" to confirm you are working.')
    
    console.log('📥 Response received from Gemini 2.5')
    
    const response = result.response
    let text = ''
    
    if (response.candidates && response.candidates[0]?.content?.parts) {
      text = response.candidates[0].content.parts.map(part => part.text).join('')
    }
    
    if (!text) {
      throw new Error('No text generated from Gemini 2.5')
    }

    console.log('✅ SUCCESS! Gemini 2.5 working in nano project')
    console.log('💬 Generated:', text.substring(0, 100) + '...')

    return NextResponse.json({
      success: true,
      message: 'Vertex AI working with nano project!',
      response: text,
      model: 'gemini-2.5-flash-preview-09-2025',
      project: 'nano',
      location: 'us-central1'
    })

  } catch (error) {
    console.error('❌ Nano Vertex AI test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      project: 'nano',
      model: 'gemini-2.5-flash-preview-09-2025'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt = 'Analyze this image and describe what you see.' } = await request.json()
    
    console.log('🖼️ Testing Vertex AI image analysis with nano project...')
    
    // Use your nano project configuration
    const vertex_ai = new VertexAI({
      project: 'nano',
      location: 'us-central1',
      googleAuthOptions: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      }
    })

    const model = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-09-2025',
    })

    console.log('✅ Vertex AI initialized for image analysis')
    console.log('📝 Prompt:', prompt.substring(0, 50) + '...')

    // Test with text first (you can add image later)
    const result = await model.generateContent(prompt)
    
    const response = result.response
    let text = ''
    
    if (response.candidates && response.candidates[0]?.content?.parts) {
      text = response.candidates[0].content.parts.map(part => part.text).join('')
    }
    
    if (!text) {
      throw new Error('No response generated from Gemini 2.5')
    }

    console.log('✅ Content generation successful!')

    return NextResponse.json({
      success: true,
      message: 'Vertex AI content generation working!',
      response: text,
      model: 'gemini-2.5-flash-preview-09-2025',
      project: 'nano',
      prompt: prompt
    })

  } catch (error) {
    console.error('❌ Nano Vertex AI content generation failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Content generation failed'
    }, { status: 500 })
  }
}