import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const instantMode = searchParams.get('instantMode') === 'true';
    const maxDistance = searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : 10; // km
    const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!) : 18;
    const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!) : 100;
    const intentions = searchParams.get('intentions')?.split(',') || [];
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Get current user ID for filtering
    let currentUserId: string | null = null;
    if (session?.user?.email) {
      const currentUser = await db.user.findUnique({
        where: { email: session.user.email }
      });
      currentUserId = currentUser?.id || null;
    }

    // Build the query
    const skip = (page - 1) * limit;
    
    // Start with basic user query
    let whereClause: any = {
      isAgeVerified: true,
      // Don't show the current user
      ...(currentUserId && { NOT: { id: currentUserId } })
    };

    // Add instant mode filter - users with active "tonight" intentions
    if (instantMode) {
      whereClause.intentions = {
        some: {
          type: 'tonight',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      };
    }

    // Add intention filters
    if (intentions.length > 0) {
      whereClause.intentions = {
        some: {
          type: { in: intentions },
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      };
    }

    // Fetch users with their profiles and related data
    const users = await db.user.findMany({
      where: whereClause,
      include: {
        profile: true,
        intentions: {
          where: {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        },
        photos: {
          where: { isPublic: true },
          orderBy: { isPrimary: 'desc' },
          take: 1 // Just get the primary photo for discovery
        },
        _count: {
          select: {
            receivedLikes: true,
            givenLikes: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' } // Show newer users first
      ],
      skip,
      take: limit
    });

    // Calculate the count of active users nearby for instant mode
    const activeUsersNearby = instantMode ? users.length : await db.user.count({
      where: {
        isAgeVerified: true,
        ...(currentUserId && { NOT: { id: currentUserId } }),
        intentions: {
          some: {
            type: 'tonight',
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        }
      }
    });

    // Transform the data for the frontend
    const transformedUsers = users.map((user: any) => {
      const primaryPhoto = user.photos[0];
      const activeIntentions = user.intentions.map((i: any) => i.type);
      
      // Check if user is available now (has "tonight" intention)
      const availableNow = user.intentions.some((i: any) => i.type === 'tonight');
      
      // Mock some fields that would require additional implementation
      const mockDistance = Math.random() * 5; // km - would be calculated based on location
      const mockMutualInterests = Math.floor(Math.random() * 6); // would be calculated based on profile matching
      const mockSafetyScore = 7 + Math.random() * 3; // would be calculated based on verification and behavior
      
      return {
        id: user.id,
        name: user.name || 'User',
        age: calculateAge(user.profile?.lookingFor?.[0] || 'Unknown'), // Placeholder - would need actual birthdate
        distance: mockDistance,
        blurredPhoto: primaryPhoto?.url || '/api/placeholder/100/100',
        intentions: activeIntentions,
        verified: user.isAgeVerified, // Could be expanded with photo verification
        availableNow,
        mutualInterests: mockMutualInterests,
        lastActive: user.updatedAt.toISOString(),
        safetyScore: mockSafetyScore
      };
    });

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      activeUsersNearby,
      pagination: {
        page,
        limit,
        total: users.length,
        hasMore: users.length === limit
      }
    });

  } catch (error) {
    console.error('Discovery API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate age (placeholder - in real app would use actual birthdate)
function calculateAge(lookingFor: string): number {
  // This is a placeholder. In a real app, you'd store the actual birthdate
  // and calculate age from it. For now, return a random age in adult range.
  const baseAge = 22;
  const maxAge = 35;
  return baseAge + Math.floor(Math.random() * (maxAge - baseAge));
}
