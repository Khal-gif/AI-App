import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    
    // Get prompt from form data
    const prompt = formData.get('prompt') as string
    
    // Get image file from form data
    const imageFile = formData.get('image') as File
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    // Get image bytes
    const imageBytes = await imageFile.arrayBuffer()
    const imageSizeBytes = imageBytes.byteLength

    // Convert to readable size format
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Log to server console as requested
    console.log('🎯 USER PROMPT:', prompt)
    console.log('📷 IMAGE SIZE:', `${imageSizeBytes} bytes (${formatFileSize(imageSizeBytes)})`)
    console.log('📊 IMAGE DETAILS:', {
      name: imageFile.name,
      type: imageFile.type,
      lastModified: imageFile.lastModified ? new Date(imageFile.lastModified).toISOString() : 'unknown'
    })
    console.log('---')

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Request processed successfully',
      imageSize: imageSizeBytes,
      imageSizeFormatted: formatFileSize(imageSizeBytes),
      promptLength: prompt.length,
      imageType: imageFile.type,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Processing error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Processing failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: 'process',
    timestamp: new Date().toISOString(),
    capabilities: [
      'image_upload',
      'prompt_processing',
      'form_data_handling'
    ]
  })
}