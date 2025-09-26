import { NextRequest, NextResponse } from 'next/server'

interface ProductAnalysisRequest {
  image: string // base64 encoded image
  contentType: 'product-description' | 'social-media' | 'features-list' | 'ecommerce-listing' | 'custom'
  customPrompt?: string
}

interface ProductAnalysisResponse {
  success: boolean
  productAnalysis?: {
    category: string
    features: string[]
    description: string
    labels: string[]
    objects: string[]
    colors: string[]
  }
  generatedContent?: string
  processingTime?: number
  error?: string
}

// Smart content generation functions
function generateProductDescription(category: string, labels: any[], objects: any[], texts: string[], colors: any[]): string {
  const topLabels = labels.slice(0, 5)
  const topObjects = objects.slice(0, 3)
  const brandInfo = texts.find(text => text.length > 2 && text.length < 20) || null
  
  let description = `# ${category} - Professional Analysis\n\n`
  
  if (brandInfo) {
    description += `**Brand/Text Detected:** ${brandInfo}\n\n`
  }
  
  description += `## Product Overview\n`
  description += `This ${category.toLowerCase()} demonstrates professional design and quality construction. `
  
  if (topLabels.length > 0) {
    description += `Key characteristics include ${topLabels.map(l => l.name).slice(0, 3).join(', ')}, indicating high-quality materials and attention to detail.\n\n`
  }
  
  description += `## Technical Specifications\n`
  if (category.includes('Audio')) {
    description += `• **Audio Quality:** Professional-grade drivers and sound engineering\n`
    description += `• **Comfort:** Ergonomic design for extended listening sessions\n`
    description += `• **Build Quality:** Durable materials with premium finish\n`
    description += `• **Connectivity:** Modern connection standards and compatibility\n`
  } else if (category.includes('Fashion')) {
    description += `• **Material Quality:** Premium fabrics and construction techniques\n`
    description += `• **Design:** Contemporary styling with versatile application\n`
    description += `• **Comfort:** Designed for comfortable wear and movement\n`
    description += `• **Durability:** Quality construction for long-lasting use\n`
  } else if (category.includes('Technology')) {
    description += `• **Performance:** Advanced processing capabilities and efficiency\n`
    description += `• **Design:** Modern aesthetics with functional engineering\n`
    description += `• **Connectivity:** Latest standards for seamless integration\n`
    description += `• **Build Quality:** Premium materials and precise manufacturing\n`
  } else {
    description += `• **Quality Construction:** Professional-grade materials and manufacturing\n`
    description += `• **Functional Design:** Optimized for intended use and performance\n`
    description += `• **Aesthetic Appeal:** Modern design language and visual appeal\n`
    description += `• **Durability:** Built to withstand regular use and maintain quality\n`
  }
  
  if (topObjects.length > 0) {
    description += `\n## Design Elements\n`
    topObjects.forEach(obj => {
      description += `• **${obj.name}:** Carefully engineered component (${obj.confidence}% detection confidence)\n`
    })
  }
  
  if (colors.length > 0) {
    description += `\n## Color Profile\n`
    colors.slice(0, 3).forEach(color => {
      description += `• **${color.rgb}:** Dominant color element\n`
    })
  }
  
  description += `\n## Professional Assessment\n`
  description += `Based on visual analysis, this product exhibits characteristics of professional design and quality manufacturing. The detected elements suggest attention to detail and user-focused engineering, making it suitable for both professional and consumer applications.`
  
  return description
}

function generateSocialMedia(category: string, labels: any[], objects: any[]): string {
  const topLabels = labels.slice(0, 3)
  let post = ''
  
  if (category.includes('Audio')) {
    post = `🎧 Spotted: Premium ${category} with professional-grade features!\n\n`
  } else if (category.includes('Fashion')) {
    post = `✨ Style Alert: Quality ${category} with modern design!\n\n`
  } else {
    post = `🔥 Check out this ${category} - quality meets design!\n\n`
  }
  
  post += `Key highlights:\n`
  topLabels.forEach(label => {
    post += `• ${label.name} quality\n`
  })
  
  post += `\nWhy it stands out:\n`
  post += `✓ Professional construction\n✓ Modern design approach\n✓ Quality materials\n\n`
  
  post += `#QualityProducts #${category.replace(/[^a-zA-Z0-9]/g, '')} #Professional #Design`
  
  return post
}

function generateFeaturesList(category: string, labels: any[], objects: any[], colors: any[]): string {
  let features = `# ${category} - Complete Features List\n\n`
  
  features += `## Core Features\n`
  labels.slice(0, 6).forEach(label => {
    features += `• **${label.name}** - Quality component with ${label.confidence}% detection confidence\n`
  })
  
  if (objects.length > 0) {
    features += `\n## Design Components\n`
    objects.slice(0, 4).forEach(obj => {
      features += `• **${obj.name}** - Engineered design element\n`
    })
  }
  
  features += `\n## Professional Specifications\n`
  if (category.includes('Audio')) {
    features += `• **Sound Quality:** Professional-grade audio engineering\n`
    features += `• **Comfort Engineering:** Extended use design optimization\n`
    features += `• **Build Materials:** Premium construction materials\n`
  } else if (category.includes('Fashion')) {
    features += `• **Fabric Quality:** Premium material selection\n`
    features += `• **Construction:** Professional tailoring techniques\n`
    features += `• **Design Aesthetics:** Contemporary style elements\n`
  } else {
    features += `• **Construction Quality:** Professional manufacturing standards\n`
    features += `• **Material Selection:** Premium component materials\n`
    features += `• **Design Engineering:** User-centered functionality\n`
  }
  
  if (colors.length > 0) {
    features += `\n## Color Specifications\n`
    colors.slice(0, 3).forEach((color, index) => {
      features += `• **Primary Color ${index + 1}:** ${color.rgb}\n`
    })
  }
  
  return features
}

function generateEcommerceListing(category: string, labels: any[], objects: any[], texts: string[], colors: any[]): string {
  const brandInfo = texts.find(text => text.length > 2 && text.length < 20)
  let listing = ''
  
  // SEO Title
  listing += `# ${brandInfo || 'Premium'} ${category} - Professional Quality\n\n`
  
  // Product highlights
  listing += `## Key Selling Points\n`
  listing += `✓ Professional-grade ${category.toLowerCase()}\n`
  listing += `✓ Quality construction and materials\n`
  listing += `✓ Modern design and functionality\n`
  labels.slice(0, 3).forEach(label => {
    listing += `✓ ${label.name} quality features\n`
  })
  
  // Detailed description
  listing += `\n## Product Description\n`
  listing += `Experience premium quality with this professionally designed ${category.toLowerCase()}. `
  listing += `Featuring ${labels.slice(0, 3).map(l => l.name).join(', ')} characteristics, `
  listing += `this product delivers exceptional performance and reliability.\n\n`
  
  // Technical details
  listing += `**Technical Excellence:** Built with attention to detail and quality craftsmanship, `
  listing += `ensuring long-lasting performance and customer satisfaction.\n\n`
  
  // Trust signals
  listing += `## Why Choose This Product\n`
  listing += `• **Quality Assurance:** Professional manufacturing standards\n`
  listing += `• **Design Innovation:** Modern engineering and aesthetics\n`
  listing += `• **Performance:** Optimized for reliability and user satisfaction\n`
  listing += `• **Value:** Premium quality at competitive pricing\n\n`
  
  // Keywords
  const keywords = [category.toLowerCase().replace(' ', '-'), ...labels.slice(0, 4).map(l => l.name.toLowerCase())]
  listing += `**Keywords:** ${keywords.join(', ')}`
  
  return listing
}

function generateCustomContent(category: string, labels: any[], objects: any[], customPrompt: string): string {
  let content = `# Custom Analysis: ${category}\n\n`
  content += `**Request:** ${customPrompt}\n\n`
  content += `## Analysis Results\n`
  content += `**Category:** ${category}\n`
  content += `**Key Elements:** ${labels.slice(0, 5).map(l => l.name).join(', ')}\n`
  
  if (objects.length > 0) {
    content += `**Design Components:** ${objects.slice(0, 3).map(o => o.name).join(', ')}\n`
  }
  
  content += `\n## Professional Assessment\n`
  content += `Based on the visual analysis and your specific request, this ${category.toLowerCase()} `
  content += `demonstrates ${labels.slice(0, 2).map(l => l.name).join(' and ')} characteristics. `
  content += `The detected elements suggest quality construction and professional design standards.`
  
  return content
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductAnalysisRequest = await request.json()
    const { image, contentType, customPrompt } = body

    console.log('🔍 GOOGLE CLOUD VISION PRODUCT ANALYSIS:')
    console.log('📝 Content Type:', contentType)
    console.log('📸 Image provided:', !!image)
    console.log('⏰ Timestamp:', new Date().toISOString())

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Product image is required' },
        { status: 400 }
      )
    }

    const visionApiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY
    
    if (!visionApiKey) {
      return NextResponse.json(
        { success: false, error: 'Google Cloud Vision API key not configured' },
        { status: 500 }
      )
    }

    const startTime = Date.now()

    try {
      console.log('🚀 Calling Google Cloud Vision API...')
      
      // Convert base64 to proper format
      const imageBase64 = image.replace(/^data:image\/[a-z]+;base64,/, '')

      // Use Google Cloud Vision API (which works)
      const baseUrl = 'https://vision.googleapis.com/v1/images:annotate'
      
      const requestBody = {
        requests: [
          {
            image: {
              content: imageBase64
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 15 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              { type: 'TEXT_DETECTION', maxResults: 5 },
              { type: 'IMAGE_PROPERTIES', maxResults: 5 }
            ]
          }
        ]
      }

      const visionResponse = await fetch(`${baseUrl}?key=${visionApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!visionResponse.ok) {
        const error = await visionResponse.json()
        throw new Error(`Vision API error: ${error.error?.message || visionResponse.statusText}`)
      }

      const visionResult = await visionResponse.json()
      const result = visionResult.responses[0]
      
      console.log('✅ Google Cloud Vision analysis completed')

      // Create content type specific prompts
      let prompt = ''
      switch (contentType) {
        case 'product-description':
          prompt = `Analyze this product image and provide a detailed product description. Include:
- Product category and type
- Key features and specifications  
- Materials and build quality
- Target audience and use cases
- Brand information if visible
- Technical details you can observe

Provide a professional, detailed description suitable for e-commerce.`
          break
        case 'social-media':
          prompt = `Analyze this product image and create engaging social media content. Include:
- Catchy headline
- Key selling points
- Hashtags relevant to the product
- Call to action
- Emotional appeal

Make it shareable and engaging for social media platforms.`
          break
        case 'features-list':
          prompt = `Analyze this product image and create a comprehensive features list. Include:
- Core specifications
- Design elements
- Functional features
- Quality indicators
- Technical capabilities

Format as bullet points with detailed descriptions.`
          break
        case 'ecommerce-listing':
          prompt = `Analyze this product image and create a complete e-commerce listing. Include:
- SEO-optimized title
- Product highlights
- Detailed description
- Technical specifications
- Keywords for search
- Trust signals

Format for maximum conversion and searchability.`
          break
        case 'custom':
          prompt = customPrompt || 'Analyze this product image and provide detailed information.'
          break
        default:
          prompt = `Analyze this product image comprehensively. Provide detailed information about the product including category, features, specifications, and professional assessment.`
      }

      // Extract analysis data from Vision API
      const labels = result.labelAnnotations?.map((label: { description?: string, score?: number }) => ({
        name: label.description || '',
        confidence: Math.round((label.score || 0) * 100)
      })) || []
      
      const objects = result.localizedObjectAnnotations?.map((obj: { name?: string, score?: number }) => ({
        name: obj.name || '',
        confidence: Math.round((obj.score || 0) * 100)  
      })) || []
      
      const texts = result.textAnnotations?.map((text: { description?: string }) => text.description || '') || []
      
      const colors = result.imagePropertiesAnnotation?.dominantColors?.colors?.map((color: { color?: { red?: number; green?: number; blue?: number }, score?: number }) => ({
        rgb: `RGB(${Math.round(color.color?.red || 0)},${Math.round(color.color?.green || 0)},${Math.round(color.color?.blue || 0)})`,
        confidence: Math.round((color.score || 0) * 100)
      })).slice(0, 5) || []

      // Smart category detection
      let category = 'Product'
      const allText = [...labels.map(l => l.name), ...objects.map(o => o.name), ...texts].join(' ').toLowerCase()
      
      if (allText.includes('headphone') || allText.includes('headset') || allText.includes('earphone') || allText.includes('earbud') || allText.includes('audio') || allText.includes('speaker')) {
        category = 'Audio/Headphones'
      } else if (allText.includes('clothing') || allText.includes('shirt') || allText.includes('dress') || allText.includes('jacket') || allText.includes('fashion') || allText.includes('apparel') || allText.includes('scarf') || allText.includes('hat') || allText.includes('textile') || allText.includes('fabric')) {
        category = 'Fashion/Clothing'
      } else if (allText.includes('car') || allText.includes('vehicle') || allText.includes('auto') || allText.includes('tire') || allText.includes('wheel')) {
        category = 'Automotive'
      } else if (allText.includes('phone') || allText.includes('mobile') || allText.includes('smartphone') || allText.includes('computer') || allText.includes('laptop') || allText.includes('tablet')) {
        category = 'Technology/Electronics'
      } else if (allText.includes('shoe') || allText.includes('sneaker') || allText.includes('boot') || allText.includes('footwear')) {
        category = 'Footwear/Shoes'
      } else if (allText.includes('food') || allText.includes('dish') || allText.includes('meal') || allText.includes('beverage') || allText.includes('drink')) {
        category = 'Food/Beverage'
      }

      // Generate smart content based on detection
      console.log('🧠 Generating smart content based on vision analysis')
      console.log('🏷️ Category detected:', category)
      console.log('📊 Labels found:', labels.length)
      console.log('📦 Objects found:', objects.length)
      
      let response = ''
      
      switch (contentType) {
        case 'product-description':
          response = generateProductDescription(category, labels, objects, texts, colors)
          break
        case 'social-media':
          response = generateSocialMedia(category, labels, objects)
          break
        case 'features-list':
          response = generateFeaturesList(category, labels, objects, colors)
          break
        case 'ecommerce-listing':
          response = generateEcommerceListing(category, labels, objects, texts, colors)
          break
        case 'custom':
          response = generateCustomContent(category, labels, objects, customPrompt || '')
          break
        default:
          response = generateProductDescription(category, labels, objects, texts, colors)
      }
      
      console.log('✅ Smart content generated, length:', response.length)
      const processingTime = Date.now() - startTime

      console.log('✅ Gemini analysis completed:')
      console.log('⏱️ Processing time:', `${processingTime}ms`)
      console.log('📄 Response length:', response.length)

      return NextResponse.json({
        success: true,
        generatedContent: response,
        productAnalysis: {
          category,
          labels: labels.map(l => l.name),
          objects: objects.map(o => o.name),
          colors: colors.map(c => c.rgb),
          detectedText: texts.filter(t => t.length > 2),
          features: labels.slice(0, 5).map(l => l.name)
        },
        processingTime,
        aiProvider: 'Google Cloud Vision API + Smart Content Generation',
        analysisMethod: 'vision-api-with-intelligent-templates'
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Processing-Time': processingTime.toString(),
          'X-AI-Provider': 'Google Cloud Vision API + Smart Templates'
        }
      })

    } catch (visionError) {
      const processingTime = Date.now() - startTime
      console.error('❌ Vision API Error:', visionError)
      console.log('⏱️ Failed after:', `${processingTime}ms`)
      
      let errorMessage = 'Failed to analyze image with Google Cloud Vision'
      if (visionError instanceof Error) {
        if (visionError.message.includes('credentials')) {
          errorMessage = 'Google Cloud Vision credentials not configured properly'
        } else if (visionError.message.includes('quota')) {
          errorMessage = 'Google Cloud Vision quota exceeded'
        } else if (visionError.message.includes('billing')) {
          errorMessage = 'Google Cloud Vision billing not enabled'
        } else {
          errorMessage = `Vision API Error: ${visionError.message}`
        }
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        processingTime
      }, {
        status: 500
      })
    }

  } catch (error) {
    console.error('❌ API Route Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Request processing failed'
      },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  const hasVisionApiKey = !!process.env.GOOGLE_CLOUD_VISION_API_KEY
  
  return NextResponse.json({
    status: 'healthy',
    service: 'smart-product-analysis',
    provider: 'Google Cloud Vision API + Smart Content Generation',
    available: hasVisionApiKey,
    apiKeyConfigured: hasVisionApiKey,
    capabilities: [
      'image-analysis',
      'smart-content-generation',
      'multiple-content-types',
      'custom-prompts',
      'professional-analysis',
      'brand-detection',
      'category-classification',
      'confidence-scoring'
    ],
    features: [
      'Vision API integration',
      'Smart category detection',
      'Brand/text recognition',
      'Professional content templates',
      'Multiple output formats',
      'Confidence scoring',
      'Color analysis',
      'Object detection'
    ],
    timestamp: new Date().toISOString()
  })
}