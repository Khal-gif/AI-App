'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Download, 
  Upload, 
  Save, 
  Share2, 
  Settings2,
  Palette,
  Sliders
} from 'lucide-react'

interface PropertiesPanelProps {
  className?: string
}

export function PropertiesPanel({ className }: PropertiesPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Generation Settings */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold flex items-center space-x-2">
            <Settings2 className="h-4 w-4" />
            <span>Generation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Prompt
            </Label>
            <textarea
              id="prompt"
              className="w-full min-h-[80px] p-3 text-sm bg-background border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Describe what you want to create or edit..."
            />
          </div>

          {/* Style Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Style</Label>
              <Button variant="outline" className="w-full justify-start h-10">
                Photorealistic
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Aspect</Label>
              <Button variant="outline" className="w-full justify-start h-10">
                1:1
              </Button>
            </div>
          </div>

          {/* Quality Settings */}
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Quality</Label>
                <span className="text-sm text-muted-foreground">High</span>
              </div>
              <Slider
                defaultValue={[80]}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Creativity</Label>
                <span className="text-sm text-muted-foreground">7.5</span>
              </div>
              <Slider
                defaultValue={[75]}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          <Button className="w-full h-12 bg-primary text-primary-foreground font-semibold">
            Generate Image
          </Button>
        </CardContent>
      </Card>

      {/* Image Properties */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold flex items-center space-x-2">
            <Sliders className="h-4 w-4" />
            <span>Image Properties</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <Label className="text-muted-foreground">Dimensions</Label>
              <p className="font-medium">1024 × 1024</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Format</Label>
              <p className="font-medium">PNG</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <p className="font-medium">2.4 MB</p>
            </div>
            <div>
              <Label className="text-muted-foreground">DPI</Label>
              <p className="font-medium">300</p>
            </div>
          </div>

          <Separator />

          {/* Color Adjustments */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <Palette className="h-3 w-3" />
              <span>Adjustments</span>
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Brightness</Label>
                <span className="text-xs text-muted-foreground">0</span>
              </div>
              <Slider
                defaultValue={[0]}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Contrast</Label>
                <span className="text-xs text-muted-foreground">0</span>
              </div>
              <Slider
                defaultValue={[0]}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Saturation</Label>
                <span className="text-xs text-muted-foreground">0</span>
              </div>
              <Slider
                defaultValue={[0]}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold">Export</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          <Button variant="outline" className="w-full h-10 justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
          <Button variant="outline" className="w-full h-10 justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download JPG
          </Button>
          <Button variant="outline" className="w-full h-10 justify-start">
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </Button>
          <Button variant="outline" className="w-full h-10 justify-start">
            <Save className="h-4 w-4 mr-2" />
            Save to Gallery
          </Button>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold flex items-center space-x-2">
            <span>AI Features</span>
            <Badge variant="secondary" className="text-xs">NEW</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          <Button variant="outline" className="w-full h-10 justify-start">
            Character Consistency
          </Button>
          <Button variant="outline" className="w-full h-10 justify-start">
            Multi-Image Blend
          </Button>
          <Button variant="outline" className="w-full h-10 justify-start">
            Style Transfer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}