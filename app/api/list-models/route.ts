import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

export async function GET() {
  try {
    const projectId = process.env.VERTEX_AI_PROJECT_ID
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1'
    
    console.log('🔍 Checking available models in Vertex AI...')
    
    // Get access token
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })
    
    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()
    
    // List available models
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models`
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken.token}`
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        error: `Failed to list models: ${response.status}`,
        details: errorText
      })
    }
    
    const data = await response.json()
    
    console.log('📋 Available models:', data.models?.length || 0)
    
    const geminiModels = data.models?.filter((model: any) => 
      model.name?.toLowerCase().includes('gemini')
    ) || []
    
    return NextResponse.json({
      success: true,
      totalModels: data.models?.length || 0,
      geminiModels: geminiModels.map((model: any) => ({
        name: model.name,
        displayName: model.displayName,
        supportedActions: model.supportedActions
      })),
      allModelNames: data.models?.map((model: any) => model.name) || []
    })
    
  } catch (error) {
    console.error('❌ List models failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list models'
    }, { status: 500 })
  }
}