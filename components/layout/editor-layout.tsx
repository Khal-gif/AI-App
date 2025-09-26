'use client'

import { Header } from '@/components/header'
import { cn } from '@/lib/utils'

interface EditorLayoutProps {
  children: React.ReactNode
  className?: string
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      {/* Header - 64px height */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 flex">
        {/* Layout Structure according to plan:
            ├── Main Canvas (70% viewport, p-8 = 32px padding)
            ├── Tool Palette (w-80 = 320px, p-6 = 24px padding)  
            ├── Properties Panel (w-80 = 320px, p-6 = 24px padding)
        */}
        
        {/* Tool Palette - Left Sidebar */}
        <aside className="w-80 border-r border-border bg-muted/50 p-6">
          <div className="h-full">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Tools</h3>
            <div className="space-y-4">
              {/* Tool palette content will be added here */}
              <div className="p-4 bg-background border border-border rounded-lg text-sm text-muted-foreground">
                Tool palette components will be added here
              </div>
            </div>
          </div>
        </aside>

        {/* Main Canvas Area - 70% of remaining space */}
        <section className="flex-1 p-8 bg-background">
          <div className="h-full flex items-center justify-center">
            {children}
          </div>
        </section>

        {/* Properties Panel - Right Sidebar */}
        <aside className="w-80 border-l border-border bg-muted/50 p-6">
          <div className="h-full">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Properties</h3>
            <div className="space-y-4">
              {/* Properties panel content will be added here */}
              <div className="p-4 bg-background border border-border rounded-lg text-sm text-muted-foreground">
                Properties panel will be added here
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Status Bar - 48px height */}
      <footer className="h-12 bg-muted border-t border-border px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Ready</span>
          <span>•</span>
          <span>Canvas: 1024x1024</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Zoom: 100%</span>
        </div>
      </footer>
    </div>
  )
}