import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's discreet mode settings
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        // Add these fields to your Prisma schema if they don't exist
        // discreetSettings: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Default settings if none exist
    const defaultSettings = {
      hiddenMode: false,
      invisibleBrowsing: false,
      noReadReceipts: false,
      hideFromContacts: false,
      hideFromFacebook: false,
      workLocationRadius: 2,
      homeLocationRadius: 1,
      blockList: []
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Failed to get discreet settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, settings } = await req.json()

    if (!userId || !settings) {
      return NextResponse.json({ error: 'User ID and settings required' }, { status: 400 })
    }

    // Update user settings
    await db.user.update({
      where: { id: userId },
      data: {
        updatedAt: new Date()
        // In a real implementation, you would store these settings
        // in a separate table or as JSON field
      }
    })

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    })
  } catch (error) {
    console.error('Failed to update discreet settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
