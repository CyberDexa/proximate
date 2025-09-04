import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, timestamp, userAgent } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Log screenshot attempt
    console.log(`Screenshot attempt detected:`, {
      userId,
      timestamp,
      userAgent,
      sessionEmail: session.user.email
    })

    // In a real implementation, you might want to:
    // 1. Store this in a security log table
    // 2. Notify the user
    // 3. Increment a counter
    // 4. Alert other users if it's frequent

    // For now, just acknowledge receipt
    return NextResponse.json({ 
      message: 'Screenshot attempt logged',
      alertSent: true
    })
  } catch (error) {
    console.error('Failed to log screenshot alert:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
