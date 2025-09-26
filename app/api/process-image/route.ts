import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import mime from 'mime-types'

interface ImageProcessRequest {
  image: string // base64 or file data
  format?: 'jpeg' | 'png' | 'webp' | 'avif'
  quality?: number
  maxWidth?: number
  maxHeight?: number
  optimize?: boolean
}

interface ImageProcessResponse {
  success: boolean
  processedImage?: string // base64 processed image
  originalFormat?: string
  processedFormat?: string
  originalSize?: number
  processedSize?: number
  processingTime?: number
  error?: string
}

class UniversalImageProcessor {
  private supportedFormats = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif',
    'image/tiff', 'image/tif', 'image/bmp', 'image/gif', 'image/svg+xml',
    'image/heic', 'image/heif', 'image/raw', 'image/cr2', 'image/nef',
    'image/dng', 'image/x-canon-cr2', 'image/x-canon-crw', 'image/x-nikon-nef'
  ]

  async processImage(
    imageData: string,
    options: {
      format?: 'jpeg' | 'png' | 'webp' | 'avif'
      quality?: number
      maxWidth?: number
      maxHeight?: number
      optimize?: boolean
    } = {}
  ): Promise<ImageProcessResponse> {
    const startTime = Date.now()
    
    try {
      console.log('🖼️ UNIVERSAL IMAGE PROCESSING:')
      console.log('📏 Max dimensions:', options.maxWidth || 'unlimited', 'x', options.maxHeight || 'unlimited')
      console.log('🎯 Target format:', options.format || 'auto')
      console.log('⭐ Quality:', options.quality || 'default')
      
      // Extract base64 data
      let base64Data: string
      let originalFormat: string
      
      if (imageData.startsWith('data:')) {
        const [header, data] = imageData.split(',')
        base64Data = data
        originalFormat = header.split(';')[0].split(':')[1]
      } else {
        base64Data = imageData
        originalFormat = 'unknown'
      }
      
      console.log('📄 Original format:', originalFormat)
      
      // Convert base64 to buffer
      let inputBuffer = Buffer.from(base64Data, 'base64')
      const originalSize = inputBuffer.length
      
      console.log('📊 Original size:', this.formatBytes(originalSize))
      
      // Handle HEIC/HEIF formats
      if (originalFormat.includes('heic') || originalFormat.includes('heif')) {
        console.log('🔄 Converting HEIC/HEIF format...')
        inputBuffer = await this.convertHEIC(inputBuffer)
      }
      
      // Initialize Sharp processor
      let processor = sharp(inputBuffer)
      
      // Get image metadata
      const metadata = await processor.metadata()
      console.log('📐 Original dimensions:', `${metadata.width}x${metadata.height}`)
      console.log('🎨 Color space:', metadata.space)
      console.log('📋 Channels:', metadata.channels)
      
      // Handle different input formats and apply processing
      processor = await this.applyUniversalProcessing(processor, metadata, options)
      
      // Resize if needed
      if (options.maxWidth || options.maxHeight) {
        processor = processor.resize(options.maxWidth, options.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
      }
      
      // Determine output format
      const outputFormat = options.format || this.getBestOutputFormat(originalFormat)
      
      // Apply format-specific optimizations
      processor = this.applyFormatOptimizations(processor, outputFormat, options.quality)
      
      // Process the image
      const outputBuffer = await processor.toBuffer()
      const processedSize = outputBuffer.length
      
      // Convert back to base64
      const processedBase64 = outputBuffer.toString('base64')
      const processedImage = `data:image/${outputFormat};base64,${processedBase64}`
      
      const processingTime = Date.now() - startTime
      
      console.log('✅ Processing completed:')
      console.log('📊 Processed size:', this.formatBytes(processedSize))
      console.log('📉 Size reduction:', `${Math.round((1 - processedSize/originalSize) * 100)}%`)
      console.log('⏱️ Processing time:', `${processingTime}ms`)
      
      return {
        success: true,
        processedImage,
        originalFormat,
        processedFormat: outputFormat,
        originalSize,
        processedSize,
        processingTime
      }
      
    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('❌ Image processing error:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image processing failed',
        processingTime
      }
    }
  }
  
  private async applyUniversalProcessing(
    processor: sharp.Sharp, 
    metadata: sharp.Metadata,
    options: any
  ): Promise<sharp.Sharp> {
    
    // Auto-rotate based on EXIF data
    processor = processor.rotate()
    
    // Normalize color space
    if (metadata.space === 'cmyk') {
      processor = processor.toColorspace('srgb')
    }
    
    // Handle transparency for formats that don't support it
    if (metadata.hasAlpha && (options.format === 'jpeg')) {
      processor = processor.flatten({ background: { r: 255, g: 255, b: 255 } })
    }
    
    // Apply sharpening for better quality
    if (options.optimize) {
      processor = processor.sharpen()
    }
    
    return processor
  }
  
  private getBestOutputFormat(originalFormat: string): 'jpeg' | 'png' | 'webp' {
    // Smart format selection based on input
    if (originalFormat.includes('png') || originalFormat.includes('gif')) {
      return 'png' // Preserve transparency
    } else if (originalFormat.includes('webp')) {
      return 'webp' // Keep as webp
    } else {
      return 'jpeg' // Default for photos
    }
  }
  
  private applyFormatOptimizations(
    processor: sharp.Sharp, 
    format: string, 
    quality?: number
  ): sharp.Sharp {
    
    const defaultQualities = {
      jpeg: 85,
      png: 9, // Compression level for PNG
      webp: 85,
      avif: 80
    }
    
    switch (format) {
      case 'jpeg':
        return processor.jpeg({ 
          quality: quality || defaultQualities.jpeg,
          progressive: true,
          mozjpeg: true
        })
        
      case 'png':
        return processor.png({ 
          compressionLevel: quality ? Math.round(quality / 10) : defaultQualities.png,
          progressive: true,
          palette: true
        })
        
      case 'webp':
        return processor.webp({ 
          quality: quality || defaultQualities.webp,
          effort: 6
        })
        
      case 'avif':
        return processor.avif({ 
          quality: quality || defaultQualities.avif,
          effort: 9
        })
        
      default:
        return processor.jpeg({ quality: 85, progressive: true })
    }
  }
  
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  isFormatSupported(mimeType: string): boolean {
    return this.supportedFormats.includes(mimeType.toLowerCase())
  }
  
  getSupportedFormats(): string[] {
    return this.supportedFormats
  }

  private async convertHEIC(buffer: Buffer): Promise<Buffer> {
    try {
      // Try multiple HEIC conversion methods
      
      // Method 1: Try heic-convert (most reliable)
      try {
        const heicConvert = require('heic-convert')
        const outputBuffer = await heicConvert({
          buffer: buffer,
          format: 'JPEG',
          quality: 0.9
        })
        console.log('✅ HEIC converted using heic-convert')
        return outputBuffer
      } catch (heicError) {
        console.log('⚠️ heic-convert failed, trying alternative...')
      }

      // Method 2: Try heic-decode + canvas (fallback)
      try {
        const decode = require('heic-decode')
        const { data, width, height } = await decode({ buffer })
        
        // Convert to JPEG using sharp
        const jpegBuffer = await sharp(data, { 
          raw: { width, height, channels: 4 } 
        })
        .jpeg({ quality: 90 })
        .toBuffer()
        
        console.log('✅ HEIC converted using heic-decode + sharp')
        return jpegBuffer
      } catch (decodeError) {
        console.log('⚠️ heic-decode failed')
      }

      // Method 3: Browser-based fallback (limited)
      console.log('⚠️ Using basic HEIC handling...')
      return buffer // Return original and hope Sharp can handle it
      
    } catch (error) {
      console.error('❌ HEIC conversion failed:', error)
      throw new Error('HEIC conversion failed. Please convert to JPEG first or try a different image.')
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageProcessRequest = await request.json()
    const { image, format, quality, maxWidth, maxHeight, optimize } = body

    console.log('🖼️ IMAGE PROCESSING API REQUEST:')
    console.log('📸 Image provided:', !!image)
    console.log('🎯 Target format:', format || 'auto')
    console.log('⭐ Quality:', quality || 'default')

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      )
    }

    const processor = new UniversalImageProcessor()
    const result = await processor.processImage(image, {
      format,
      quality,
      maxWidth,
      maxHeight,
      optimize
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'X-Processing-Time': result.processingTime?.toString() || '0',
        'X-Feature': 'Universal-Image-Processing'
      }
    })

  } catch (error) {
    console.error('❌ Image processing API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Image processing failed'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  const processor = new UniversalImageProcessor()
  
  return NextResponse.json({
    status: 'healthy',
    service: 'universal-image-processing',
    supportedFormats: processor.getSupportedFormats(),
    capabilities: [
      'format-conversion',
      'auto-optimization',
      'resize-and-compress',
      'metadata-extraction',
      'color-space-conversion',
      'exif-rotation',
      'transparency-handling',
      'progressive-encoding'
    ],
    timestamp: new Date().toISOString()
  })
}