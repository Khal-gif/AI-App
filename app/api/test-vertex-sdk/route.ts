import { NextRequest, NextResponse } from 'next/server'
import { VertexAI } from '@google-cloud/vertexai'

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

    console.log('🧪 Testing official Vertex AI SDK...')
    console.log('📍 Project:', projectId)
    console.log('🌍 Location:', location)
    
    // Initialize Vertex AI with official SDK
    const vertex = new VertexAI({
      project: projectId,
      location: location,
      googleAuthOptions: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      }
    })
    
    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-1.5-flash'
    })
    
    console.log('✅ Vertex AI SDK initialized successfully')
    
    // Test simple text generation
    const request = {
      contents: [{
        role: 'user',
        parts: [{
          text: "Say 'Hello from official Vertex AI SDK!' to confirm you are working properly."
        }]
      }],
      generation_config: {
        temperature: 0.7,
        max_output_tokens: 100
      }
    }

    console.log('🚀 Sending request to Gemini via Vertex AI SDK...')

    // Use streaming for better performance
    const streamingResult = await model.generateContentStream(request)
    
    console.log('📥 Streaming response received from Vertex AI SDK')
    
    // Collect the streaming response
    let response = ''
    for await (const item of streamingResult.stream) {
      if (item.candidates && item.candidates[0].content && item.candidates[0].content.parts) {
        for (const part of item.candidates[0].content.parts) {
          if (part.text) {
            response += part.text
          }
        }
      }
    }

    if (!response) {
      throw new Error('No response received from Vertex AI SDK')
    }

    console.log('✅ SUCCESS! Response:', response.substring(0, 100) + '...')

    return NextResponse.json({
      success: true,
      message: 'Official Vertex AI SDK working perfectly!',
      response: response,
      projectId: projectId,
      location: location,
      model: 'gemini-1.5-flash',
      sdk: '@google-cloud/vertexai'
    })

  } catch (error) {
    console.error('❌ Vertex AI SDK test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'SDK test failed',
      details: error instanceof Error ? error.stack : 'Unknown error'
    }, { status: 500 })
  }
}