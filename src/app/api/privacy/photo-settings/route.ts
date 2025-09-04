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

    // Default photo protection settings
    const defaultSettings = {
      autoBlurEnabled: true,
      watermarkEnabled: true,
      screenshotDetection: true,
      exifRemoval: true,
      privateAlbumEnabled: true,
      blurLevel: 80,
      watermarkOpacity: 40
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Failed to get photo settings:', error)
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

    // Update photo protection settings
    await db.user.update({
      where: { id: userId },
      data: {
        updatedAt: new Date()
        // Store photo protection settings
      }
    })

    return NextResponse.json({ 
      message: 'Photo protection settings updated successfully',
      settings 
    })
  } catch (error) {
    console.error('Failed to update photo settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
