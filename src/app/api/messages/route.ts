import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

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

    // Get conversations for this user
    const conversations = await db.conversation.findMany({
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
        match: {
          select: {
            id: true,
            matchedAt: true,
            chatExpiresAt: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: currentUserId },
                readAt: null
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform conversations for frontend
    const transformedConversations = conversations.map((conversation: any) => {
      // Get the other user (not the current user)
      const partner = conversation.user1Id === currentUserId ? conversation.user2 : conversation.user1;
      const lastMessage = conversation.messages[0];

      return {
        id: conversation.match?.id || conversation.id,
        partner: {
          id: partner.id,
          name: partner.name || 'User',
          image: partner.photos?.[0]?.url || '/placeholder-avatar.jpg',
          isVerified: true // Placeholder - could be based on actual verification
        },
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.createdAt,
          senderId: lastMessage.senderId
        } : undefined,
        unreadCount: conversation._count.messages,
        matchedAt: conversation.match?.matchedAt || conversation.createdAt,
        consentConfirmed: false, // Placeholder - would check actual consent status
        videoVerified: false, // Placeholder - would check actual video verification
        hasActiveMeetup: false // Placeholder - would check for active meetups
      };
    });

    return NextResponse.json({
      success: true,
      matches: transformedConversations
    });

  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { conversationId, content, type = 'text' } = await request.json();

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

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'Conversation ID and content are required' },
        { status: 400 }
      );
    }

    // Verify user is part of this conversation
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId }
        ]
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Create the message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: currentUserId,
        content,
        type
      }
    });

    // Update conversation timestamp
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        type: message.type,
        senderId: message.senderId,
        createdAt: message.createdAt
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
