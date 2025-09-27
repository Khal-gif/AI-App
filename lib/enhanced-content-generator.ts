interface ContentGenerationOptions {
  productCategory: string
  detectedLabels: string[]
  detectedObjects: string[]
  detectedTexts: string[]
  colors: string[]
  contentType: 'product-description' | 'social-media' | 'features-list' | 'ecommerce-listing' | 'custom'
  customPrompt?: string
}

interface GeneratedContent {
  title: string
  description: string
  bulletPoints: string[]
  tags: string[]
  confidence: number
}

export class EnhancedContentGenerator {
  private brandDatabase: Map<string, any> = new Map()
  private productSpecs: Map<string, any> = new Map()

  constructor() {
    this.initializeDatabases()
  }

  private initializeDatabases() {
    // Popular brands database
    const brands = [
      'Apple', 'Samsung', 'Sony', 'Bose', 'Nike', 'Adidas', 'Canon', 'Nikon',
      'Dell', 'HP', 'Lenovo', 'Microsoft', 'Google', 'Amazon', 'JBL', 'Beats',
      'Logitech', 'Razer', 'Corsair', 'SteelSeries', 'HyperX', 'Audio-Technica'
    ]

    brands.forEach(brand => {
      this.brandDatabase.set(brand.toLowerCase(), {
        name: brand,
        reputation: 'premium',
        category: 'electronics'
      })
    })

    // Product specifications templates
    this.productSpecs.set('headphones', {
      features: ['High-quality audio drivers', 'Comfortable padding', 'Adjustable headband', 'Clear microphone'],
      specifications: ['Frequency response', 'Impedance', 'Driver size', 'Connectivity'],
      benefits: ['Immersive audio experience', 'Long-wearing comfort', 'Crystal-clear communication']
    })

    this.productSpecs.set('clothing', {
      features: ['Premium materials', 'Comfortable fit', 'Durable construction', 'Stylish design'],
      specifications: ['Material composition', 'Care instructions', 'Sizing information'],
      benefits: ['All-day comfort', 'Long-lasting quality', 'Versatile styling']
    })
  }

  async generateContent(options: ContentGenerationOptions): Promise<GeneratedContent> {
    const { productCategory, detectedLabels, detectedTexts, contentType, customPrompt } = options

    // Detect potential brand from texts
    const detectedBrand = this.detectBrand(detectedTexts)
    
    // Get product specifications
    const specs = this.getProductSpecs(productCategory)

    // Generate content based on type
    let content: GeneratedContent

    switch (contentType) {
      case 'product-description':
        content = this.generateProductDescription(productCategory, detectedBrand, specs)
        break
      case 'social-media':
        content = this.generateSocialMediaContent(productCategory, detectedBrand)
        break
      case 'features-list':
        content = this.generateFeaturesList(productCategory, specs)
        break
      case 'ecommerce-listing':
        content = this.generateEcommerceListing(productCategory, detectedBrand, specs)
        break
      default:
        content = this.generateProductDescription(productCategory, detectedBrand, specs)
    }

    return content
  }

  private detectBrand(texts: string[]): string | null {
    for (const text of texts) {
      const brand = this.brandDatabase.get(text.toLowerCase())
      if (brand) {
        return brand.name
      }
    }
    return null
  }

  private getProductSpecs(category: string): any {
    const normalizedCategory = category.toLowerCase()
    
    if (normalizedCategory.includes('headphone') || normalizedCategory.includes('audio')) {
      return this.productSpecs.get('headphones')
    }
    
    if (normalizedCategory.includes('clothing') || normalizedCategory.includes('apparel')) {
      return this.productSpecs.get('clothing')
    }

    // Default specs
    return {
      features: ['Quality construction', 'Professional design', 'Reliable performance'],
      specifications: ['Dimensions', 'Materials', 'Compatibility'],
      benefits: ['Enhanced functionality', 'Professional results', 'Long-term value']
    }
  }

  private generateProductDescription(category: string, brand: string | null, specs: any): GeneratedContent {
    const brandText = brand ? `${brand} ` : ''
    
    return {
      title: `${brandText}${category} - Professional Quality`,
      description: `This ${brandText.toLowerCase()}${category.toLowerCase()} combines professional-grade construction with user-focused design. ${specs.benefits.join(', ')} make this an excellent choice for both personal and professional use.`,
      bulletPoints: specs.features,
      tags: [category.toLowerCase(), 'professional', 'quality'],
      confidence: brand ? 0.9 : 0.7
    }
  }

  private generateSocialMediaContent(category: string, brand: string | null): GeneratedContent {
    const brandText = brand ? `${brand} ` : ''
    
    return {
      title: `🔥 Check out this ${brandText}${category}!`,
      description: `Just discovered this amazing ${brandText.toLowerCase()}${category.toLowerCase()}! The quality and design are incredible. Perfect for anyone looking to upgrade their setup. #${category.replace(/\s+/g, '')} #Quality #Tech`,
      bulletPoints: [
        'Amazing build quality',
        'Perfect for daily use',
        'Great value for money',
        'Highly recommended!'
      ],
      tags: [category.toLowerCase(), 'recommendation', 'quality'],
      confidence: 0.8
    }
  }

  private generateFeaturesList(category: string, specs: any): GeneratedContent {
    return {
      title: `${category} - Key Features`,
      description: `Professional ${category.toLowerCase()} designed for optimal performance and user experience.`,
      bulletPoints: specs.features,
      tags: [category.toLowerCase(), 'features', 'specifications'],
      confidence: 0.8
    }
  }

  private generateEcommerceListing(category: string, brand: string | null, specs: any): GeneratedContent {
    const brandText = brand ? `${brand} ` : ''
    
    return {
      title: `${brandText}${category} | Professional Grade | Fast Shipping`,
      description: `Premium ${brandText.toLowerCase()}${category.toLowerCase()} featuring ${specs.benefits.join(', ')}. Perfect for professional use or personal enjoyment. Backed by quality guarantee and fast shipping.`,
      bulletPoints: [
        ...specs.features,
        'Fast shipping available',
        'Quality guarantee',
        'Professional customer support'
      ],
      tags: [category.toLowerCase(), 'professional', 'fast-shipping', 'guaranteed'],
      confidence: brand ? 0.9 : 0.75
    }
  }
}

export default EnhancedContentGenerator