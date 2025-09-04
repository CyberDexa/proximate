import { NextRequest, NextResponse } from 'next/server';
import { verificationService } from '@/lib/verification/verification-service';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await request.formData();

    // Extract selfie images
    const selfieImages: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('selfie_') && value instanceof File) {
        selfieImages.push(value);
      }
    }

    // Extract profile image URLs
    const profileImages: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('profile_') && typeof value === 'string') {
        profileImages.push(value);
      }
    }

    if (selfieImages.length === 0) {
      return NextResponse.json(
        { error: 'No selfie images provided' },
        { status: 400 }
      );
    }

    // Perform fraud detection
    const fraudCheck = await verificationService.detectFraud(userId, {
      selfieImages,
      profileImages
    });

    if (fraudCheck.isSuspicious) {
      return NextResponse.json({
        success: false,
        error: 'Verification failed - suspicious activity detected',
        reasons: fraudCheck.reasons
      }, { status: 400 });
    }

    // Perform photo verification
    const result = await verificationService.verifyPhoto(
      userId,
      selfieImages,
      profileImages
    );

    if (result.isAuthentic) {
      // Update user verification status in database
      await updateUserVerificationStatus(userId, 'photo', true);
      
      return NextResponse.json({
        success: true,
        verified: true,
        confidence: result.confidence
      });
    } else {
      return NextResponse.json({
        success: false,
        verified: false,
        reason: result.reason
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Photo verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update verification status
async function updateUserVerificationStatus(
  userId: string, 
  type: 'photo' | 'id' | 'background', 
  verified: boolean
) {
  // In production, this would update the database
  // For now, we'll simulate the database update
  console.log(`Updated ${type} verification for user ${userId}: ${verified}`);
  
  // You would implement actual database update here using Prisma:
  /*
  await prisma.verification.upsert({
    where: { userId },
    update: {
      [type === 'photo' ? 'photoVerified' : 
       type === 'id' ? 'idVerified' : 
       'backgroundCheck']: verified,
      verifiedAt: verified ? new Date() : null
    },
    create: {
      userId,
      [type === 'photo' ? 'photoVerified' : 
       type === 'id' ? 'idVerified' : 
       'backgroundCheck']: verified,
      verifiedAt: verified ? new Date() : null
    }
  });
  */
}
