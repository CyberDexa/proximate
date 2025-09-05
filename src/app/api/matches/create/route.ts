import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface MatchRequest {
  likedUserId: string;
  intention?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Get current user ID - allow testing without auth
    let currentUserId: string | null = null;
    
    if (session?.user?.email) {
      const currentUser = await db.user.findUnique({
        where: { email: session.user.email }
      });
      currentUserId = currentUser?.id || null;
    } else {
      // For testing without authentication, get the most recent user
      const recentUser = await db.user.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      currentUserId = recentUser?.id || null;
    }

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'User not found' },
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
    if (likedUserId === currentUserId) {
      return NextResponse.json(
        { error: 'Cannot like yourself' },
        { status: 400 }
      );
    }

    // Check if user already liked this person
    const existingLike = await db.like.findUnique({
      where: {
        likerId_likedId: {
          likerId: currentUserId,
          likedId: likedUserId
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'User already liked' },
        { status: 400 }
      );
    }

    // Create the like
    const like = await db.like.create({
      data: {
        likerId: currentUserId,
        likedId: likedUserId,
        intention: intention || 'ongoing'
      }
    });

    // Check if this creates a mutual match
    const mutualLike = await db.like.findUnique({
      where: {
        likerId_likedId: {
          likerId: likedUserId,
          likedId: currentUserId
        }
      }
    });

    let match = null;

    if (mutualLike) {
      // Create a match
      match = await db.match.create({
        data: {
          user1Id: currentUserId,
          user2Id: likedUserId,
          matchedAt: new Date(),
          chatExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        },
        include: {
          user1: {
            select: {
              id: true,
              name: true,
              photos: {
                where: { isPublic: true, isPrimary: true },
                take: 1
              }
            }
          },
          user2: {
            select: {
              id: true,
              name: true,
              photos: {
                where: { isPublic: true, isPrimary: true },
                take: 1
              }
            }
          }
        }
      });

      // Create initial conversation
      const conversation = await db.conversation.create({
        data: {
          user1Id: currentUserId,
          user2Id: likedUserId,
          matchId: match.id
        }
      });

      // Send a system message about the match
      await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: currentUserId,
          content: `🎉 You matched! Start your conversation with safety in mind.`,
          type: 'system'
        }
      });

      return NextResponse.json({
        success: true,
        match: {
          id: match.id,
          user1Id: match.user1Id,
          user2Id: match.user2Id,
          matchedAt: match.matchedAt,
          chatExpiresAt: match.chatExpiresAt,
          user1: match.user1,
          user2: match.user2
        },
        message: 'Mutual match created!'
      });
    } else {
      // Just a like, no match yet
      return NextResponse.json({
        success: true,
        like: {
          id: like.id,
          likerId: like.likerId,
          likedUserId: like.likedId,
          intention: like.intention,
          createdAt: like.createdAt
        },
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
    
    // Get current user ID - allow testing without auth
    let currentUserId: string | null = null;
    
    if (session?.user?.email) {
      const currentUser = await db.user.findUnique({
        where: { email: session.user.email }
      });
      currentUserId = currentUser?.id || null;
    } else {
      // For testing without authentication, get the most recent user
      const recentUser = await db.user.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      currentUserId = recentUser?.id || null;
    }

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Get real matches from database
    const matches = await db.match.findMany({
      where: {
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            photos: {
              where: { isPublic: true, isPrimary: true },
              take: 1
            }
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            photos: {
              where: { isPublic: true, isPrimary: true },
              take: 1
            }
          }
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { matchedAt: 'desc' }
    });

    // Transform matches for frontend
    const transformedMatches = matches.map((match: any) => {
      // Get the other user (not the current user)
      const otherUser = match.user1Id === currentUserId ? match.user2 : match.user1;
      const lastMessage = match.conversation?.messages?.[0];

      return {
        id: match.id,
        user: {
          id: otherUser.id,
          name: otherUser.name || 'User',
          age: Math.floor(Math.random() * 15) + 22, // Placeholder
          photo: otherUser.photos?.[0]?.url || '/api/placeholder/100/100',
          verified: true // Placeholder
        },
        createdAt: match.matchedAt.toISOString(),
        chatExpiresAt: match.chatExpiresAt?.toISOString() || null,
        lastMessage: lastMessage ? {
          text: lastMessage.content,
          sentAt: lastMessage.createdAt.toISOString(),
          senderId: lastMessage.senderId
        } : null,
        intentionsMatch: true, // Placeholder
        consentChecklistCompleted: false, // Placeholder
        meetupScheduled: false // Placeholder
      };
    });

    return NextResponse.json({
      success: true,
      matches: transformedMatches
    });

  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
