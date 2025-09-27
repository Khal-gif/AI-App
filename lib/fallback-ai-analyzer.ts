interface AnalysisResult {
  productCategory: string
  brandSuggestions: string[]
  technicalSpecs: string[]
  marketInsights: string[]
  confidence: number
}

interface ProductDatabase {
  [key: string]: {
    commonBrands: string[]
    technicalFeatures: string[]
    marketSegments: string[]
    priceRanges: string[]
  }
}

export class FallbackAIAnalyzer {
  private productDatabase: ProductDatabase = {
    'gaming-headset': {
      commonBrands: ['SteelSeries', 'HyperX', 'Corsair', 'Razer', 'Logitech G', 'Astro'],
      technicalFeatures: [
        'Anti-drift precision controls',
        'Tournament-grade audio drivers', 
        'Competition-ready microphone',
        'Ultra-low latency wireless',
        'RGB synchronized lighting',
        'Memory foam ear cushions'
      ],
      marketSegments: ['Competitive gaming', 'Streaming', 'Content creation'],
      priceRanges: ['$50-100 (Entry level)', '$100-200 (Mid-range)', '$200+ (Professional)']
    },
    'wireless-earbuds': {
      commonBrands: ['Apple AirPods', 'Sony WF', 'Bose QuietComfort', 'Samsung Galaxy Buds'],
      technicalFeatures: [
        'Active noise cancellation',
        'Transparency mode',
        'Wireless charging case',
        'IPX4 water resistance',
        'Touch controls',
        'Adaptive EQ'
      ],
      marketSegments: ['Fitness', 'Commuting', 'Professional calls'],
      priceRanges: ['$50-100 (Budget)', '$100-200 (Premium)', '$200+ (Flagship)']
    },
    'smartphone': {
      commonBrands: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'],
      technicalFeatures: [
        'Pro camera system',
        '5G connectivity',
        'Fast wireless charging',
        'Advanced biometric security',
        'High refresh rate display',
        'AI-enhanced processing'
      ],
      marketSegments: ['Photography enthusiasts', 'Business users', 'Gaming'],
      priceRanges: ['$200-500 (Mid-range)', '$500-800 (Premium)', '$800+ (Flagship)']
    }
  }

  async analyzeProduct(
    imageLabels: string[], 
    detectedObjects: string[], 
    detectedTexts: string[]
  ): Promise<AnalysisResult> {
    
    // Determine product category from labels and objects
    const category = this.determineCategory(imageLabels, detectedObjects)
    
    // Get relevant database entry
    const productInfo = this.productDatabase[category] || this.getGenericProductInfo()
    
    // Generate brand suggestions based on detected text
    const brandSuggestions = this.generateBrandSuggestions(detectedTexts, productInfo.commonBrands)
    
    // Generate technical specifications
    const technicalSpecs = this.generateTechnicalSpecs(category, productInfo)
    
    // Generate market insights
    const marketInsights = this.generateMarketInsights(category, productInfo)
    
    return {
      productCategory: category,
      brandSuggestions,
      technicalSpecs,
      marketInsights,
      confidence: this.calculateConfidence(imageLabels, detectedObjects, detectedTexts)
    }
  }

  private determineCategory(labels: string[], objects: string[]): string {
    const allDescriptors = [...labels, ...objects].map(item => item.toLowerCase())
    
    // Gaming-related keywords
    if (allDescriptors.some(desc => 
      desc.includes('gaming') || 
      desc.includes('headset') || 
      desc.includes('microphone') ||
      desc.includes('rgb') ||
      desc.includes('controller')
    )) {
      return 'gaming-headset'
    }
    
    // Earbuds/wireless audio
    if (allDescriptors.some(desc => 
      desc.includes('earbud') || 
      desc.includes('wireless') ||
      desc.includes('bluetooth') ||
      desc.includes('airpod')
    )) {
      return 'wireless-earbuds'
    }
    
    // Smartphone
    if (allDescriptors.some(desc => 
      desc.includes('phone') || 
      desc.includes('mobile') ||
      desc.includes('smartphone') ||
      desc.includes('iphone') ||
      desc.includes('android')
    )) {
      return 'smartphone'
    }
    
    // Default to generic electronics
    return 'electronic-device'
  }

  private generateBrandSuggestions(detectedTexts: string[], commonBrands: string[]): string[] {
    const suggestions: string[] = []
    
    // Check for exact brand matches in detected text
    detectedTexts.forEach(text => {
      const matchedBrand = commonBrands.find(brand => 
        text.toLowerCase().includes(brand.toLowerCase())
      )
      if (matchedBrand && !suggestions.includes(matchedBrand)) {
        suggestions.push(matchedBrand)
      }
    })
    
    // If no matches found, suggest top brands for category
    if (suggestions.length === 0) {
      suggestions.push(...commonBrands.slice(0, 3))
    }
    
    return suggestions
  }

  private generateTechnicalSpecs(category: string, productInfo: any): string[] {
    const baseSpecs = productInfo.technicalFeatures || []
    
    // Add category-specific enhancements
    const enhancedSpecs = [...baseSpecs]
    
    if (category === 'gaming-headset') {
      enhancedSpecs.push(
        'Pro-level spatial audio positioning',
        'Tournament-approved frequency response',
        'Zero-lag 2.4GHz wireless connection'
      )
    }
    
    return enhancedSpecs.slice(0, 6) // Limit to 6 features
  }

  private generateMarketInsights(category: string, productInfo: any): string[] {
    const insights: string[] = []
    
    insights.push(`Target market: ${productInfo.marketSegments.join(', ')}`)
    insights.push(`Price positioning: ${productInfo.priceRanges.join(' | ')}`)
    
    // Add category-specific market insights
    if (category === 'gaming-headset') {
      insights.push('Competitive gaming segment showing 25% YoY growth')
      insights.push('Streaming and content creation driving premium demand')
    } else if (category === 'wireless-earbuds') {
      insights.push('Fitness and mobility segments driving adoption')
      insights.push('ANC technology becoming standard expectation')
    }
    
    return insights
  }

  private calculateConfidence(labels: string[], objects: string[], texts: string[]): number {
    let confidence = 0.3 // Base confidence for fallback analysis
    
    // Higher confidence with more detected elements
    confidence += Math.min(labels.length * 0.05, 0.3)
    confidence += Math.min(objects.length * 0.05, 0.2)
    confidence += Math.min(texts.length * 0.1, 0.2)
    
    return Math.min(confidence, 0.8) // Cap at 80% for fallback analysis
  }

  private getGenericProductInfo(): any {
    return {
      commonBrands: ['Premium Brand', 'Professional Series', 'Elite Edition'],
      technicalFeatures: [
        'Professional-grade construction',
        'Advanced material composition', 
        'Ergonomic design principles',
        'Quality assurance tested',
        'Industry-standard compatibility',
        'Optimized performance characteristics'
      ],
      marketSegments: ['Professional users', 'Enthusiasts', 'General consumers'],
      priceRanges: ['Budget-friendly', 'Mid-range value', 'Premium quality']
    }
  }
}

export default FallbackAIAnalyzer