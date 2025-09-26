'use client'

import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  isLoading: boolean
  message?: string
  progress?: number
  className?: string
}

export function LoadingState({ 
  isLoading, 
  message = "Processing...", 
  progress,
  className 
}: LoadingStateProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [dots, setDots] = useState('')

  // Animate progress bar
  useEffect(() => {
    if (!isLoading) {
      setDisplayProgress(0)
      return
    }

    if (typeof progress === 'number') {
      setDisplayProgress(progress)
    } else {
      // Simulate progress for indeterminate loading
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15
        if (currentProgress >= 90) {
          currentProgress = 90 // Stay at 90% until completion
        }
        setDisplayProgress(currentProgress)
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isLoading, progress])

  // Animate dots for loading message
  useEffect(() => {
    if (!isLoading) {
      setDots('')
      return
    }

    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4 p-8", // 32px padding, 16px spacing - 8pt grid
      className
    )}>
      {/* Loading spinner */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary" />
      </div>
      
      {/* Loading message */}
      <div className="text-center space-y-2">
        <p className="text-base font-medium text-foreground">
          {message}{dots}
        </p>
        
        {/* Progress bar */}
        <div className="w-64 max-w-full">
          <Progress 
            value={displayProgress} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(displayProgress)}% complete
          </p>
        </div>
      </div>

      {/* Performance warning for long operations */}
      {displayProgress > 80 && (
        <div className="text-xs text-orange-600 mt-2 text-center max-w-sm">
          This is taking longer than expected. We're working to complete your request.
        </div>
      )}
    </div>
  )
}

// Hook for managing loading states with performance monitoring
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)

  const startLoading = (initialMessage: string = 'Processing...') => {
    setIsLoading(true)
    setProgress(0)
    setMessage(initialMessage)
    setStartTime(Date.now())
  }

  const updateProgress = (newProgress: number, newMessage?: string) => {
    setProgress(Math.min(100, Math.max(0, newProgress)))
    if (newMessage) setMessage(newMessage)
  }

  const stopLoading = () => {
    const duration = startTime ? Date.now() - startTime : 0
    
    // Log performance metrics
    if (duration > 5000) {
      console.warn(`⚠️ Long operation: ${duration}ms (exceeded 5s SLA)`)
    }

    setIsLoading(false)
    setProgress(0)
    setMessage('')
    setStartTime(null)
    
    return duration
  }

  return {
    isLoading,
    progress,
    message,
    startLoading,
    updateProgress,
    stopLoading
  }
}