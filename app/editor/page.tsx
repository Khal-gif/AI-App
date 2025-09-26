'use client'

import { EditorLayout } from '@/components/layout/editor-layout'
import { ToolPalette } from '@/components/canvas/tool-palette'
import { PropertiesPanel } from '@/components/canvas/properties-panel'
import { GenerationForm } from '@/components/forms/generation-form'
import { useCurrentImage, useEditorStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Wand2 } from 'lucide-react'
import { useRef } from 'react'

export default function EditorPage() {
  const currentImage = useCurrentImage()
  const { setCurrentImage, addGeneratedImage } = useEditorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage = {
        id: `upload_${Date.now()}`,
        url: e.target?.result as string,
        prompt: 'Uploaded image',
        settings: {
          prompt: 'Uploaded image',
          style: 'photorealistic',
          aspectRatio: '1:1',
          quality: 80,
          creativity: 7.5,
          steps: 50
        },
        createdAt: Date.now(),
        dimensions: { width: 1024, height: 1024 } // Will be updated when image loads
      }
      
      addGeneratedImage(newImage)
      setCurrentImage(newImage)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Using the new professional header */}
      <div className="h-16 bg-background border-b border-border px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wand2 className="h-6 w-6 text-gradient" />
            <h1 className="text-xl font-semibold text-foreground">
              Nano Banana
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="h-10 px-6 font-medium bg-primary/10 text-primary">
            Editor
          </Button>
          <Button variant="ghost" className="h-10 px-6 font-medium">
            Gallery
          </Button>
          <Button variant="ghost" className="h-10 px-6 font-medium">
            Templates
          </Button>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="h-10 px-4">
            Save Project
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex">
        {/* Tool Palette - Left Sidebar */}
        <aside className="w-80 border-r border-border bg-muted/30 p-6 overflow-y-auto">
          <ToolPalette />
        </aside>

        {/* Main Canvas Area */}
        <section className="flex-1 p-8 bg-background">
          <div className="h-full flex items-center justify-center">
            {currentImage ? (
              // Show current image when available
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={currentImage.url}
                  alt={currentImage.prompt}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-border"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <Card className="bg-background/90 backdrop-blur">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        "{currentImage.prompt}"
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {currentImage.dimensions.width} × {currentImage.dimensions.height}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(currentImage.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              // Show welcome interface when no image
              <div className="text-center max-w-2xl">
                <div className="mb-8">
                  <Wand2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-3xl font-semibold text-foreground mb-2">
                    Welcome to Nano Banana
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Professional AI-powered image generation and editing
                  </p>
                </div>
                
                <Card className="p-6 bg-muted/30 border-dashed">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Get Started</h3>
                        <p className="text-muted-foreground mb-6">
                          Upload an image to edit or create something new with AI
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          className="h-12 font-semibold"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <Button variant="outline" className="h-12 font-semibold">
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate New
                        </Button>
                      </div>
                      
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Properties Panel - Right Sidebar */}
        <aside className="w-80 border-l border-border bg-muted/30 p-6 overflow-y-auto">
          {/* Show generation form in properties panel */}
          <GenerationForm />
        </aside>
      </main>

      {/* Status Bar */}
      <footer className="h-12 bg-muted/50 border-t border-border px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Ready</span>
          <span>•</span>
          <span>Canvas: {currentImage ? `${currentImage.dimensions.width}×${currentImage.dimensions.height}` : '1024×1024'}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Zoom: 100%</span>
          <span>•</span>
          <span>Tool: Select</span>
        </div>
      </footer>
    </div>
  )
}