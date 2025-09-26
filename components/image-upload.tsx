'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Upload, Link, FileImage, Loader2, Bot, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  className?: string
}

interface ImageHistoryItem {
  id: string
  url: string
  prompt: string
  timestamp: number
}

export function ImageUpload({ className }: ImageUploadProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [externalLink, setExternalLink] = useState('')
  const [editInstructions, setEditInstructions] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([])
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'google'>('google')
  const [aspectRatio, setAspectRatio] = useState<string>('1:1')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle file upload from computer with universal format support
  const handleFileUpload = useCallback(async (file: File) => {
    // Extended format support
    const supportedFormats = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif',
      'image/tiff', 'image/tif', 'image/bmp', 'image/gif', 'image/svg+xml',
      'image/heic', 'image/heif', 'image/raw', 'image/cr2', 'image/nef',
      'image/dng', 'image/x-canon-cr2', 'image/x-canon-crw', 'image/x-nikon-nef'
    ]
    
    const isSupported = supportedFormats.some(format => 
      file.type.toLowerCase() === format || 
      file.name.toLowerCase().endsWith(format.split('/')[1])
    )
    
    if (!isSupported) {
      toast({
        title: "Unsupported file type",
        description: `Supported formats: JPEG, PNG, WebP, AVIF, TIFF, BMP, GIF, HEIC, RAW, CR2, NEF, DNG and more`,
        variant: "destructive",
      })
      return
    }

    if (file.size > 50 * 1024 * 1024) { // Increased to 50MB for RAW files
      toast({
        title: "File too large",
        description: "Please select an image smaller than 50MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setProgress(0)
    
    try {
      // Read file as base64
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 50)) // 50% for reading
          }
        }
        reader.readAsDataURL(file)
      })
      
      setProgress(60)
      
      // Process image through universal processor
      const isHEIC = file.type.includes('heic') || file.type.includes('heif') || 
                     file.name.toLowerCase().includes('.heic') || file.name.toLowerCase().includes('.heif')
      
      if (isHEIC) {
        console.log('📱 Processing HEIC/HEIF image from iPhone/iPad...')
        setProgress(65) // Extra progress for HEIC conversion
      } else {
        console.log('🔄 Processing image format:', file.type)
      }
      
      const processResponse = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: fileData,
          format: 'jpeg', // Convert to JPEG for Vision API compatibility
          quality: 85,
          maxWidth: 2048, // Reasonable limit for analysis
          maxHeight: 2048,
          optimize: true
        })
      })
      
      setProgress(80)
      const processResult = await processResponse.json()
      
      if (processResult.success) {
        setCurrentImage(processResult.processedImage)
        setExternalLink('')
        setProgress(100)
        setIsUploading(false)
        
        toast({
          title: "Image processed successfully!",
          description: `Converted ${processResult.originalFormat} to ${processResult.processedFormat}. Size: ${Math.round(processResult.processedSize / 1024)}KB`,
        })
      } else {
        throw new Error(processResult.error || 'Image processing failed')
      }
      
    } catch (error) {
      setIsUploading(false)
      setProgress(0)
      console.error('Image processing error:', error)
      
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process the image",
        variant: "destructive",
      })
    }
  }, [toast])

  // Handle external link submission
  const handleExternalLink = useCallback(async () => {
    if (!externalLink.trim()) {
      toast({
        title: "URL required",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setProgress(0)

    try {
      // Validate URL format
      new URL(externalLink)
      
      // Test if image loads
      await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          setProgress(100)
          resolve(img)
        }
        img.onerror = reject
        img.src = externalLink
        
        // Progress simulation
        let currentProgress = 0
        const interval = setInterval(() => {
          currentProgress += 10
          setProgress(Math.min(currentProgress, 90))
          if (currentProgress >= 90) clearInterval(interval)
        }, 100)
      })
      
      setCurrentImage(externalLink)
      setIsUploading(false)
      toast({
        title: "Image loaded",
        description: "External image loaded successfully",
      })
    } catch (error) {
      setIsUploading(false)
      setProgress(0)
      toast({
        title: "Failed to load image",
        description: "Unable to load image from the provided URL. Please check the link.",
        variant: "destructive",
      })
    }
  }, [externalLink, toast])

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Add current image to history
  const addToHistory = useCallback((imageUrl: string, prompt: string) => {
    const historyItem: ImageHistoryItem = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: imageUrl,
      prompt,
      timestamp: Date.now()
    }
    
    setImageHistory(prev => [historyItem, ...prev.slice(0, 19)]) // Keep last 20 images
  }, [])

  // Load image from history
  const loadFromHistory = useCallback((historyItem: ImageHistoryItem) => {
    // Add current image to history before switching
    if (currentImage && editInstructions.trim()) {
      addToHistory(currentImage, editInstructions)
    }
    
    setCurrentImage(historyItem.url)
    setEditInstructions('') // Clear instructions for new editing session
    
    toast({
      title: "Image loaded from history",
      description: `Loaded: "${historyItem.prompt.slice(0, 50)}${historyItem.prompt.length > 50 ? '...' : ''}"`,
    })
  }, [currentImage, editInstructions, addToHistory, toast])

  // Convert image to base64
  const convertImageToBase64 = useCallback(async (imageUrl: string): Promise<string> => {
    try {
      if (imageUrl.startsWith('data:')) {
        // Already base64, extract the data part
        return imageUrl.split(',')[1]
      }
      
      // If it's a URL, we need to fetch and convert
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1]) // Remove data:image/...;base64, prefix
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Failed to convert image to base64:', error)
      throw error
    }
  }, [])

  // API submission - Now uses Google AI generate endpoint
  const handleSubmit = useCallback(async () => {
    if (!editInstructions.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide editing instructions",
        variant: "destructive",
      })
      return
    }

    if (!currentImage) {
      toast({
        title: "No image",
        description: "Please upload an image first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      setProgress(20)
      
      // Convert image to base64
      const base64Image = await convertImageToBase64(currentImage)
      
      setProgress(40)
      
      // Build the prompt for Google AI
      const fullPrompt = editInstructions.trim()

      setProgress(50)
      
      // Call analyze-product endpoint for better content generation
      const response = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: currentImage,
          contentType: 'custom',
          customPrompt: fullPrompt
        })
      })

      setProgress(70)
      const data = await response.json()
      
      console.log('🔍 API Response:', data) // Debug log
      
      if (!data.success) {
        throw new Error(data.error || 'Generation failed')
      }

      setProgress(90)

      // Store the generated content and analysis results
      if (data.generatedContent) {
        setGeneratedContent(data.generatedContent)
        setAnalysisResults(data.productAnalysis)
        toast({
          title: "Content created successfully!",
          description: "Your marketing content is ready. You can copy it or generate new content.",
        })
      } else {
        throw new Error('No content generated')
      }
      
      // Clear edit instructions
      setEditInstructions('')
      setProgress(100)
      
      console.log('✅ Content Generation completed:', data)
      
    } catch (error) {
      console.error('❌ Generation error:', error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }, [currentImage, editInstructions, addToHistory, toast, convertImageToBase64, aspectRatio, selectedProvider])

  // Clear and start over
  const clearImage = useCallback(() => {
    // Add current image to history before clearing
    if (currentImage) {
      const prompt = editInstructions.trim() || 'Original image'
      addToHistory(currentImage, prompt)
    }
    
    setCurrentImage(null)
    setExternalLink('')
    setEditInstructions('')
    setProgress(0)
  }, [currentImage, editInstructions, addToHistory])

  // Clear all history
  const clearHistory = useCallback(() => {
    setImageHistory([])
    toast({
      title: "History cleared",
      description: "All previous images have been removed from history",
    })
  }, [toast])

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full max-w-md mx-auto">
        {!currentImage ? (
          // Simple Upload Button
          <div className="text-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline" 
              size="lg"
              className="h-16 px-8 text-lg border-border hover:bg-accent"
            >
              <Upload className="h-6 w-6 mr-3" />
              Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif,.raw,.cr2,.nef,.dng"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
            
            {/* Progress */}
            {isUploading && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">Uploading... {progress}%</p>
              </div>
            )}
          </div>
        ) : (
          // Side-by-side Layout: Image and Content Creator
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto min-h-[600px]">
            {/* Left: Image Display */}
            <div className="flex-1 space-y-4">
              <div className="relative w-full bg-accent/20 rounded-lg overflow-hidden shadow-md min-h-[200px] flex items-center justify-center">
                <img 
                  src={currentImage} 
                  alt="Uploaded image" 
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              </div>
              <Button
                onClick={clearImage}
                variant="outline" 
                className="w-full h-12"
              >
                Upload Different Image
              </Button>
            </div>
            
            {/* Right: Marketing Content Creator */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Create Marketing Content</h3>
                <p className="text-muted-foreground">Describe what kind of marketing content you want AI to create from this image</p>
              </div>
              
              {/* Custom Input */}
              <div className="space-y-4">
                <Input
                  placeholder="e.g., Write compelling product copy, Create social media captions, Generate ad headlines..."
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  className="h-14 text-base px-4"
                />
                
                <Button 
                  onClick={handleSubmit}
                  disabled={!editInstructions.trim() || isProcessing}
                  className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Creating Content...
                    </>
                  ) : (
                    'Generate Marketing Content'
                  )}
                </Button>
              </div>
              
              {/* Processing Progress */}
              {isProcessing && (
                <div className="space-y-3">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-muted-foreground">Analyzing image and creating content... {progress}%</p>
                </div>
              )}
              
              {/* Analysis Results */}
              {analysisResults && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">🔍 What We Detected:</h4>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">📂 Category:</p>
                        <p className="text-blue-600 dark:text-blue-400">{analysisResults.category || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">🏷️ Labels Found:</p>
                        <p className="text-blue-600 dark:text-blue-400">{analysisResults.labels?.slice(0, 4).join(', ') || 'None detected'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">📦 Objects:</p>
                        <p className="text-blue-600 dark:text-blue-400">{analysisResults.objects?.slice(0, 3).join(', ') || 'None detected'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">🎨 Dominant Colors:</p>
                        <p className="text-blue-600 dark:text-blue-400">{analysisResults.colors?.slice(0, 2).join(', ') || 'Not detected'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Content Preview */}
              {generatedContent && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">📝 Generated Content:</h4>
                  <div className="bg-accent/30 border border-border rounded-lg p-6 max-h-80 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {generatedContent.split('\n').map((line, index) => (
                        <p key={index} className="mb-3 last:mb-0 text-sm leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigator.clipboard.writeText(generatedContent)}
                      variant="outline"
                      className="flex-1 h-12"
                    >
                      Copy Content
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedContent('')
                        setAnalysisResults(null)
                      }}
                      variant="outline"
                      className="h-12"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History Strip - Fixed at bottom */}
      {imageHistory.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Image History</h3>
              <Button 
                onClick={clearHistory}
                variant="ghost" 
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            </div>
            
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
              {imageHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 group cursor-pointer"
                  onClick={() => loadFromHistory(item)}
                >
                  <div className="relative">
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all duration-200 group-hover:scale-105"
                    />
                    {/* Tooltip overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white text-xs text-center px-2 leading-tight">
                        {item.prompt.length > 30 ? `${item.prompt.slice(0, 27)}...` : item.prompt}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {new Date(item.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add bottom padding when history is visible */}
      {imageHistory.length > 0 && (
        <div className="h-32" /> 
      )}
    </div>
  )
}