import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test with the Vertex AI token you provided
    const vertexToken = 'AQ.Ab8RN6Igp7H2T1dze6O65ZUQ-sz9DezOQtUOBt2gEkMypO5DcA'
    const projectId = process.env.VERTEX_AI_PROJECT_ID
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1'
    
    console.log('🧪 Testing with Vertex AI token...')
    console.log('📍 Project:', projectId)
    console.log('🌍 Location:', location)
    console.log('🔑 Token:', vertexToken.substring(0, 20) + '...')
    
    // Test different Vertex AI endpoints with your token
    const endpoints = [
      {
        name: 'Vertex AI Models List',
        url: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models`
      },
      {
        name: 'Gemini Generate Content',
        url: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-flash:generateContent`,
        method: 'POST',
        body: {
          contents: [{
            parts: [{
              text: "Say 'Hello from Vertex AI with token!' to confirm you are working."
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100
          }
        }
      }
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Testing: ${endpoint.name}`)
        console.log(`🔗 URL: ${endpoint.url}`)
        
        const options: any = {
          method: endpoint.method || 'GET',
          headers: {
            'Authorization': `Bearer ${vertexToken}`,
            'Content-Type': 'application/json'
          }
        }
        
        if (endpoint.body) {
          options.body = JSON.stringify(endpoint.body)
        }
        
        const response = await fetch(endpoint.url, options)
        
        console.log(`📊 ${endpoint.name} status:`, response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ ${endpoint.name} SUCCESS!`)
          
          if (endpoint.name === 'Vertex AI Models List') {
            console.log('📋 Available models:', data.models?.length || 0)
            const geminiModels = data.models?.filter((model: any) => 
              model.name?.toLowerCase().includes('gemini')
            ) || []
            console.log('🤖 Gemini models:', geminiModels.length)
          }
          
          if (endpoint.name === 'Gemini Generate Content') {
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text extracted'
            console.log('💬 Generated text:', text)
            
            return NextResponse.json({
              success: true,
              message: 'Vertex AI token working perfectly!',
              response: text,
              tokenStatus: 'Valid Vertex AI token',
              endpoint: endpoint.name
            })
          }
          
        } else {
          const errorText = await response.text()
          console.log(`❌ ${endpoint.name} failed:`, response.status, errorText.substring(0, 200))
          
          if (response.status === 401) {
            return NextResponse.json({
              success: false,
              error: 'Token authentication failed',
              status: response.status,
              endpoint: endpoint.name
            })
          }
        }
        
      } catch (endpointError) {
        console.log(`💥 ${endpoint.name} exception:`, endpointError)
      }
    }

    return NextResponse.json({
      success: false,
      error: 'All endpoints tested but no successful content generation',
      message: 'Check server logs for details'
    })

  } catch (error) {
    console.error('❌ Vertex AI token test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Token test failed'
    }, { status: 500 })
  }
}