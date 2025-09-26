import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'Image is required'
      }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env.local'
      }, { status: 500 })
    }

    console.log('🎯 PROFESSIONAL PRODUCT ANALYSIS:')
    console.log('📸 Image provided:', image.name, image.size, 'bytes')
    
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Use the latest and most capable Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    console.log('🎯 Using Gemini model: gemini-2.0-flash')
    
    // Professional analysis prompt - NO FLUFF, REAL CONTENT
    const prompt = `Analyze this product image as a professional product specialist working for Amazon or a major retailer.

YOUR MISSION: Create a factual, professional product listing that customers would actually find useful.

STRICT REQUIREMENTS:
- NO emojis, hashtags, or marketing fluff
- NO generic phrases like "cutting-edge", "revolutionary", "game-changing"
- NO vague statements - be specific about what you observe
- Write like a professional product manager creating an actual listing
- Focus on FACTS you can see in the image

Examine the image carefully for:
1. Brand names, logos, model numbers, or any visible text
2. Specific design features and materials
3. Build quality indicators
4. Color, finish, and construction details  
5. Visible controls, ports, buttons, or interfaces
6. Size and proportions relative to context

Return ONLY valid JSON in this exact structure:

{
  "productIdentification": {
    "visibleBrand": "Exact brand name if clearly visible, otherwise 'Brand not visible'",
    "productCategory": "Specific category (e.g., 'Over-ear Bluetooth Headphones', 'Gaming Controller', 'Wireless Earbuds')",
    "primaryColor": "Primary color observed",
    "secondaryColors": ["Any", "additional", "colors"],
    "visibleText": "Any model numbers, text, or markings you can see",
    "designStyle": "Professional description of the aesthetic (e.g., 'Minimalist modern', 'Gaming-oriented with angular design')"
  },
  "professionalTitle": "Create a 50-70 character product title suitable for e-commerce",
  "productBullets": [
    "PERFORMANCE: Specific performance claim based on what you can observe from design",
    "DESIGN & COMFORT: Factual statement about materials, ergonomics, build quality you can see",
    "CONNECTIVITY: Connection types visible or indicated by design (ports, wireless indicators)",
    "CONSTRUCTION: Materials and build quality you can actually observe",
    "TARGET USE: Based on design cues, what this product appears optimized for"
  ],
  "professionalDescription": "Write 100-150 words that would convince a professional buyer. Focus on practical benefits and what problems this solves. Be specific about value proposition.",
  "technicalObservations": {
    "materials": "Specific materials you can identify (plastic, metal, fabric, leather)",
    "buildQuality": "Assessment based on visible construction (joints, finish, tolerances)",
    "ergonomicFeatures": "Visible comfort or usability features",
    "physicalControls": "List any buttons, dials, switches, ports visible",
    "designIntent": "What user experience this design appears to prioritize"
  },
  "marketPositioning": {
    "priceSegment": "Budget ($0-50) / Mid-range ($50-150) / Premium ($150-300) / Luxury ($300+)",
    "targetMarket": "Who would buy this based on design cues",
    "competitiveAdvantage": "One key differentiator you can observe",
    "useCase": "Primary use case suggested by the design"
  },
  "searchKeywords": ["specific", "relevant", "search", "terms", "no", "fluff"],
  "qualityAssessment": {
    "overallImpression": "Professional assessment of quality level",
    "strengthsObserved": ["Visible", "strengths"],
    "limitations": "What you cannot determine from the image"
  },
  "confidenceLevel": "High/Medium/Low - how confident are you in this analysis based on image clarity"
}

Remember: You are creating a real product listing that needs to be accurate and useful. No marketing speak - just professional, factual analysis.`

    console.log('🤖 Sending professional analysis request to Gemini...')
    const startTime = Date.now()
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type,
          data: base64
        }
      }
    ])
    
    const processingTime = Date.now() - startTime
    const responseText = result.response.text()
    
    console.log('📥 Gemini response received:')
    console.log('⏱️ Processing time:', processingTime + 'ms')
    console.log('📄 Response length:', responseText.length + ' characters')
    
    // Clean and parse JSON response
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    try {
      const productData = JSON.parse(cleanedText)
      
      console.log('✅ Professional analysis completed successfully')
      console.log('🏷️ Product:', productData.productIdentification?.productCategory || 'Unknown')
      console.log('🏢 Brand:', productData.productIdentification?.visibleBrand || 'Not visible')
      console.log('💰 Price segment:', productData.marketPositioning?.priceSegment || 'Unknown')
      
      return NextResponse.json({
        success: true,
        data: productData,
        meta: {
          processingTime,
          responseLength: responseText.length,
          model: 'gemini-2.0-flash',
          analysisType: 'professional-product-specialist'
        }
      })
      
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError)
      console.log('🔍 Raw response:', responseText.substring(0, 500) + '...')
      
      return NextResponse.json({
        success: false,
        error: 'Failed to parse Gemini response as JSON',
        rawResponse: responseText.substring(0, 1000),
        parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Professional analysis failed:', error)
    
    let errorMessage = 'Analysis failed'
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Gemini API key configuration error. Please get a valid API key from https://aistudio.google.com/'
      } else if (error.message.includes('404')) {
        errorMessage = 'Gemini model not accessible. You need a proper Gemini API key from Google AI Studio, not Google Cloud.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestion: 'Get a proper Gemini API key from https://aistudio.google.com/ (different from Google Cloud Vision API key)'
    }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY
  
  return NextResponse.json({
    status: 'ready',
    service: 'professional-product-analysis',
    provider: 'Google Gemini AI',
    available: hasGeminiKey,
    keyConfigured: hasGeminiKey,
    keyType: hasGeminiKey ? 'Configured' : 'Missing',
    setup: {
      instructions: 'Get API key from https://aistudio.google.com/',
      envVariable: 'GEMINI_API_KEY',
      note: 'This must be a Google AI Studio API key, not Google Cloud Vision API key'
    },
    capabilities: [
      'professional-product-analysis',
      'brand-recognition',
      'technical-specifications',
      'market-positioning',
      'competitive-analysis',
      'e-commerce-optimization'
    ],
    timestamp: new Date().toISOString()
  })
}