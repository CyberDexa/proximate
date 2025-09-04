import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { emergencyProtocol } from '@/lib/safety/emergency-protocol';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, silent, location, timestamp } = body;

    // Log the emergency incident
    const incident = await db.emergencyIncident.create({
      data: {
        userId: session.user.id,
        type: type || 'panic_button',
        location: location ? JSON.stringify(location) : null,
        timestamp: new Date(timestamp || Date.now()),
        silent: silent || false,
        resolved: false,
      },
    });

    // Get user's emergency contacts and safety profile
    const user = await db.user.findUnique({
      where: { id: session.user.id },
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

    // Execute emergency protocol
    const response = await emergencyProtocol.handleEmergency({
      incidentId: incident.id,
      userId: session.user.id,
      type: type || 'panic_button',
      location,
      silent: silent || false,
      emergencyContacts: user.safetyProfile?.emergencyContact ? 
        [user.safetyProfile.emergencyContact] : [],
      trustedFriends: user.safetyProfile?.trustedFriends || [],
    });

    // For non-silent alerts, also send immediate SMS
    if (!silent && user.safetyProfile?.emergencyContact) {
      await emergencyProtocol.sendEmergencySMS({
        to: user.safetyProfile.emergencyContact,
        userName: user.name || 'User',
        location,
        incidentId: incident.id,
      });
    }

    return NextResponse.json({
      success: true,
      incidentId: incident.id,
      protocolResponse: response,
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    
    // Even if the system fails, we should try to log this critical error
    try {
      await db.systemError.create({
        data: {
          type: 'emergency_alert_failure',
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: JSON.stringify({ timestamp: new Date() }),
        },
      });
    } catch (logError) {
      console.error('Failed to log emergency error:', logError);
    }

    return NextResponse.json(
      { 
        error: 'Emergency system error',
        // Always return success for panic button to avoid user panic
        success: true,
        fallback: true
      },
      { status: 200 } // Return 200 even on error for panic button
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get recent emergency incidents for this user
    const incidents = await db.emergencyIncident.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      incidents: incidents.map(incident => ({
        id: incident.id,
        type: incident.type,
        timestamp: incident.timestamp,
        resolved: incident.resolved,
        // Don't expose sensitive location data
        hasLocation: !!incident.location,
      })),
    });

  } catch (error) {
    console.error('Get emergency incidents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}
