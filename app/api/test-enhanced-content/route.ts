import { NextRequest, NextResponse } from 'next/server'
import { EnhancedContentGenerator } from '../../../lib/enhanced-content-generator'
import { FallbackAIAnalyzer } from '../../../lib/fallback-ai-analyzer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { labels = [], objects = [], category = 'Product' } = body

    console.log('🧪 ENHANCED CONTENT TEST:')
    console.log('📂 Category:', category)
    console.log('🏷️ Labels:', labels)
    console.log('📦 Objects:', objects)

    // Test 1: Direct Fallback AI Analysis
    console.log('\n1️⃣ Testing Fallback AI Analysis...')
    const fallbackResults = FallbackAIAnalyzer.analyzeProductIntelligently({
      category,
      detectedLabels: labels,
      detectedObjects: objects,
      currentBrands: [],
      confidence: 0.8
    })

    console.log('📊 Fallback AI Results:')
    console.log('   New brands:', fallbackResults.newBrands.length)
    console.log('   Enhanced specs:', fallbackResults.enhancedSpecs.length)
    console.log('   Market insights:', fallbackResults.marketInsights.length)

    // Test 2: Enhanced Content Generation
    console.log('\n2️⃣ Testing Enhanced Content Generation...')
    const enhancedContent = EnhancedContentGenerator.generateEnhancedProductDescription({
      labels,
      objects,
      category
    })

    console.log('✅ Enhanced content generated:', enhancedContent.length, 'characters')

    return NextResponse.json({
      success: true,
      tests: {
        fallbackAI: {
          brands: fallbackResults.newBrands,
          specs: fallbackResults.enhancedSpecs.slice(0, 3), // First 3 for brevity
          insights: fallbackResults.marketInsights.slice(0, 2), // First 2 for brevity
          confidenceBoost: fallbackResults.confidenceBoost
        },
        enhancedContent: {
          contentLength: enhancedContent.length,
          preview: enhancedContent.substring(0, 500) + '...',
          fullContent: enhancedContent
        }
      }
    })

  } catch (error) {
    console.error('❌ Enhanced content test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 })
  }
}

export async function GET() {
  // Run a sample test with gaming controller data
  console.log('🎮 Running sample gaming controller test...')
  
  const testData = {
    labels: ['Game controller', 'Electronic device', 'Gaming', 'Wireless', 'RGB lighting'],
    objects: ['Controller', 'Gaming device'],
    category: 'Gaming/Controllers'
  }

  try {
    const fallbackResults = FallbackAIAnalyzer.analyzeProductIntelligently({
      category: testData.category,
      detectedLabels: testData.labels,
      detectedObjects: testData.objects,
      currentBrands: [],
      confidence: 0.8
    })

    const enhancedContent = EnhancedContentGenerator.generateEnhancedProductDescription(testData)

    return NextResponse.json({
      success: true,
      testData,
      results: {
        aiAnalysis: {
          brandsFound: fallbackResults.newBrands.length,
          specsGenerated: fallbackResults.enhancedSpecs.length,
          insights: fallbackResults.marketInsights.length,
          sampleBrands: fallbackResults.newBrands.slice(0, 3),
          sampleSpecs: fallbackResults.enhancedSpecs.slice(0, 3)
        },
        contentGeneration: {
          contentLength: enhancedContent.length,
          contentPreview: enhancedContent.substring(0, 300) + '...'
        }
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Sample test failed'
    }, { status: 500 })
  }
}