/**
 * KNOWLEDGE BASE EXPANDER
 * 
 * This system uses internet search and Gemini AI to continuously expand 
 * the knowledge base with new product information, brands, and specifications.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { FallbackAIAnalyzer } from './fallback-ai-analyzer'

export interface KnowledgeExpansionRequest {
  category: string
  detectedLabels: string[]
  detectedObjects: string[]
  currentBrands: string[]
  confidence: number
}

export interface ExpandedKnowledge {
  newBrands: BrandSuggestion[]
  enhancedSpecs: SpecSuggestion[]
  marketInsights: MarketInsight[]
  categoryRefinements: CategoryRefinement[]
  confidenceBoost: number
}

export interface BrandSuggestion {
  name: string
  reputation: 'budget' | 'mid-range' | 'premium' | 'luxury'
  specialties: string[]
  knownFor: string[]
  confidence: number
  source: 'internet' | 'gemini' | 'hybrid'
}

export interface SpecSuggestion {
  name: string
  description: string
  category: string
  importance: 'high' | 'medium' | 'low'
  source: 'internet' | 'gemini'
}

export interface MarketInsight {
  trend: string
  description: string
  relevance: number
  priceImpact?: string
}

export interface CategoryRefinement {
  originalCategory: string
  suggestedCategory: string
  confidence: number
  reasoning: string
}

export class KnowledgeExpander {
  private geminiClient: GoogleGenerativeAI | null = null

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      this.geminiClient = new GoogleGenerativeAI(apiKey)
    }
  }

  /**
   * Main expansion method - combines internet search + Gemini AI analysis
   */
  async expandKnowledge(request: KnowledgeExpansionRequest): Promise<ExpandedKnowledge> {
    console.log('🔍 KNOWLEDGE BASE EXPANSION:')
    console.log('📂 Category:', request.category)
    console.log('🏷️ Labels:', request.detectedLabels)
    console.log('🎯 Current brands:', request.currentBrands.length)

    const results: ExpandedKnowledge = {
      newBrands: [],
      enhancedSpecs: [],
      marketInsights: [],
      categoryRefinements: [],
      confidenceBoost: 0
    }

    try {
      // 1. Internet search for brand and product information
      const internetResults = await this.searchInternetForKnowledge(request)
      
      // 2. AI analysis for deeper insights (Gemini -> OpenAI -> Fallback)
      let aiResults = null
      
      try {
        aiResults = await this.analyzeWithGemini(request, internetResults)
      } catch (geminiError) {
        console.log('⚠️ Gemini failed, trying OpenAI fallback...', geminiError)
        
        try {
          aiResults = await FallbackAIAnalyzer.analyzeWithOpenAI(request)
        } catch (openaiError) {
          console.log('⚠️ OpenAI fallback failed, using intelligent fallback...', openaiError)
          
          // Always use built-in intelligent analysis when external AI fails
          console.log('🧠 Using built-in intelligent analysis...')
          const fallbackResults = FallbackAIAnalyzer.analyzeProductIntelligently(request)
          console.log('📊 Fallback results:', {
            brands: fallbackResults.newBrands.length,
            specs: fallbackResults.enhancedSpecs.length,
            insights: fallbackResults.marketInsights.length
          })
          aiResults = this.convertFallbackToGeminiFormat(fallbackResults)
        }
      }
      
      // 3. Combine and validate results
      const expandedKnowledge = this.combineResults(internetResults, aiResults)
      
      console.log('✅ Knowledge expansion completed:')
      console.log('🆕 New brands found:', expandedKnowledge.newBrands.length)
      console.log('⚙️ Enhanced specs:', expandedKnowledge.enhancedSpecs.length)
      console.log('📊 Market insights:', expandedKnowledge.marketInsights.length)

      return expandedKnowledge

    } catch (error) {
      console.error('❌ Knowledge expansion failed:', error)
      return results
    }
  }

  /**
   * Search internet for product knowledge
   */
  private async searchInternetForKnowledge(request: KnowledgeExpansionRequest): Promise<any> {
    const searchTerms = [
      `${request.category} brands premium luxury`,
      `${request.detectedLabels.join(' ')} specifications features`,
      `${request.category} market trends 2024 2025`,
      `best ${request.category.toLowerCase()} brands professional`
    ]

    const searchResults = []

    for (const term of searchTerms) {
      try {
        // Enhanced search with multiple APIs
        const results = await this.performEnhancedSearch(term)
        searchResults.push(...results)
      } catch (error) {
        console.log(`⚠️ Search failed for "${term}":`, error)
      }
    }

    return this.processSearchResults(searchResults, request)
  }

  /**
   * Enhanced search using multiple sources
   */
  private async performEnhancedSearch(query: string): Promise<any[]> {
    const results = []

    try {
      // Method 1: Google Search API (if available)
      if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
        const googleResults = await this.googleCustomSearch(query)
        results.push(...googleResults)
      }

      // Method 2: DuckDuckGo Search
      const duckResults = await this.duckDuckGoSearch(query)
      results.push(...duckResults)

      // Method 3: Reddit Search (for community insights)
      const redditResults = await this.searchReddit(query)
      results.push(...redditResults)

    } catch (error) {
      console.log('⚠️ Enhanced search error:', error)
    }

    return results
  }

  /**
   * Google Custom Search implementation
   */
  private async googleCustomSearch(query: string): Promise<any[]> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const cx = process.env.GOOGLE_SEARCH_CX
    
    if (!apiKey || !cx) return []

    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`
      
      const response = await fetch(url)
      const data = await response.json()
      
      return data.items?.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        url: item.link,
        source: 'google'
      })) || []

    } catch (error) {
      console.log('⚠️ Google search failed:', error)
      return []
    }
  }

  /**
   * DuckDuckGo search (web scraping approach)
   */
  private async duckDuckGoSearch(query: string): Promise<any[]> {
    try {
      // Use a web scraping approach for DuckDuckGo
      const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      const html = await response.text()
      
      // Basic HTML parsing to extract results
      const results = this.parseDuckDuckGoHTML(html)
      return results.map(result => ({ ...result, source: 'duckduckgo' }))

    } catch (error) {
      console.log('⚠️ DuckDuckGo search failed:', error)
      return []
    }
  }

  /**
   * Reddit search for community insights
   */
  private async searchReddit(query: string): Promise<any[]> {
    try {
      // Use Reddit's JSON API
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Nano-Banana-Knowledge-Expander/1.0'
        }
      })
      
      const data = await response.json()
      
      return data.data?.children?.map((post: any) => ({
        title: post.data.title,
        snippet: post.data.selftext?.substring(0, 200) || '',
        url: `https://reddit.com${post.data.permalink}`,
        score: post.data.score,
        source: 'reddit'
      })) || []

    } catch (error) {
      console.log('⚠️ Reddit search failed:', error)
      return []
    }
  }

  /**
   * Analyze results with Gemini AI
   */
  private async analyzeWithGemini(request: KnowledgeExpansionRequest, internetResults: any): Promise<any> {
    if (!this.geminiClient) {
      console.log('⚠️ Gemini API not available')
      return null
    }

    try {
      const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `You are a product knowledge expert. Analyze this product information and provide insights:

PRODUCT ANALYSIS:
Category: ${request.category}
Detected Labels: ${request.detectedLabels.join(', ')}
Detected Objects: ${request.detectedObjects.join(', ')}
Current Brands Known: ${request.currentBrands.join(', ')}

INTERNET RESEARCH RESULTS:
${JSON.stringify(internetResults, null, 2)}

Please provide a JSON response with:
1. "brands" - Array of brand suggestions with name, reputation (budget/mid-range/premium/luxury), specialties, and what they're known for
2. "specifications" - Technical specs relevant to this product category
3. "market_insights" - Current market trends and insights
4. "category_refinement" - Better category classification if needed

Focus on accuracy and provide only well-known, reputable information. Format as valid JSON.`

      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      console.log('🤖 Gemini analysis completed')
      
      try {
        return JSON.parse(response)
      } catch (parseError) {
        console.log('⚠️ Gemini JSON parse failed, using raw text')
        return { raw_analysis: response }
      }

    } catch (error) {
      console.error('❌ Gemini analysis failed:', error)
      return null
    }
  }

  /**
   * Process and extract knowledge from search results
   */
  private processSearchResults(results: any[], request: KnowledgeExpansionRequest): any {
    const processedKnowledge = {
      brandMentions: new Set<string>(),
      specifications: new Set<string>(),
      marketTerms: new Set<string>(),
      qualityIndicators: new Set<string>()
    }

    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase()
      
      // Extract brand mentions
      this.extractBrandMentions(text, processedKnowledge.brandMentions)
      
      // Extract specification terms
      this.extractSpecifications(text, request.category, processedKnowledge.specifications)
      
      // Extract quality indicators
      this.extractQualityIndicators(text, processedKnowledge.qualityIndicators)
    })

    return {
      brands: Array.from(processedKnowledge.brandMentions),
      specs: Array.from(processedKnowledge.specifications),
      quality: Array.from(processedKnowledge.qualityIndicators),
      sourceCount: results.length
    }
  }

  /**
   * Extract brand mentions from text
   */
  private extractBrandMentions(text: string, brandSet: Set<string>): void {
    // Common brand patterns
    const brandPatterns = [
      /\b(sony|bose|beats|sennheiser|audio-technica|jbl|samsung|apple|nike|adidas)\b/gi,
      /\b([A-Z][a-z]+)\s+(?:headphones|smartphones|shoes|clothing|brand)\b/gi
    ]

    brandPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => brandSet.add(match.trim()))
      }
    })
  }

  /**
   * Extract technical specifications
   */
  private extractSpecifications(text: string, category: string, specSet: Set<string>): void {
    const categorySpecs = {
      'Audio': ['frequency response', 'impedance', 'driver', 'noise cancellation', 'bluetooth', 'battery life'],
      'Fashion': ['fabric', 'cotton', 'polyester', 'size', 'fit', 'care instructions'],
      'Technology': ['processor', 'memory', 'storage', 'display', 'battery', 'connectivity'],
      'Automotive': ['engine', 'transmission', 'fuel economy', 'horsepower', 'torque', 'safety rating']
    }

    const relevantSpecs = categorySpecs[category.split('/')[0]] || []
    
    relevantSpecs.forEach(spec => {
      if (text.includes(spec.toLowerCase())) {
        specSet.add(spec)
      }
    })
  }

  /**
   * Extract quality indicators
   */
  private extractQualityIndicators(text: string, qualitySet: Set<string>): void {
    const qualityTerms = [
      'premium', 'professional', 'high-quality', 'durable', 'reliable',
      'certified', 'award-winning', 'industry-leading', 'top-rated'
    ]

    qualityTerms.forEach(term => {
      if (text.includes(term)) {
        qualitySet.add(term)
      }
    })
  }

  /**
   * Combine internet and Gemini results
   */
  private combineResults(internetResults: any, geminiResults: any): ExpandedKnowledge {
    const combined: ExpandedKnowledge = {
      newBrands: [],
      enhancedSpecs: [],
      marketInsights: [],
      categoryRefinements: [],
      confidenceBoost: 0
    }

    // Process internet results
    if (internetResults) {
      internetResults.brands?.forEach((brand: string) => {
        combined.newBrands.push({
          name: brand,
          reputation: 'mid-range', // Default, should be refined
          specialties: [],
          knownFor: [],
          confidence: 0.6,
          source: 'internet'
        })
      })

      internetResults.specs?.forEach((spec: string) => {
        combined.enhancedSpecs.push({
          name: spec,
          description: `Enhanced ${spec} capability`,
          category: 'General',
          importance: 'medium',
          source: 'internet'
        })
      })
    }

    // Process Gemini results
    if (geminiResults?.brands) {
      geminiResults.brands.forEach((brand: any) => {
        combined.newBrands.push({
          name: brand.name,
          reputation: brand.reputation || 'mid-range',
          specialties: brand.specialties || [],
          knownFor: brand.known_for || [],
          confidence: 0.8,
          source: 'gemini'
        })
      })
    }

    if (geminiResults?.specifications) {
      geminiResults.specifications.forEach((spec: any) => {
        combined.enhancedSpecs.push({
          name: spec.name || spec,
          description: spec.description || `Advanced ${spec} features`,
          category: spec.category || 'General',
          importance: spec.importance || 'medium',
          source: 'gemini'
        })
      })
    }

    // Calculate confidence boost
    combined.confidenceBoost = (combined.newBrands.length * 0.1) + (combined.enhancedSpecs.length * 0.05)

    return combined
  }

  /**
   * Convert fallback results to Gemini format for consistency
   */
  private convertFallbackToGeminiFormat(fallbackResults: ExpandedKnowledge): any {
    return {
      brands: fallbackResults.newBrands?.map(brand => ({
        name: brand.name,
        reputation: brand.reputation,
        specialties: brand.specialties,
        known_for: brand.knownFor
      })) || [],
      specifications: fallbackResults.enhancedSpecs?.map(spec => ({
        name: spec.name,
        description: spec.description,
        category: spec.category,
        importance: spec.importance
      })) || [],
      market_insights: fallbackResults.marketInsights || [],
      source: 'fallback'
    }
  }

  /**
   * Simple HTML parser for DuckDuckGo results
   */
  private parseDuckDuckGoHTML(html: string): any[] {
    // Basic regex-based parsing (would use proper HTML parser in production)
    const results = []
    const resultPattern = /<a class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g
    
    let match
    while ((match = resultPattern.exec(html)) !== null && results.length < 5) {
      results.push({
        title: match[2],
        url: match[1],
        snippet: '' // Would extract snippet with more complex parsing
      })
    }
    
    return results
  }
}

/**
 * USAGE EXAMPLE
 */
export async function expandProductKnowledge(
  category: string,
  labels: string[],
  objects: string[],
  currentBrands: string[] = []
): Promise<ExpandedKnowledge> {
  const expander = new KnowledgeExpander()
  
  return await expander.expandKnowledge({
    category,
    detectedLabels: labels,
    detectedObjects: objects,
    currentBrands,
    confidence: 0.7
  })
}

export default KnowledgeExpander