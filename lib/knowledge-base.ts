export interface ProductCategory {
  id: string
  name: string
  keywords: string[]
  commonBrands: string[]
  technicalSpecs: string[]
  priceRanges: PriceRange[]
}

export interface PriceRange {
  min: number
  max: number
  label: string
  description: string
}

export interface BrandInfo {
  name: string
  reputation: 'budget' | 'mid-range' | 'premium' | 'luxury'
  categories: string[]
  keyFeatures: string[]
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'gaming-headsets',
    name: 'Gaming Headsets',
    keywords: ['gaming', 'headset', 'microphone', 'rgb', 'esports', 'tournament'],
    commonBrands: ['SteelSeries', 'HyperX', 'Corsair', 'Razer', 'Logitech G', 'Astro'],
    technicalSpecs: [
      'Frequency response: 20Hz-20kHz',
      'Driver size: 40mm-50mm',
      'Impedance: 32-64 ohms',
      'Sensitivity: 98-108 dB',
      'Microphone: Unidirectional/Omnidirectional',
      'Connection: USB/3.5mm/Wireless 2.4GHz'
    ],
    priceRanges: [
      { min: 30, max: 80, label: 'Entry Level', description: 'Basic gaming features' },
      { min: 80, max: 200, label: 'Mid-Range', description: 'Enhanced audio and comfort' },
      { min: 200, max: 500, label: 'Professional', description: 'Tournament-grade quality' }
    ]
  },
  {
    id: 'wireless-earbuds',
    name: 'Wireless Earbuds',
    keywords: ['earbuds', 'wireless', 'bluetooth', 'anc', 'true wireless', 'tws'],
    commonBrands: ['Apple', 'Sony', 'Bose', 'Samsung', 'Jabra', 'Sennheiser'],
    technicalSpecs: [
      'Driver size: 6mm-12mm',
      'Frequency response: 20Hz-20kHz',
      'Bluetooth version: 5.0-5.3',
      'Battery life: 4-8 hours + case',
      'Water resistance: IPX4-IPX8',
      'Active Noise Cancellation'
    ],
    priceRanges: [
      { min: 50, max: 150, label: 'Consumer', description: 'Good value everyday use' },
      { min: 150, max: 300, label: 'Premium', description: 'Advanced features and quality' },
      { min: 300, max: 600, label: 'Flagship', description: 'Best-in-class technology' }
    ]
  },
  {
    id: 'smartphones',
    name: 'Smartphones',
    keywords: ['phone', 'smartphone', 'mobile', 'iphone', 'android', '5g'],
    commonBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Sony'],
    technicalSpecs: [
      'Display: OLED/LCD, 60-120Hz refresh rate',
      'Processor: Flagship/Mid-range chipset',
      'RAM: 4GB-16GB',
      'Storage: 64GB-1TB',
      'Camera: Multi-lens system',
      'Battery: 3000-5000mAh with fast charging'
    ],
    priceRanges: [
      { min: 200, max: 500, label: 'Mid-Range', description: 'Good performance for most users' },
      { min: 500, max: 800, label: 'Premium', description: 'Advanced features and build' },
      { min: 800, max: 1500, label: 'Flagship', description: 'Latest technology and materials' }
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing & Apparel',
    keywords: ['shirt', 'jacket', 'pants', 'dress', 'hoodie', 'fashion', 'apparel'],
    commonBrands: ['Nike', 'Adidas', 'Uniqlo', 'H&M', 'Zara', 'Gap'],
    technicalSpecs: [
      'Material composition',
      'Care instructions',
      'Fit type: Regular/Slim/Loose',
      'Size range: XS-XXL',
      'Season: Spring/Summer/Fall/Winter',
      'Style: Casual/Formal/Athletic'
    ],
    priceRanges: [
      { min: 10, max: 50, label: 'Budget', description: 'Affordable everyday wear' },
      { min: 50, max: 150, label: 'Mid-Range', description: 'Quality brands and materials' },
      { min: 150, max: 500, label: 'Premium', description: 'Designer and luxury brands' }
    ]
  }
]

export const BRAND_DATABASE: BrandInfo[] = [
  {
    name: 'Apple',
    reputation: 'premium',
    categories: ['smartphones', 'earbuds', 'tablets', 'laptops'],
    keyFeatures: ['Premium build quality', 'Seamless ecosystem', 'Industry-leading design']
  },
  {
    name: 'SteelSeries',
    reputation: 'premium',
    categories: ['gaming-headsets', 'gaming-accessories'],
    keyFeatures: ['Tournament-grade quality', 'Professional esports partnerships', 'Advanced audio']
  },
  {
    name: 'Sony',
    reputation: 'premium',
    categories: ['earbuds', 'headphones', 'cameras', 'gaming'],
    keyFeatures: ['Audio expertise', 'Innovative technology', 'Professional quality']
  },
  {
    name: 'Nike',
    reputation: 'premium',
    categories: ['clothing', 'footwear', 'sports-accessories'],
    keyFeatures: ['Athletic performance', 'Innovation in materials', 'Style leadership']
  },
  {
    name: 'Samsung',
    reputation: 'premium',
    categories: ['smartphones', 'earbuds', 'tablets', 'displays'],
    keyFeatures: ['Cutting-edge displays', 'Advanced cameras', 'Feature innovation']
  }
]

export class KnowledgeBase {
  static getCategory(keywords: string[]): ProductCategory | null {
    const normalizedKeywords = keywords.map(k => k.toLowerCase())
    
    for (const category of PRODUCT_CATEGORIES) {
      const matchCount = category.keywords.filter(keyword => 
        normalizedKeywords.some(k => k.includes(keyword.toLowerCase()))
      ).length
      
      if (matchCount > 0) {
        return category
      }
    }
    
    return null
  }

  static getBrandInfo(brandName: string): BrandInfo | null {
    return BRAND_DATABASE.find(brand => 
      brand.name.toLowerCase() === brandName.toLowerCase()
    ) || null
  }

  static suggestBrands(categoryId: string): string[] {
    const category = PRODUCT_CATEGORIES.find(cat => cat.id === categoryId)
    return category?.commonBrands || []
  }

  static getPriceEstimate(categoryId: string, features: string[]): PriceRange | null {
    const category = PRODUCT_CATEGORIES.find(cat => cat.id === categoryId)
    if (!category) return null

    // Simple heuristic: more features = higher price range
    const featureCount = features.length
    if (featureCount <= 3) return category.priceRanges[0]
    if (featureCount <= 6) return category.priceRanges[1]
    return category.priceRanges[2]
  }
}

export default KnowledgeBase