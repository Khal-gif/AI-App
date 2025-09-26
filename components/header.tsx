'use client'

import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Settings, User, Menu, Sparkles } from 'lucide-react'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      "h-16 bg-background border-b border-border px-8 flex items-center justify-between", // 64px height - 8pt grid
      className
    )}>
      {/* Logo and Brand */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-gradient" />
          <h1 className="text-xl font-semibold text-foreground">
            Nano Banana
          </h1>
        </div>
      </div>

      {/* Navigation - Center */}
      <nav className="hidden md:flex items-center space-x-6">
        <Button variant="ghost" className="h-10 px-6 font-medium">
          Editor
        </Button>
        <Button variant="ghost" className="h-10 px-6 font-medium">
          Gallery
        </Button>
        <Button variant="ghost" className="h-10 px-6 font-medium">
          Templates
        </Button>
      </nav>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="h-10 w-10">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-10 w-10">
          <User className="h-4 w-4" />
        </Button>
        
        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="h-10 w-10 md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}