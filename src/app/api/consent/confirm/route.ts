import { NextRequest, NextResponse } from 'next/server';
import { storeConsentEducation, logConsentConfirmation } from '@/lib/consent/consent-tracker';

/**
 * Consent Confirmation API Route
 * Handles consent education completion and ongoing consent confirmations
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type,
      userId,
      topicsCompleted,
      quizScore,
      quizPassed,
      agreementSigned,
      consentType,
      encounterId,
      metadata
    } = body;

    // Get client IP for audit trail
    const clientIP = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown';

    if (type === 'education_completion') {
      // Handle consent education completion
      if (!userId || !topicsCompleted || quizScore === undefined || 
          quizPassed === undefined || agreementSigned === undefined) {
        return NextResponse.json(
          { error: 'Missing required education completion data' },
          { status: 400 }
        );
      }

      // Validate quiz passing score
      if (!quizPassed || quizScore < 4) {
        return NextResponse.json(
          { error: 'Quiz must be passed with score of 4 or higher' },
          { status: 400 }
        );
      }

      // Store consent education completion
      storeConsentEducation({
        userId,
        topicsCompleted,
        quizScore,
        quizPassed,
        agreementSigned
      });

      // Log completion for audit trail
      console.log('Consent education completed:', {
        userId,
        timestamp: new Date().toISOString(),
        quizScore,
        topicsCompleted: topicsCompleted.length,
        ipAddress: clientIP
      });

      // In production, store in database
      const auditRecord = {
        userId,
        action: 'consent_education_completed',
        timestamp: new Date().toISOString(),
        data: {
          quizScore,
          topicsCompleted,
          agreementSigned
        },
        ipAddress: clientIP
      };

      // TODO: Store in database
      // await prisma.auditLog.create({ data: auditRecord });

      return NextResponse.json({
        success: true,
        message: 'Consent education completed successfully',
        timestamp: new Date().toISOString()
      });

    } else if (type === 'consent_confirmation') {
      // Handle ongoing consent confirmations
      if (!userId || !consentType) {
        return NextResponse.json(
          { error: 'Missing required consent confirmation data' },
          { status: 400 }
        );
      }

      // Validate consent type
      const validConsentTypes = [
        'general',
        'photo_sharing',
        'location_sharing',
        'intimate_activity'
      ];

      if (!validConsentTypes.includes(consentType)) {
        return NextResponse.json(
          { error: 'Invalid consent type' },
          { status: 400 }
        );
      }

      // Log consent confirmation
      logConsentConfirmation({
        userId,
        encounterId,
        consentType,
        confirmed: true,
        ipAddress: clientIP,
        metadata
      });

      // In production, store in database
      const confirmationRecord = {
        userId,
        encounterId,
        consentType,
        confirmed: true,
        timestamp: new Date().toISOString(),
        ipAddress: clientIP,
        metadata
      };

      // TODO: Store in database
      // await prisma.consentConfirmation.create({ data: confirmationRecord });

      console.log('Consent confirmation logged:', confirmationRecord);

      return NextResponse.json({
        success: true,
        message: 'Consent confirmation recorded',
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Consent confirmation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Invalid request format',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (type === 'audit') {
      // Return consent audit report
      // In production, fetch from database
      const auditReport = {
        userId,
        consentEducationStatus: 'completed', // Would check database
        lastEducationDate: new Date().toISOString(),
        recentConfirmations: [], // Would fetch from database
        pendingReminders: []
      };

      return NextResponse.json(auditReport);
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Consent retrieval error:', error);
    
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Note: Consent confirmations should generally NOT be deleted
    // This endpoint is primarily for account deletion compliance
    console.log('Consent data deletion requested for user:', userId);

    // In production, mark as deleted but preserve for legal/audit purposes
    // await prisma.consentConfirmation.updateMany({
    //   where: { userId },
    //   data: { deletedAt: new Date() }
    // });

    return NextResponse.json({
      success: true,
      message: 'Consent data marked for deletion',
      note: 'Consent records are preserved for legal compliance'
    });

  } catch (error) {
    console.error('Consent deletion error:', error);
    
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
