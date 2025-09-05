import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

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

    // In production, you would:
    // 1. Get user ID from session
    // 2. Create/update user profile in database
    // 3. Store photos securely
    // 4. Create safety profile
    // 5. Set up intentions with expiry

    /* Example Prisma operations:
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        lookingFor: intentions,
        interestedIn,
        kinks,
        boundaries,
        dealBreakers,
        discreetMode: blurUntilMatch,
        // ... other fields
      },
      create: {
        userId: user.id,
        lookingFor: intentions,
        interestedIn,
        kinks,
        boundaries,
        dealBreakers,
        discreetMode: blurUntilMatch,
        // ... other fields
      }
    });

    // Create intentions
    for (const intention of intentions) {
      const expiresAt = intention === 'tonight' 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        : null;

      await prisma.intention.create({
        data: {
          userId: user.id,
          type: intention,
          expiresAt
        }
      });
    }

    // Create safety profile
    await prisma.safetyProfile.upsert({
      where: { userId: user.id },
      update: {
        emergencyContacts: trustedContact ? [{ name: 'Trusted Contact', phone: trustedContact }] : [],
        safeWord,
        // ... other safety fields
      },
      create: {
        userId: user.id,
        emergencyContacts: trustedContact ? [{ name: 'Trusted Contact', phone: trustedContact }] : [],
        safeWord,
        // ... other safety fields
      }
    });

    // Store photos
    for (let i = 0; i < photos.length; i++) {
      await prisma.photo.create({
        data: {
          userId: user.id,
          url: photos[i],
          isPrimary: i === 0,
          isPublic: true,
          isVerified: false
        }
      });
    }

    // Store private photos
    for (const privatePhoto of privatePhotos || []) {
      await prisma.photo.create({
        data: {
          userId: user.id,
          url: privatePhoto,
          isPrimary: false,
          isPublic: false,
          isVerified: false
        }
      });
    }

    */

    // For now, simulate successful profile creation
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profileId: 'temp-profile-id'
    });

  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
