import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface MatchRequest {
  likedUserId: string;
  intention?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { likedUserId, intention }: MatchRequest = await request.json();

    if (!likedUserId) {
      return NextResponse.json(
        { error: 'Liked user ID is required' },
        { status: 400 }
      );
    }

    // Prevent self-likes
    if (likedUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot like yourself' },
        { status: 400 }
      );
    }

    // In real implementation, this would:
    // 1. Check if user already liked this person
    // 2. Check if this creates a mutual match
    // 3. Verify intention compatibility
    // 4. Create match record if mutual
    // 5. Start 24-hour chat timer
    // 6. Send push notifications
    // 7. Create consent checklist

    // Mock response for development
    const isMatch = Math.random() > 0.7; // 30% chance of mutual match

    if (isMatch) {
      // Create match record
      const match = {
        id: `match_${Date.now()}`,
        user1Id: session.user.id,
        user2Id: likedUserId,
        createdAt: new Date().toISOString(),
        chatExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        intentionsMatch: true,
        consentChecklistCompleted: false,
        meetupScheduled: false
      };

      // In real implementation:
      // - Save to database
      // - Send push notifications
      // - Create chat room
      // - Initialize consent checklist

      return NextResponse.json({
        success: true,
        match,
        message: 'Mutual match created!'
      });
    } else {
      // Just a like, no match yet
      const like = {
        id: `like_${Date.now()}`,
        likerId: session.user.id,
        likedUserId,
        intention,
        createdAt: new Date().toISOString()
      };

      // In real implementation:
      // - Save like to database
      // - Check for future mutual match

      return NextResponse.json({
        success: true,
        like,
        message: 'Like sent successfully'
      });
    }

  } catch (error) {
    console.error('Match creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's matches
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Mock matches data
    const matches = [
      {
        id: 'match_1',
        user: {
          id: 'user_2',
          name: 'Alex',
          age: 26,
          photo: '/api/placeholder/100/100',
          verified: true
        },
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        chatExpiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(),
        lastMessage: {
          text: 'Hey! Great to match with you 😊',
          sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          senderId: 'user_2'
        },
        intentionsMatch: true,
        consentChecklistCompleted: false,
        meetupScheduled: false
      }
    ];

    return NextResponse.json({
      success: true,
      matches
    });

  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
