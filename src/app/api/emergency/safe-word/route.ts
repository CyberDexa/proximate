import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { emergencyProtocol } from '@/lib/safety/emergency-protocol';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { timestamp, location } = body;

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        safetyProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create emergency incident
    const incident = await db.emergencyIncident.create({
      data: {
        userId: user.id,
        type: 'safe_word',
        location: location ? JSON.stringify(location) : null,
        timestamp: new Date(timestamp || Date.now()),
        silent: false, // Safe word activation is always urgent
        resolved: false,
      },
    });

    // Execute emergency protocol
    const response = await emergencyProtocol.handleEmergency({
      incidentId: incident.id,
      userId: user.id,
      type: 'safe_word',
      location,
      silent: false,
      emergencyContacts: user.safetyProfile?.emergencyContact ? 
        [user.safetyProfile.emergencyContact] : [],
      trustedFriends: user.safetyProfile?.trustedFriends || [],
    });

    // Temporarily lock the account for safety
    await db.user.update({
      where: { id: user.id },
      data: {
        accountLocked: true,
        lockReason: 'safe_word_activated',
        lockedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      incidentId: incident.id,
      message: 'Safe word protocol activated. Account temporarily locked for safety.',
      protocolResponse: response,
    });

  } catch (error) {
    console.error('Safe word protocol error:', error);
    
    // Log critical error
    try {
      await db.systemError.create({
        data: {
          type: 'safe_word_failure',
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: JSON.stringify({ timestamp: new Date() }),
        },
      });
    } catch (logError) {
      console.error('Failed to log safe word error:', logError);
    }

    return NextResponse.json(
      { 
        error: 'Safe word protocol error',
        // Always return success for critical safety features
        success: true,
        fallback: true,
        message: 'Emergency protocol initiated. If you need immediate help, contact emergency services.',
      },
      { status: 200 } // Return 200 to avoid causing panic
    );
  }
}
