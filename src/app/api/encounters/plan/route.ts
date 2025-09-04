import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Extend session type
interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthSession {
  user: AuthUser;
}

interface PlanEncounterRequest {
  matchId: string;
  proposedTime: string;
  location?: {
    name: string;
    address: string;
    type: 'public' | 'private' | 'hotel';
    lat?: number;
    lng?: number;
  };
  preferences: {
    publicFirst: boolean;
    shareLocation: boolean;
    emergencyContact?: string;
  };
}

interface SafeMeetingSpot {
  id: string;
  name: string;
  type: 'bar' | 'cafe' | 'restaurant' | 'hotel_lobby' | 'public_space';
  address: string;
  rating: number;
  distance: number;
  features: string[];
  safetyScore: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as AuthSession | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: PlanEncounterRequest = await request.json();
    const { matchId, proposedTime, location, preferences } = body;

    if (!matchId || !proposedTime) {
      return NextResponse.json(
        { error: 'Match ID and proposed time are required' },
        { status: 400 }
      );
    }

    // Mock safe meeting spots (in real app, would query location API)
    const safeMeetingSpots: SafeMeetingSpot[] = [
      {
        id: 'spot_1',
        name: 'The Library Bar',
        type: 'bar',
        address: '123 Main St, Downtown',
        rating: 4.8,
        distance: 0.8,
        features: ['Well-lit', 'Busy area', 'Valet parking', 'Security cameras'],
        safetyScore: 9.2
      },
      {
        id: 'spot_2',
        name: 'Central Coffee House',
        type: 'cafe',
        address: '456 Center Ave',
        rating: 4.6,
        distance: 1.2,
        features: ['Public location', 'Good lighting', 'Multiple exits', 'WiFi'],
        safetyScore: 8.9
      },
      {
        id: 'spot_3',
        name: 'Hilton Downtown Lobby',
        type: 'hotel_lobby',
        address: '789 Business District',
        rating: 4.7,
        distance: 1.5,
        features: ['24/7 security', 'Public space', 'Valet service', 'Concierge'],
        safetyScore: 9.5
      },
      {
        id: 'spot_4',
        name: 'Riverside Park Pavilion',
        type: 'public_space',
        address: 'River Walk Trail',
        rating: 4.4,
        distance: 2.1,
        features: ['Daytime only', 'Well-maintained', 'Security patrols', 'Public restrooms'],
        safetyScore: 7.8
      }
    ];

    // Create encounter planning session
    const encounter = {
      id: `encounter_${Date.now()}`,
      matchId,
      initiatorId: session.user.id,
      status: 'planning',
      proposedTime,
      location,
      preferences,
      suggestedSpots: safeMeetingSpots,
      safetyFeatures: {
        checkInRequired: true,
        checkInTime: new Date(new Date(proposedTime).getTime() + 30 * 60 * 1000).toISOString(), // 30 min after
        emergencyContactsNotified: preferences.shareLocation,
        panicButtonEnabled: true,
        locationSharingExpiry: new Date(new Date(proposedTime).getTime() + 4 * 60 * 60 * 1000).toISOString() // 4 hours
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours to confirm
    };

    // In real implementation:
    // 1. Save encounter to database
    // 2. Notify the other party
    // 3. Set up safety check-in reminders
    // 4. Enable emergency features
    // 5. Create location sharing session

    return NextResponse.json({
      success: true,
      encounter,
      message: 'Encounter planning session created'
    });

  } catch (error) {
    console.error('Encounter planning error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get encounter details
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as AuthSession | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const encounterId = searchParams.get('id');

    if (!encounterId) {
      return NextResponse.json(
        { error: 'Encounter ID is required' },
        { status: 400 }
      );
    }

    // Mock encounter data
    const encounter = {
      id: encounterId,
      matchId: 'match_123',
      status: 'confirmed',
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      location: {
        name: 'The Library Bar',
        address: '123 Main St, Downtown',
        type: 'bar'
      },
      participants: [
        {
          id: session.user.id,
          name: 'You',
          status: 'confirmed',
          checkInTime: null
        },
        {
          id: 'user_other',
          name: 'Alex',
          status: 'confirmed',
          checkInTime: null
        }
      ],
      safetyFeatures: {
        checkInRequired: true,
        checkInTime: new Date(new Date().getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
        emergencyContactsNotified: true,
        panicButtonEnabled: true,
        locationSharingActive: false
      },
      consentChecklist: {
        completed: false,
        items: [
          { id: 'boundaries', text: 'Boundaries discussed', completed: false },
          { id: 'consent', text: 'Enthusiastic consent confirmed', completed: false },
          { id: 'safety', text: 'Safety protocols understood', completed: false }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      encounter
    });

  } catch (error) {
    console.error('Get encounter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update encounter (confirm, cancel, check-in)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as AuthSession | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { encounterId, action, data } = await request.json();

    if (!encounterId || !action) {
      return NextResponse.json(
        { error: 'Encounter ID and action are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'confirm':
        result = {
          message: 'Encounter confirmed',
          status: 'confirmed'
        };
        break;

      case 'cancel':
        result = {
          message: 'Encounter cancelled',
          status: 'cancelled',
          reason: data?.reason || 'No reason provided'
        };
        break;

      case 'check_in':
        result = {
          message: 'Check-in successful',
          checkInTime: new Date().toISOString(),
          nextCheckIn: new Date(Date.now() + 60 * 60 * 1000).toISOString() // Next hour
        };
        break;

      case 'emergency':
        // Trigger emergency protocol
        result = {
          message: 'Emergency protocol activated',
          emergencyId: `emergency_${Date.now()}`,
          actions: [
            'Emergency contacts notified',
            'Location shared with authorities',
            'Support team alerted'
          ]
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Update encounter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
