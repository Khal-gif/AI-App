import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 GEMINI PRODUCT ANALYSIS STARTED')
    const startTime = Date.now()

    // Parse form data
    const formData = await request.formData()
    const image = formData.get('image') as File
    const contentType = formData.get('contentType') as string || 'product-description'
    const customPrompt = formData.get('customPrompt') as string

    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'Image is required for analysis'
      }, { status: 400 })
    }

    console.log('📸 Processing image:', image.name, image.type, `${image.size} bytes`)
    console.log('📝 Content type requested:', contentType)

    // Check Gemini API key
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured'
      }, { status: 500 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    
    console.log('🤖 Initializing Gemini 2.0 Flash...')
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Create content-specific prompt
    let analysisPrompt = ''
    
    switch (contentType) {
      case 'product-description':
        analysisPrompt = `You are a professional product analyst creating detailed product descriptions for e-commerce websites.

Analyze this product image and provide a comprehensive, professional description that would be suitable for an online store.

Requirements:
• Identify the specific product type and category
• Describe visible features, materials, and design elements
• Highlight key benefits and selling points
• Use professional, engaging language
• Focus on what customers need to know
• Be specific about what you can observe in the image
• Avoid generic marketing fluff

Format your response as a well-structured product description that would help customers understand exactly what they're buying.`
        break

      case 'social-media':
        analysisPrompt = `You are a social media content creator specializing in product promotion.

Analyze this product image and create engaging social media content.

Requirements:
• Write catchy, engaging copy that would perform well on social platforms
• Include relevant hashtags
• Focus on lifestyle benefits and appeal
• Use conversational, exciting tone
• Highlight what makes this product special
• Keep it concise but impactful
• Make it shareable and engaging

Create content that would drive engagement and interest on social media platforms.`
        break

      case 'features-list':
        analysisPrompt = `You are a technical product specialist creating feature lists for marketing materials.

Analyze this product image and create a comprehensive list of key features and benefits.

Requirements:
• List 5-8 key features you can identify from the image
• Use bullet points for easy reading
• Focus on technical specifications and functional benefits
• Be specific about materials, design, and construction
• Highlight competitive advantages
• Use professional terminology
• Each point should be concise but informative

Format as a clean, professional feature list that highlights the product's strengths.`
        break

      case 'ecommerce-listing':
        analysisPrompt = `You are an e-commerce specialist creating product listings for major online marketplaces like Amazon.

Analyze this product image and create a complete e-commerce product listing.

Requirements:
• Professional product title (50-80 characters)
• Detailed product description with key benefits
• List of main features and specifications
• Target customer information
• Use SEO-friendly language
• Include relevant keywords naturally
• Focus on conversion-optimized copy
• Be factual and specific about what's visible

Create a listing that would rank well and convert browsers into buyers.`
        break

      case 'custom':
        analysisPrompt = customPrompt || 'Analyze this product image and provide detailed insights about the product, its features, and potential market appeal.'
        break

      default:
        analysisPrompt = 'Analyze this product image and provide a detailed, professional description suitable for e-commerce use.'
    }

    console.log('🚀 Sending image to Gemini for analysis...')
    
    // Send to Gemini with image and prompt
    const result = await model.generateContent([
      analysisPrompt,
      {
        inlineData: {
          mimeType: image.type,
          data: base64
        }
      }
    ])

    const response = await result.response
    const generatedContent = response.text()
    
    const processingTime = Date.now() - startTime
    
    console.log('✅ GEMINI ANALYSIS COMPLETE')
    console.log(`⏱️ Processing time: ${processingTime}ms`)
    console.log(`📄 Generated content length: ${generatedContent.length} characters`)

    return NextResponse.json({
      success: true,
      generatedContent,
      meta: {
        processingTime,
        contentType,
        model: 'gemini-2.0-flash',
        provider: 'Google AI Studio',
        imageSize: image.size,
        responseLength: generatedContent.length
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ GEMINI PRODUCT ANALYSIS FAILED:', error)
    
    let errorMessage = 'Failed to analyze product'
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Gemini API key issue. Please check configuration.'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      provider: 'gemini-analysis',
      suggestion: 'Try uploading a different image or check API configuration'
    }, { status: 500 })
  }
}

// Health check
export async function GET() {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY
  
  return NextResponse.json({
    status: 'ready',
    service: 'gemini-product-analysis',
    provider: 'Google Gemini 2.0 Flash',
    available: hasGeminiKey,
    keyConfigured: hasGeminiKey,
    features: [
      'direct-image-analysis',
      'no-vision-api-dependency', 
      'multiple-content-types',
      'custom-prompts',
      'professional-descriptions',
      'social-media-content',
      'ecommerce-optimization'
    ],
    contentTypes: [
      'product-description',
      'social-media', 
      'features-list',
      'ecommerce-listing',
      'custom'
    ],
    timestamp: new Date().toISOString()
  })
}