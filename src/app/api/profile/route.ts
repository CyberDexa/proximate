import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    
    let userId: string | null = null;

    if (session?.user?.email) {
      // Get user from session
      const user = await db.user.findUnique({
        where: { email: session.user.email }
      });
      userId = user?.id || null;
    } else if (userIdParam) {
      // For testing, allow direct user ID lookup
      userId = userIdParam;
    } else {
      // For development, get the most recent user if no session
      const recentUser = await db.user.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      userId = recentUser?.id || null;
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user with profile data
    const user = await db.user.findUnique({
      where: { id: userId },
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
          orderBy: { isPrimary: 'desc' }
        },
        privatePhotos: {
          where: { isPublic: false }
        },
        safetyProfile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Format response
    const profileData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAgeVerified: user.isAgeVerified,
      profile: user.profile ? {
        lookingFor: user.profile.lookingFor,
        interestedIn: user.profile.interestedIn,
        kinks: user.profile.kinks,
        boundaries: user.profile.boundaries,
        dealBreakers: user.profile.dealBreakers,
        discreetMode: user.profile.discreetMode,
        preferredMeetupTime: user.profile.preferredMeetupTime,
        availability: user.profile.availability,
        createdAt: user.profile.createdAt,
        updatedAt: user.profile.updatedAt
      } : null,
      intentions: user.intentions.map((intention: any) => ({
        type: intention.type,
        expiresAt: intention.expiresAt,
        createdAt: intention.createdAt
      })),
      photos: user.photos.map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        isPrimary: photo.isPrimary,
        isVerified: photo.isVerified
      })),
      privatePhotos: user.privatePhotos.map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        isVerified: photo.isVerified
      })),
      safetyProfile: user.safetyProfile ? {
        emergencyContacts: user.safetyProfile.emergencyContacts,
        safeWord: user.safetyProfile.safeWord,
        consentPreferences: user.safetyProfile.consentPreferences,
        createdAt: user.safetyProfile.createdAt,
        updatedAt: user.safetyProfile.updatedAt
      } : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      profile: profileData
    });

  } catch (error) {
    console.error('Profile retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
