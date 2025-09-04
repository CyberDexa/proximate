import { NextRequest, NextResponse } from 'next/server';
import { verifyAge, createAgeVerificationLog } from '@/lib/age-verification';

/**
 * Age Verification API Route
 * Handles age verification requests and sets secure cookies
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate } = body;
    
    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      );
    }
    
    const date = new Date(birthDate);
    const verification = verifyAge(date);
    
    // Log verification attempt (in production, store in database)
    const clientIP = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'unknown';
    
    const logEntry = createAgeVerificationLog(
      'anonymous', // Would be actual user ID after authentication
      date,
      verification,
      clientIP
    );
    
    console.log('Age verification attempt:', logEntry);
    
    if (!verification.isValid) {
      return NextResponse.json(
        { 
          error: 'Age verification failed',
          details: verification.errors 
        },
        { status: 403 }
      );
    }
    
    // Create secure response with age verification cookie
    const response = NextResponse.json({
      success: true,
      message: 'Age verification successful',
      age: verification.age
    });
    
    // Set secure HTTP-only cookie for age verification
    const cookieData = {
      verified: true,
      timestamp: new Date().toISOString(),
      age: verification.age
    };
    
    response.cookies.set('age_verified', JSON.stringify(cookieData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('Age verification error:', error);
    
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
