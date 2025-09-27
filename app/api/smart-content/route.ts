import { NextRequest, NextResponse } from 'next/server'
import { EnhancedContentGenerator } from '../../../lib/enhanced-content-generator'

interface SmartContentRequest {
  labels: string[]
  objects: string[]
  category: string
  colors?: any[]
  contentType: 'product-description' | 'social-media' | 'features-list' | 'ecommerce-listing'
  research?: any
}

class SmartContentGenerator {
  
  static generateEnhancedProductDescription(analysis: any): string {
    const { labels, objects, category, colors } = analysis
    
    // Get meaningful data
    const meaningfulLabels = labels?.filter((label: any) => 
      (typeof label === 'string' ? label : label.name) && 
      !(typeof label === 'string' ? label : label.name).toLowerCase().includes('functionality') && 
      (typeof label === 'string' ? label : label.name).length > 2
    ).slice(0, 8) || []
    
    const meaningfulObjects = objects?.filter((obj: any) => 
      (typeof obj === 'string' ? obj : obj.name) && (typeof obj === 'string' ? obj : obj.name).length > 2
    ).slice(0, 5) || []
    
    // Smart brand detection
    const possibleBrands = this.detectBrands(meaningfulLabels, meaningfulObjects)
    
    // Generate context-aware description
    const productContext = this.generateProductContext(category, meaningfulLabels, meaningfulObjects)
    
    // Build comprehensive description
    let description = `# ${category}\n\n`
    
    // Brand information if detected
    if (possibleBrands.length > 0) {
      description += `**🏷️ Brand Recognition:** ${possibleBrands.join(', ')}\n\n`
    }
    
    // Smart product overview
    description += `**📋 Product Analysis:**\n`
    description += `${productContext}\n\n`
    
    // Technical specifications based on category
    const techSpecs = this.generateTechSpecs(category, meaningfulLabels, meaningfulObjects, colors)
    if (techSpecs.length > 0) {
      description += `**⚙️ Key Specifications:**\n`
      techSpecs.forEach(spec => description += `• ${spec}\n`)
      description += `\n`
    }
    
    // Smart features
    const smartFeatures = this.generateSmartFeatures(category, meaningfulLabels, meaningfulObjects)
    description += `**✨ Premium Features:**\n`
    smartFeatures.forEach(feature => description += `• ${feature}\n`)
    description += `\n`
    
    // Design and build quality
    description += `**🏗️ Design & Build Quality:**\n`
    description += this.generateQualityAssessment(meaningfulLabels, meaningfulObjects, category)
    description += `\n\n`
    
    // Target audience and use cases
    description += `**🎯 Ideal For:**\n`
    description += this.generateUseCase(category, meaningfulLabels)
    
    return description
  }

  private static detectBrands(labels: any[], objects: any[]): string[] {
    const getLabelName = (item: any) => typeof item === 'string' ? item : item.name || item.description || ''
    const allText = [...labels.map(getLabelName), ...objects.map(getLabelName)].join(' ').toLowerCase()
    
    const brandDatabase = {
      // Audio brands
      'audio': ['sony', 'apple', 'samsung', 'bose', 'beats', 'sennheiser', 'audio-technica',
               'jbl', 'skullcandy', 'plantronics', 'logitech', 'razer', 'steelseries', 
               'beyerdynamic', 'grado', 'focal', 'audeze', 'hifiman'],
      // Fashion brands  
      'fashion': ['nike', 'adidas', 'puma', 'under armour', 'new balance', 'reebok',
                 'gucci', 'prada', 'louis vuitton', 'chanel', 'hermes', 'zara', 'h&m'],
      // Tech brands
      'tech': ['apple', 'samsung', 'google', 'microsoft', 'dell', 'hp', 'lenovo', 
              'asus', 'acer', 'canon', 'nikon', 'fujifilm', 'olympus'],
      // Auto brands
      'auto': ['bmw', 'mercedes', 'audi', 'toyota', 'honda', 'ford', 'tesla', 
              'porsche', 'ferrari', 'lamborghini', 'volkswagen', 'hyundai']
    }
    
    const allBrands = Object.values(brandDatabase).flat()
    return allBrands.filter(brand => allText.includes(brand))
      .map(brand => brand.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
  }

  private static generateProductContext(category: string, labels: any[], objects: any[]): string {
    const getLabelName = (item: any) => typeof item === 'string' ? item : item.name || item.description || ''
    const labelNames = labels.map(getLabelName)
    const objectNames = objects.map(getLabelName)
    
    const categoryContexts = {
      'Audio/Headphones': `Premium audio device engineered for exceptional sound reproduction and listening comfort. This product combines advanced acoustic technology with ergonomic design, featuring professional-grade components for audiophiles and everyday users alike. The construction emphasizes both audio fidelity and long-term durability.`,
      
      'Automotive Vehicle': `High-performance automotive engineering showcasing precision manufacturing and cutting-edge technology. This vehicle demonstrates superior craftsmanship in both mechanical systems and aesthetic design, built to deliver exceptional driving dynamics and passenger comfort.`,
      
      'Fashion/Clothing': `Contemporary fashion piece crafted with attention to style, comfort, and quality. Made from carefully selected materials using modern manufacturing techniques, this item is designed to complement today's lifestyle while maintaining versatility across different occasions and seasons.`,
      
      'Footwear/Shoes': `Performance-oriented footwear combining advanced materials science with ergonomic design principles. Engineered to provide optimal comfort, support, and durability, whether for athletic performance, professional environments, or casual wear.`,
      
      'Technology/Electronics': `State-of-the-art electronic device incorporating the latest technological innovations. Designed with user experience at its core, featuring intuitive controls, reliable performance, and modern aesthetics that complement contemporary digital lifestyles.`,
      
      'Food/Beverage': `Artfully prepared culinary creation showcasing quality ingredients and expert preparation techniques. Designed to deliver exceptional flavor profiles while maintaining visual appeal and nutritional value.`
    }
    
    const specificContext = categoryContexts[category as keyof typeof categoryContexts]
    
    if (specificContext) {
      // Add specific details based on detected labels
      let enhanced = specificContext
      
      if (labelNames.some(name => name.toLowerCase().includes('professional'))) {
        enhanced += ' Professional-grade specifications make this suitable for demanding applications.'
      }
      
      if (labelNames.some(name => name.toLowerCase().includes('wireless') || name.toLowerCase().includes('bluetooth'))) {
        enhanced += ' Wireless connectivity provides freedom of movement and modern convenience.'
      }
      
      return enhanced
    }
    
    return `Premium product demonstrating exceptional design standards and superior manufacturing quality. Built with careful attention to both functional requirements and aesthetic appeal, ensuring long-lasting performance and user satisfaction.`
  }

  private static generateTechSpecs(category: string, labels: any[], objects: any[], colors: any[]): string[] {
    const specs: string[] = []
    
    if (category.includes('Audio') || category.includes('Headphones')) {
      specs.push('High-resolution audio drivers with extended frequency response')
      specs.push('Ergonomic design optimized for extended listening sessions')
      specs.push('Professional-grade materials and construction')
      specs.push('Advanced acoustic tuning for balanced sound signature')
      if (colors?.length > 0) {
        const colorInfo = colors[0]?.hex ? `${colors[0].hex} finish` : 'premium color finish'
        specs.push(`Available in ${colorInfo}`)
      }
    }
    
    if (category.includes('Automotive')) {
      specs.push('Advanced engineering with precision manufacturing standards')
      specs.push('Premium materials throughout interior and exterior')
      specs.push('Integrated safety and performance systems')
      specs.push('Aerodynamic design optimized for efficiency and performance')
    }
    
    if (category.includes('Fashion') || category.includes('Clothing')) {
      specs.push('Premium textile construction with superior durability')
      specs.push('Contemporary fit and tailored proportions')
      specs.push('Versatile design suitable for multiple styling options')
      specs.push('Quality finishing and attention to detail')
    }
    
    if (category.includes('Technology') || category.includes('Electronics')) {
      specs.push('Latest generation processing capabilities')
      specs.push('User-intuitive interface and control systems')
      specs.push('Robust construction built for reliability')
      specs.push('Modern connectivity and integration features')
    }
    
    return specs
  }

  private static generateSmartFeatures(category: string, labels: any[], objects: any[]): string[] {
    const features = []
    
    // Category-specific features
    if (category.includes('Audio')) {
      features.push('Superior acoustic isolation and sound clarity')
      features.push('Comfortable padding for extended wear')
      features.push('Durable construction built to withstand daily use')
      features.push('Optimized driver configuration for balanced audio')
    } else if (category.includes('Fashion')) {
      features.push('Contemporary styling with timeless appeal')
      features.push('Premium fabric blend for comfort and durability')
      features.push('Versatile design suitable for multiple occasions')
    } else if (category.includes('Technology')) {
      features.push('Cutting-edge performance and reliability')
      features.push('User-friendly interface and controls')
      features.push('Future-proof design with upgrade potential')
    } else {
      features.push('Professional-grade quality and construction')
      features.push('Ergonomic design optimized for user comfort')
      features.push('Durable materials built to last')
    }
    
    // Add universal quality features
    features.push('Meticulous quality control and testing standards')
    features.push('Thoughtful design that prioritizes user experience')
    
    return features.slice(0, 6)
  }

  private static generateQualityAssessment(labels: any[], objects: any[], category: string): string {
    const getLabelName = (item: any) => typeof item === 'string' ? item : item.name || item.description || ''
    const labelNames = labels.map(getLabelName).map(name => name.toLowerCase())
    
    const qualityIndicators = []
    
    // Material quality indicators
    if (labelNames.some(name => name.includes('metal') || name.includes('aluminum') || name.includes('steel'))) {
      qualityIndicators.push('premium metallic construction')
    }
    
    if (labelNames.some(name => name.includes('leather') || name.includes('fabric') || name.includes('textile'))) {
      qualityIndicators.push('high-quality material selection')
    }
    
    if (labelNames.some(name => name.includes('professional') || name.includes('premium'))) {
      qualityIndicators.push('professional-grade specifications')
    }
    
    // Add category-specific quality markers
    qualityIndicators.push('meticulous attention to manufacturing detail')
    qualityIndicators.push('ergonomic considerations throughout the design')
    qualityIndicators.push('robust construction engineered for longevity')
    
    const indicators = qualityIndicators.slice(0, 3).join(', ')
    
    return `This product demonstrates ${indicators}. The overall build quality reflects modern manufacturing excellence, combining functional engineering with aesthetic sophistication. Every component appears carefully considered to deliver both immediate satisfaction and long-term reliability.`
  }

  private static generateUseCase(category: string, labels: any[]): string {
    const useCases = {
      'Audio/Headphones': 'Professional audio engineers, music producers, audiophiles, gamers, and anyone who demands exceptional sound quality for music, podcasts, gaming, or content creation. Perfect for both critical listening and everyday entertainment.',
      
      'Automotive Vehicle': 'Discerning drivers and automotive enthusiasts who appreciate engineering excellence, performance, and luxury. Ideal for those seeking a vehicle that delivers both daily reliability and exceptional driving experiences.',
      
      'Fashion/Clothing': 'Style-conscious individuals who value quality craftsmanship and contemporary design. Perfect for professionals, fashion enthusiasts, and anyone seeking versatile pieces that transition effortlessly between different settings.',
      
      'Footwear/Shoes': 'Active individuals, athletes, and fashion-forward consumers who refuse to compromise between performance and style. Suitable for various activities from professional settings to recreational pursuits.',
      
      'Technology/Electronics': 'Tech professionals, creative users, and early adopters who demand cutting-edge performance and reliability. Ideal for users who integrate technology seamlessly into their productive workflows.'
    }
    
    return useCases[category as keyof typeof useCases] || 'Quality-conscious consumers who appreciate thoughtfully designed products that deliver exceptional value, reliable performance, and lasting satisfaction.'
  }
}

// Next.js route handlers
export async function POST(request: NextRequest) {
  try {
    const data: SmartContentRequest = await request.json()
    const { labels, objects, category, contentType } = data

    const analysis = { labels, objects, category, colors: data.colors || [] }
    const content = SmartContentGenerator.generateEnhancedProductDescription(analysis)

    return NextResponse.json({
      success: true,
      content,
      contentType,
      generated: true
    })

  } catch (error) {
    console.error('Smart content generation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Content generation failed'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    service: 'smart-content-generator',
    capabilities: ['enhanced-descriptions', 'brand-detection', 'quality-assessment']
  })
}