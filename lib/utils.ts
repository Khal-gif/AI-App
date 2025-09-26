import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a spacing value follows 8pt grid system
 * @param value - CSS value to validate (e.g., "16px", "1rem")
 * @returns boolean - true if follows 8pt grid
 */
export function isValidGridSpacing(value: string): boolean {
  const pxMatch = value.match(/^(\d+)px$/)
  if (pxMatch) {
    const pixels = parseInt(pxMatch[1])
    return pixels % 4 === 0 // Must be divisible by 4 (8pt grid)
  }
  return false
}

/**
 * Validates if a font weight is allowed in design system
 * @param weight - Font weight to validate
 * @returns boolean - true if allowed
 */
export function isValidFontWeight(weight: string | number): boolean {
  const allowedWeights = ['400', '500', '600', '700', 400, 500, 600, 700]
  return allowedWeights.includes(weight)
}

/**
 * Performance monitoring utilities
 */
export const performance = {
  startTimer: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`)
    }
  },
  
  endTimer: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`)
      window.performance.measure(name, `${name}-start`, `${name}-end`)
      
      const entries = window.performance.getEntriesByName(name)
      const duration = entries[entries.length - 1]?.duration
      
      if (duration && duration > 5000) {
        console.warn(`⚠️ Performance: ${name} took ${duration.toFixed(2)}ms (>5s SLA)`)
      }
      
      return duration
    }
    return 0
  }
}