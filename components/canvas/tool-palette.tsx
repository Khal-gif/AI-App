'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Paintbrush, 
  Eraser, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Wand2, 
  Image,
  Type,
  Palette
} from 'lucide-react'

interface ToolPaletteProps {
  className?: string
}

const tools = [
  {
    id: 'select',
    name: 'Select',
    icon: Move,
    shortcut: 'V',
    active: true
  },
  {
    id: 'brush',
    name: 'Brush',
    icon: Paintbrush,
    shortcut: 'B',
    active: false
  },
  {
    id: 'eraser',
    name: 'Eraser',
    icon: Eraser,
    shortcut: 'E',
    active: false
  },
  {
    id: 'text',
    name: 'Text',
    icon: Type,
    shortcut: 'T',
    active: false
  },
  {
    id: 'ai-edit',
    name: 'AI Edit',
    icon: Wand2,
    shortcut: 'A',
    active: false,
    badge: 'AI'
  }
]

const quickActions = [
  {
    id: 'generate',
    name: 'Generate',
    icon: Image,
    description: 'Create new image from text'
  },
  {
    id: 'enhance',
    name: 'Enhance',
    icon: Wand2,
    description: 'AI-powered image enhancement'
  },
  {
    id: 'style',
    name: 'Style Transfer',
    icon: Palette,
    description: 'Apply artistic styles'
  }
]

export function ToolPalette({ className }: ToolPaletteProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Core Tools */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold">Tools</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Button
                key={tool.id}
                variant={tool.active ? "default" : "ghost"}
                className={cn(
                  "w-full h-12 justify-start px-4 font-medium",
                  tool.active && "bg-primary text-primary-foreground"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{tool.name}</span>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <kbd className="text-xs bg-muted px-2 py-1 rounded">
                    {tool.shortcut}
                  </kbd>
                </div>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-foreground">
                      {action.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* View Controls */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold">View</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-10 px-4">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-10">
              Fit to Screen
            </Button>
            <Button variant="outline" size="sm" className="h-10 px-4">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Layers */}
      <Card className="p-6 space-y-4">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-xl font-semibold flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Layers</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Background</span>
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="p-3 bg-muted/50 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Layer 1</span>
                <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}