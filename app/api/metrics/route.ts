import { NextRequest, NextResponse } from 'next/server'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

// In production, you'd send these to a proper monitoring service
export async function POST(request: NextRequest) {
  try {
    const metric: PerformanceMetric = await request.json()
    
    // Log metrics (in production, send to DataDog, New Relic, etc.)
    console.log('📊 Performance Metric:', {
      name: metric.name,
      value: metric.value,
      timestamp: new Date(metric.timestamp).toISOString(),
      metadata: metric.metadata
    })

    // Example: Send to monitoring service
    if (process.env.MONITORING_ENDPOINT) {
      await fetch(process.env.MONITORING_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`
        },
        body: JSON.stringify(metric)
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to process metric:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process metric' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Health check for monitoring endpoint
  return NextResponse.json({
    status: 'healthy',
    service: 'metrics-collector',
    timestamp: new Date().toISOString()
  })
}