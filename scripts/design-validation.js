#!/usr/bin/env node

/**
 * Design System Validation Script
 * Automated checking for 8pt grid compliance, font weights, and component usage
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

class DesignSystemValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.stats = {
      filesChecked: 0,
      errorsFound: 0,
      warningsFound: 0
    }
  }

  validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8')
    this.stats.filesChecked++
    
    // Check for 8pt grid violations
    this.checkSpacing(content, filePath)
    
    // Check font weight usage
    this.checkFontWeights(content, filePath)
    
    // Check for direct Radix imports
    this.checkRadixImports(content, filePath)
    
    // Check for hardcoded colors
    this.checkColors(content, filePath)
  }

  checkSpacing(content, filePath) {
    // Match CSS-in-JS and Tailwind classes with pixel values
    const spacingPatterns = [
      /(\d+)px/g,
      /p-(\d+)/g,
      /m-(\d+)/g,
      /gap-(\d+)/g,
      /space-[xy]-(\d+)/g
    ]

    spacingPatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const value = parseInt(match[1])
        
        // Convert Tailwind spacing to pixels (1 = 4px in Tailwind)
        const pixels = pattern.source.includes('px') ? value : value * 4
        
        if (pixels % 4 !== 0) {
          this.errors.push({
            file: filePath,
            line: this.getLineNumber(content, match.index),
            message: `Invalid spacing: ${match[0]} (${pixels}px) - must be divisible by 4px for 8pt grid`,
            type: 'spacing'
          })
        }
      }
    })
  }

  checkFontWeights(content, filePath) {
    const allowedWeights = ['400', '500', '600', '700']
    const weightPattern = /font-?[wW]eight[:\s]*['"]?(\d+)['"]?/g
    
    let match
    while ((match = weightPattern.exec(content)) !== null) {
      if (!allowedWeights.includes(match[1])) {
        this.errors.push({
          file: filePath,
          line: this.getLineNumber(content, match.index),
          message: `Invalid font weight: ${match[1]} - only ${allowedWeights.join(', ')} allowed`,
          type: 'font-weight'
        })
      }
    }
  }

  checkRadixImports(content, filePath) {
    const radixImportPattern = /import.*from\s+['"]@radix-ui\//g
    
    let match
    while ((match = radixImportPattern.exec(content)) !== null) {
      this.errors.push({
        file: filePath,
        line: this.getLineNumber(content, match.index),
        message: 'Direct @radix-ui imports not allowed - use shadcn/ui components instead',
        type: 'component-usage'
      })
    }
  }

  checkColors(content, filePath) {
    const hardcodedColorPattern = /#[0-9a-fA-F]{3,6}|rgb\(|rgba\(/g
    
    let match
    while ((match = hardcodedColorPattern.exec(content)) !== null) {
      this.warnings.push({
        file: filePath,
        line: this.getLineNumber(content, match.index),
        message: `Hardcoded color detected: ${match[0]} - consider using semantic tokens`,
        type: 'color'
      })
    }
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length
  }

  async validateProject() {
    console.log('🔍 Starting Design System Validation...\n')
    
    // Find all relevant files
    const patterns = [
      'app/**/*.{ts,tsx}',
      'components/**/*.{ts,tsx}',
      'lib/**/*.{ts,tsx}',
      'styles/**/*.css'
    ]

    const files = []
    patterns.forEach(pattern => {
      const matches = glob.sync(pattern, { 
        ignore: ['node_modules/**', '.next/**', 'dist/**'] 
      })
      files.push(...matches)
    })

    // Validate each file
    files.forEach(file => {
      this.validateFile(file)
    })

    this.stats.errorsFound = this.errors.length
    this.stats.warningsFound = this.warnings.length

    this.printResults()
    return this.stats.errorsFound === 0
  }

  printResults() {
    console.log(`📊 Validation Results:`)
    console.log(`   Files checked: ${this.stats.filesChecked}`)
    console.log(`   Errors: ${this.stats.errorsFound}`)
    console.log(`   Warnings: ${this.stats.warningsFound}\n`)

    if (this.errors.length > 0) {
      console.log('❌ ERRORS:')
      this.errors.forEach(error => {
        console.log(`   ${error.file}:${error.line} - ${error.message}`)
      })
      console.log()
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:')
      this.warnings.forEach(warning => {
        console.log(`   ${warning.file}:${warning.line} - ${warning.message}`)
      })
      console.log()
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All design system rules are being followed!')
    }

    // Summary by type
    const errorsByType = this.groupByType(this.errors)
    const warningsByType = this.groupByType(this.warnings)

    if (Object.keys(errorsByType).length > 0) {
      console.log('📈 Error breakdown:')
      Object.entries(errorsByType).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`)
      })
      console.log()
    }
  }

  groupByType(issues) {
    return issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1
      return acc
    }, {})
  }
}

// CLI execution
async function main() {
  const validator = new DesignSystemValidator()
  const success = await validator.validateProject()
  
  if (!success) {
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = DesignSystemValidator