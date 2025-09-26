'use client'

import { useState } from 'react'
import { Upload, X, Sparkles, MessageSquare, ShoppingBag, Share2, Loader2, Copy, Download } from 'lucide-react'

interface ContentSuggestion {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  prompt: string
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [showPrompts, setShowPrompts] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [showResults, setShowResults] = useState<boolean>(false)

  const contentSuggestions: ContentSuggestion[] = [
    {
      id: 'product-description',
      title: 'Product Description',
      description: 'Create detailed product description for website or catalog',
      icon: MessageSquare,
      prompt: 'Write a compelling product description highlighting key features, benefits, and specifications'
    },
    {
      id: 'social-media',
      title: 'Social Media Post',
      description: 'Generate engaging social media content and captions',
      icon: Share2,
      prompt: 'Create an engaging social media post with hashtags and call-to-action for this product'
    },
    {
      id: 'features-list',
      title: 'Key Features',
      description: 'List important features and selling points',
      icon: Sparkles,
      prompt: 'Analyze and list the key features, benefits, and unique selling points of this product'
    },
    {
      id: 'ecommerce-listing',
      title: 'E-commerce Listing',
      description: 'Create optimized listing for online marketplaces',
      icon: ShoppingBag,
      prompt: 'Write an SEO-optimized e-commerce listing with title, bullet points, and description'
    }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setPreviewUrl('')
    setSelectedPrompt('')
    setCustomPrompt('')
  }

  const handleSuggestionSelect = (suggestion: ContentSuggestion) => {
    setSelectedPrompt(suggestion.prompt)
    setCustomPrompt('')
  }

  const handleGenerate = async () => {
    const finalPrompt = selectedPrompt || customPrompt
    if (!finalPrompt || !selectedImage) return

    setIsGenerating(true)
    setGeneratedContent('')
    setShowResults(false)

    try {
      // Determine content type
      const selectedSuggestion = contentSuggestions.find(s => s.prompt === selectedPrompt)
      const contentType = selectedSuggestion?.id || 'custom'

      console.log('🚀 Generating content with:', {
        contentType,
        hasCustomPrompt: !!customPrompt,
        imageSize: selectedImage.size
      })

      // Create FormData for the new Gemini endpoint
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('contentType', contentType)
      if (customPrompt) {
        formData.append('customPrompt', customPrompt)
      }

      // Call our new Gemini-powered API
      const response = await fetch('/api/analyze-product-gemini', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success && data.generatedContent) {
        setGeneratedContent(data.generatedContent)
        setShowResults(true)
        console.log('✅ Content generated successfully')
      } else {
        throw new Error(data.error || 'Failed to generate content')
      }

    } catch (error) {
      console.error('❌ Generation error:', error)
      setGeneratedContent(`Sorry, there was an error generating content: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setShowResults(true)
    } finally {
      setIsGenerating(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4">
      <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Nano Banana
          </h1>
          <p className="text-lg text-gray-700 font-medium">AI-powered product content generator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col transform hover:scale-[1.02] transition-all duration-300">
            <div className="border-2 border-dashed border-indigo-300 rounded-xl hover:border-indigo-400 transition-colors relative flex-1 min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50">
              {previewUrl ? (
                <div className="relative w-full h-full p-2">
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 z-10"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
                    <Upload size={48} className="mx-auto text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Upload Product Image
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click to select or drag and drop your product image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl cursor-pointer hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Upload size={18} />
                    Choose Image
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Content Generation Options */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-xl font-bold text-black mb-6 text-center">
              What would you like me to write?
            </h2>
            
            {/* Suggestion Cards - More Compact */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {contentSuggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon
                return (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md ${
                      selectedPrompt === suggestion.prompt
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <IconComponent 
                          size={18} 
                          className="text-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black text-sm">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Custom Prompt - Compact */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Or write custom request:
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value)
                  setSelectedPrompt('')
                }}
                placeholder="Describe what you want me to write about this product..."
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-gradient-to-r from-gray-50 to-gray-50 hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!selectedImage || (!selectedPrompt && !customPrompt.trim()) || isGenerating}
              className="w-full py-3 px-6 bg-purple-600 text-white font-semibold text-sm rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  {!selectedImage ? 'Upload Image First' : 'Generate Content ✨'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && generatedContent && (
          <div className="mt-8 bg-white rounded-xl shadow-xl border border-gray-100 p-8 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black">
                Generated Content ✨
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedContent)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Copy size={14} />
                  Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedContent], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'generated-content.txt'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 max-h-96 overflow-y-auto border-2 border-gray-100">
              <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {generatedContent}
              </div>
            </div>

            {/* Generate Another Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowResults(false)
                  setGeneratedContent('')
                }}
                className="px-6 py-3 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Generate New Content
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}