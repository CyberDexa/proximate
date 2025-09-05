import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // TODO: Replace with actual user authentication
    const currentUserId = 'f18904e5-44d9-48f0-9bbd-fac3a36b29f3';

    // Count unread messages for the current user
    const unreadCount = await db.message.count({
      where: {
        AND: [
          {
            // Messages where the current user is the receiver (not sender)
            match: {
              OR: [
                { user_one_id: currentUserId },
                { user_two_id: currentUserId }
              ]
            }
          },
          {
            // Message was not sent by current user
            sender_id: {
              not: currentUserId
            }
          },
          {
            // Message is unread
            read_at: null
          }
        ]
      }
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ count: 0 });
  }
}
