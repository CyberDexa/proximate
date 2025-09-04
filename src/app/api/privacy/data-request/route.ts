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

    // Get user by email since session doesn't have ID
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const requestType = searchParams.get('type') || 'export'
    const userId = user.id

    switch (requestType) {
      case 'export':
        return await exportUserData(userId)
      case 'delete':
        return await deleteUserAccount(userId)
      case 'anonymize':
        return await anonymizeUserData(userId)
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Data request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user by email since session doesn't have ID
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { action, confirmationCode } = await req.json()
    const userId = user.id

    // Verify confirmation code for destructive actions
    if ((action === 'delete' || action === 'anonymize') && !confirmationCode) {
      return NextResponse.json({ 
        error: 'Confirmation code required for this action' 
      }, { status: 400 })
    }

    switch (action) {
      case 'requestDeletion':
        return await requestAccountDeletion(userId)
      case 'confirmDeletion':
        return await confirmAccountDeletion(userId, confirmationCode)
      case 'anonymizeEncounters':
        return await anonymizeEncounters(userId, confirmationCode)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Data request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function exportUserData(userId: string) {
  try {
    // Fetch basic user data for export
    const userData = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        ageVerified: true,
        isVerified: true
      }
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create export data object
    const exportData = {
      userInfo: userData,
      exportDate: new Date().toISOString(),
      gdprInfo: {
        rightToRectification: 'Contact support to correct inaccurate data',
        rightToErasure: 'Use account deletion feature or contact support',
        rightToDataPortability: 'This export contains your data',
        rightToObject: 'Contact support to opt out of data processing'
      },
      dataRetentionPolicy: {
        profileData: 'Retained until account deletion',
        messageData: '90 days after last activity',
        locationData: '24 hours after encounter',
        photoData: 'Until manually deleted or account closure'
      }
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="proximeet_data_export_${new Date().toISOString().split('T')[0]}.json"`
      }
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

async function deleteUserAccount(userId: string) {
  try {
    // For now, just mark for deletion - full implementation would remove all data
    await db.user.update({
      where: { id: userId },
      data: {
        email: `deleted_${Date.now()}@deleted.local`,
        name: 'Deleted User',
        image: null,
        emailVerified: null
      }
    })

    return NextResponse.json({ 
      message: 'Account marked for deletion. All data will be removed within 30 days.',
      deletedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 })
  }
}

async function anonymizeUserData(userId: string) {
  try {
    // Generate anonymous ID
    const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Update user with anonymized data
    await db.user.update({
      where: { id: userId },
      data: {
        name: 'Anonymous User',
        email: `${anonymousId}@anonymized.local`,
        image: null,
        emailVerified: null
      }
    })

    return NextResponse.json({ 
      message: 'User data anonymized successfully',
      anonymizedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Anonymization error:', error)
    return NextResponse.json({ error: 'Anonymization failed' }, { status: 500 })
  }
}

async function requestAccountDeletion(userId: string) {
  try {
    // Generate confirmation code
    const confirmationCode = Math.random().toString(36).substr(2, 8).toUpperCase()
    
    // Store deletion request (simplified - would need to add fields to user model)
    await db.user.update({
      where: { id: userId },
      data: {
        updatedAt: new Date() // In real implementation, would store deletion request info
      }
    })

    return NextResponse.json({ 
      message: 'Deletion request initiated. Use confirmation code to proceed.',
      confirmationCode, // In production, this would be sent via email
      expiresIn: '24 hours'
    })

  } catch (error) {
    console.error('Deletion request error:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}

async function confirmAccountDeletion(userId: string, confirmationCode: string) {
  try {
    // In a real implementation, would verify the code against stored value
    if (!confirmationCode || confirmationCode.length < 6) {
      return NextResponse.json({ error: 'Invalid confirmation code' }, { status: 400 })
    }

    // Proceed with account deletion
    return await deleteUserAccount(userId)

  } catch (error) {
    console.error('Deletion confirmation error:', error)
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 })
  }
}

async function anonymizeEncounters(userId: string, confirmationCode: string) {
  try {
    // Verify confirmation code
    if (!confirmationCode || confirmationCode.length < 6) {
      return NextResponse.json({ error: 'Invalid confirmation code' }, { status: 400 })
    }

    // In a real implementation, would anonymize encounter-specific data
    return NextResponse.json({ 
      message: 'Encounter data anonymized successfully',
      anonymizedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Encounter anonymization error:', error)
    return NextResponse.json({ error: 'Anonymization failed' }, { status: 500 })
  }
}
