import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAuth } from 'google-auth-library'

export async function GET() {
  try {
    console.log('🎯 Final test: Using GoogleGenerativeAI with service account token...')
    
    // Get OAuth token from service account
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/generative-language']
    })
    
    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token')
    }
    
    console.log('✅ Access token obtained')
    
    // Use the OAuth token with GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(accessToken.token)
    
    // Try different model names
    const modelNames = [
      'gemini-1.5-flash',
      'gemini-1.5-pro', 
      'gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-pro'
    ]
    
    for (const modelName of modelNames) {
      try {
        console.log(`🔄 Testing model: ${modelName}`)
        
        const model = genAI.getGenerativeModel({ model: modelName })
        const prompt = `Say 'Hello from ${modelName}!' to confirm you are working.`
        
        const result = await model.generateContent(prompt)
        const response = result.response.text()
        
        console.log(`✅ SUCCESS with ${modelName}: ${response.substring(0, 50)}...`)
        
        return NextResponse.json({
          success: true,
          message: `GoogleGenerativeAI working with ${modelName}!`,
          response: response,
          model: modelName,
          method: 'service-account-oauth-token'
        })
        
      } catch (modelError) {
        console.log(`❌ ${modelName} failed:`, modelError instanceof Error ? modelError.message.substring(0, 100) : 'Unknown error')
        continue
      }
    }
    
    // If all models failed, try direct REST call one more time
    console.log('🔄 Trying direct REST as final attempt...')
    
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    const requestBody = {
      contents: [{
        parts: [{ text: 'Say hello from direct REST call!' }]
      }]
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.token}`
      },
      body: JSON.stringify(requestBody)
    })

    if (response.ok) {
      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Success but no text extracted'
      
      return NextResponse.json({
        success: true,
        message: 'Direct REST call working!',
        response: text,
        method: 'direct-rest-oauth'
      })
    } else {
      const errorText = await response.text()
      console.log('❌ Direct REST failed:', response.status, errorText.substring(0, 200))
    }

    return NextResponse.json({
      success: false,
      error: 'All approaches failed',
      message: 'Neither GoogleGenerativeAI client nor direct REST worked'
    }, { status: 500 })

  } catch (error) {
    console.error('❌ Final test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 })
  }
}