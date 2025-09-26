/**
 * Performance Monitoring and Analytics
 * Tracks generation times, user interactions, and system health
 */

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

interface UserEvent {
  event: string
  properties: Record<string, any>
  timestamp: number
  sessionId: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private sessionId: string
  private startTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    
    if (typeof window !== 'undefined') {
      this.setupPerformanceObserver()
    }
  }

  // Track AI generation performance
  trackGeneration(prompt: string, samples: number, duration: number, success: boolean) {
    const metric: PerformanceMetric = {
      name: 'ai_generation',
      value: duration,
      timestamp: Date.now(),
      metadata: {
        prompt_length: prompt.length,
        samples,
        success,
        exceeded_sla: duration > 5000
      }
    }

    this.metrics.push(metric)
    
    // Log performance warnings
    if (duration > 5000) {
      console.warn(`🚨 Generation SLA exceeded: ${duration}ms (target: <5s)`)
      this.trackEvent('sla_violation', {
        type: 'generation_timeout',
        duration,
        prompt_length: prompt.length
      })
    }

    // Send to analytics
    this.sendMetric(metric)
  }

  // Track user interactions
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    const event: UserEvent = {
      event: eventName,
      properties: {
        ...properties,
        session_id: this.sessionId,
        url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      },
      timestamp: Date.now(),
      sessionId: this.sessionId
    }

    // Send to analytics services
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties)
    }

    console.log('📊 Event tracked:', event)
  }

  // Monitor Core Web Vitals
  private setupPerformanceObserver() {
    if (!window.PerformanceObserver) return

    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      this.trackMetric('lcp', lastEntry.startTime, {
        element: lastEntry.element?.tagName
      })
    }).observe({ type: 'largest-contentful-paint', buffered: true })

    // Track First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.trackMetric('fid', entry.processingStart - entry.startTime, {
          event_type: entry.name
        })
      })
    }).observe({ type: 'first-input', buffered: true })

    // Track Cumulative Layout Shift (CLS)
    new PerformanceObserver((list) => {
      let clsValue = 0
      const entries = list.getEntries()
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      this.trackMetric('cls', clsValue)
    }).observe({ type: 'layout-shift', buffered: true })
  }

  // Track custom metrics
  private trackMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    }

    this.metrics.push(metric)
    
    // Warn for poor Core Web Vitals
    const thresholds = {
      lcp: 2500, // ms
      fid: 100,  // ms  
      cls: 0.1   // score
    }

    if (thresholds[name as keyof typeof thresholds] && value > thresholds[name as keyof typeof thresholds]) {
      console.warn(`🚨 Poor ${name.toUpperCase()}: ${value} (threshold: ${thresholds[name as keyof typeof thresholds]})`)
    }

    this.sendMetric(metric)
  }

  // Send metrics to monitoring service
  private sendMetric(metric: PerformanceMetric) {
    // In production, send to your monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: DataDog, New Relic, custom endpoint
      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      }).catch(console.error)
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    const generationMetrics = this.metrics.filter(m => m.name === 'ai_generation')
    const webVitals = this.metrics.filter(m => ['lcp', 'fid', 'cls'].includes(m.name))

    return {
      session_id: this.sessionId,
      session_duration: Date.now() - this.startTime,
      total_generations: generationMetrics.length,
      average_generation_time: generationMetrics.length > 0 
        ? generationMetrics.reduce((acc, m) => acc + m.value, 0) / generationMetrics.length 
        : 0,
      sla_violations: generationMetrics.filter(m => m.value > 5000).length,
      web_vitals: webVitals.reduce((acc, m) => {
        acc[m.name] = m.value
        return acc
      }, {} as Record<string, number>)
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// Error tracking
class ErrorTracker {
  static trackError(error: Error, context?: Record<string, any>) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      context
    }

    console.error('🚨 Error tracked:', errorInfo)

    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorInfo)
      }).catch(console.error)
    }
  }
}

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    ErrorTracker.trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    ErrorTracker.trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`))
  })
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()
export { ErrorTracker }

// Hook for component-level monitoring  
export function usePerformanceTracking() {
  const trackGeneration = (prompt: string, samples: number, duration: number, success: boolean) => {
    performanceMonitor.trackGeneration(prompt, samples, duration, success)
  }

  const trackEvent = (event: string, properties?: Record<string, any>) => {
    performanceMonitor.trackEvent(event, properties)
  }

  const trackError = (error: Error, context?: Record<string, any>) => {
    ErrorTracker.trackError(error, context)
  }

  return {
    trackGeneration,
    trackEvent,
    trackError
  }
}