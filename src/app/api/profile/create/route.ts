import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // For now, skip authentication during onboarding
    // In production, you'd create a temporary user session or use a different flow
    const session = await getServerSession();
    
    const profileData = await request.json();
    
    // Validate required fields
    const {
      identityVerified,
      verificationPhotos,
      intentions,
      availability,
      preferredMeetupTime,
      interestedIn,
      kinks,
      boundaries,
      dealBreakers,
      photos,
      privatePhotos,
      blurUntilMatch,
      trustedContact,
      enableLocationSharing,
      safeWord,
      consentPreferences
    } = profileData;

    // Basic validation (make it less strict for demo)
    if (!intentions || intentions.length === 0) {
      return NextResponse.json(
        { error: 'At least one intention must be selected' },
        { status: 400 }
      );
    }

    // For demo purposes, accept profile without strict photo requirements
    console.log('Profile data received:', {
      intentions,
      interestedIn: interestedIn?.length || 0,
      photos: photos?.length || 0,
      hasSession: !!session
    });

    // For development/testing, create a user if session is not available
    let userId: string;
    
    if (session?.user?.email) {
      // Get or create user from session
      let user = await db.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        user = await db.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'User',
            isAgeVerified: true // Coming from profile setup means age is verified
          }
        });
      }
      userId = user.id;
    } else {
      // For testing without authentication, create a temporary user
      const tempEmail = `user_${Date.now()}@temp.proximeet.com`;
      const user = await db.user.create({
        data: {
          email: tempEmail,
          name: 'Test User',
          isAgeVerified: true
        }
      });
      userId = user.id;
    }

    // Create/update profile
    await db.profile.upsert({
      where: { userId },
      update: {
        lookingFor: intentions,
        interestedIn: interestedIn || [],
        kinks: kinks || [],
        boundaries: boundaries || [],
        dealBreakers: dealBreakers || [],
        discreetMode: !!blurUntilMatch,
        preferredMeetupTime: preferredMeetupTime || [],
        availability: availability || []
      },
      create: {
        userId,
        lookingFor: intentions,
        interestedIn: interestedIn || [],
        kinks: kinks || [],
        boundaries: boundaries || [],
        dealBreakers: dealBreakers || [],
        discreetMode: !!blurUntilMatch,
        preferredMeetupTime: preferredMeetupTime || [],
        availability: availability || []
      }
    });

    // Create intentions with expiry
    // First, clear existing intentions for this user
    await db.intention.deleteMany({
      where: { userId }
    });

    for (const intention of intentions) {
      const expiresAt = intention === 'tonight' 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        : null;

      await db.intention.create({
        data: {
          userId,
          type: intention,
          expiresAt
        }
      });
    }

    // Create/update safety profile
    await db.safetyProfile.upsert({
      where: { userId },
      update: {
        emergencyContacts: trustedContact ? [{ name: 'Trusted Contact', phone: trustedContact }] : [],
        safeWord: safeWord || '',
        consentPreferences: consentPreferences || []
      },
      create: {
        userId,
        emergencyContacts: trustedContact ? [{ name: 'Trusted Contact', phone: trustedContact }] : [],
        safeWord: safeWord || '',
        consentPreferences: consentPreferences || []
      }
    });

    // Store photos if provided
    if (photos && photos.length > 0) {
      // Clear existing photos first
      await db.photo.deleteMany({
        where: { userId, isPublic: true }
      });

      for (let i = 0; i < photos.length; i++) {
        await db.photo.create({
          data: {
            userId,
            url: photos[i],
            isPrimary: i === 0,
            isPublic: true,
            isVerified: false
          }
        });
      }
    }

    // Store private photos if provided
    if (privatePhotos && privatePhotos.length > 0) {
      // Clear existing private photos first
      await db.photo.deleteMany({
        where: { userId, isPublic: false }
      });

      for (const privatePhoto of privatePhotos) {
        await db.photo.create({
          data: {
            userId,
            url: privatePhoto,
            isPrimary: false,
            isPublic: false,
            isVerified: false
          }
        });
      }
    }
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      userId: userId
    });

  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
