'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useEditorStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
  Wand2, 
  Image, 
  Settings, 
  Sparkles, 
  Loader2,
  Download,
  RefreshCw
} from 'lucide-react'

interface GenerationFormProps {
  className?: string
}

const stylePresets = [
  { value: 'photorealistic', label: 'Photorealistic', description: 'Realistic photography style' },
  { value: 'digital-art', label: 'Digital Art', description: 'Modern digital artwork' },
  { value: 'oil-painting', label: 'Oil Painting', description: 'Classic oil painting style' },
  { value: 'watercolor', label: 'Watercolor', description: 'Soft watercolor technique' },
  { value: 'anime', label: 'Anime', description: 'Japanese anime style' },
  { value: 'sketch', label: 'Sketch', description: 'Pencil sketch style' }
]

const aspectRatios = [
  { value: '1:1', label: 'Square (1:1)', size: '1024×1024' },
  { value: '4:3', label: 'Standard (4:3)', size: '1152×896' },
  { value: '16:9', label: 'Widescreen (16:9)', size: '1344×768' },
  { value: '3:4', label: 'Portrait (3:4)', size: '896×1152' },
  { value: '9:16', label: 'Mobile (9:16)', size: '768×1344' }
]

export function GenerationForm({ className }: GenerationFormProps) {
  const {
    generationSettings,
    updateGenerationSettings,
    isGenerating,
    generationProgress,
    generationMessage,
    setGenerating,
    addGeneratedImage,
    setCurrentImage
  } = useEditorStore()

  const [selectedStyle, setSelectedStyle] = useState(generationSettings.style)
  const [selectedAspect, setSelectedAspect] = useState(generationSettings.aspectRatio)

  const handleGenerate = async () => {
    if (!generationSettings.prompt.trim()) {
      alert('Please enter a prompt to generate an image.')
      return
    }

    const startTime = Date.now()
    setGenerating(true, 0, 'Initializing generation...')
    
    try {
      // Show progress updates
      setGenerating(true, 10, 'Sending request to AI...')
      
      // Call the actual API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: generationSettings.prompt,
          negativePrompt: generationSettings.negativePrompt,
          style: generationSettings.style,
          aspectRatio: generationSettings.aspectRatio,
          quality: generationSettings.quality,
          creativity: generationSettings.creativity,
          steps: generationSettings.steps,
          samples: 1 // Generate single image for now
        })
      })

      setGenerating(true, 50, 'Processing AI response...')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Generation failed')
      }

      setGenerating(true, 80, 'Finalizing image...')

      // Create image data from API response
      const newImage = {
        id: data.metadata?.id || `img_${Date.now()}`,
        url: data.imageUrl,
        prompt: generationSettings.prompt,
        settings: { ...generationSettings },
        createdAt: Date.now(),
        dimensions: data.metadata?.dimensions || { width: 1024, height: 1024 }
      }

      setGenerating(true, 100, 'Complete!')
      
      // Add to store and set as current
      addGeneratedImage(newImage)
      setCurrentImage(newImage)
      
      const totalTime = Date.now() - startTime
      console.log(`✅ Image generated successfully in ${totalTime}ms`)
      
      setTimeout(() => {
        setGenerating(false, 0, '')
      }, 500)

    } catch (error) {
      console.error('❌ Generation error:', error)
      setGenerating(false, 0, '')
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'
      alert(`Generation failed: ${errorMessage}. Please try again.`)
    }
  }

  const handleRandomPrompt = () => {
    const randomPrompts = [
      'A majestic dragon flying over a mystical forest at sunset',
      'Cyberpunk cityscape with neon lights and flying cars',
      'Serene Japanese garden with cherry blossoms and koi pond',
      'Steampunk mechanical owl with intricate gears and brass details',
      'Abstract cosmic nebula with swirling galaxies and stars'
    ]
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)]
    updateGenerationSettings({ prompt: randomPrompt })
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Generation Card */}
      <Card className="p-6 space-y-6">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-2xl font-semibold flex items-center space-x-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span>AI Image Generation</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Create stunning images from text descriptions using advanced AI
          </p>
        </CardHeader>

        <CardContent className="p-0 space-y-6">
          {/* Prompt Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt" className="text-sm font-medium">
                Prompt
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRandomPrompt}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Random
              </Button>
            </div>
            <Textarea
              id="prompt"
              value={generationSettings.prompt}
              onChange={(e) => updateGenerationSettings({ prompt: e.target.value })}
              placeholder="Describe the image you want to create in detail..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Negative Prompt */}
          <div className="space-y-3">
            <Label htmlFor="negative-prompt" className="text-sm font-medium">
              Negative Prompt (Optional)
            </Label>
            <Input
              id="negative-prompt"
              value={generationSettings.negativePrompt || ''}
              onChange={(e) => updateGenerationSettings({ negativePrompt: e.target.value })}
              placeholder="What to avoid in the image..."
              className="h-10"
            />
          </div>

          {/* Style Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Style Preset</Label>
            <div className="grid grid-cols-2 gap-3">
              {stylePresets.slice(0, 6).map((style) => (
                <Button
                  key={style.value}
                  variant={selectedStyle === style.value ? "default" : "outline"}
                  className="h-auto p-3 justify-start"
                  onClick={() => {
                    setSelectedStyle(style.value)
                    updateGenerationSettings({ style: style.value })
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{style.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {style.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Aspect Ratio</Label>
            <Select 
              value={selectedAspect} 
              onValueChange={(value) => {
                setSelectedAspect(value)
                updateGenerationSettings({ aspectRatio: value })
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{ratio.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {ratio.size}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Advanced Settings</span>
            </Label>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Quality</Label>
                <span className="text-sm text-muted-foreground">
                  {generationSettings.quality}
                </span>
              </div>
              <Slider
                value={[generationSettings.quality]}
                onValueChange={([value]) => updateGenerationSettings({ quality: value })}
                max={100}
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            {/* Creativity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Creativity</Label>
                <span className="text-sm text-muted-foreground">
                  {generationSettings.creativity}
                </span>
              </div>
              <Slider
                value={[generationSettings.creativity]}
                onValueChange={([value]) => updateGenerationSettings({ creativity: value })}
                max={15}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">{generationMessage}</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !generationSettings.prompt.trim()}
            className="w-full h-12 bg-primary text-primary-foreground font-semibold"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10 justify-start">
              <Image className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button variant="outline" className="h-10 justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Features Preview */}
      <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Features</span>
            <Badge variant="secondary" className="text-xs">COMING SOON</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Character consistency across multiple images</p>
            <p>• Multi-image blending and composition</p>
            <p>• Advanced inpainting and outpainting</p>
            <p>• Real-time style transfer</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}