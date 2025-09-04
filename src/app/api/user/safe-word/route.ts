import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.SAFE_WORD_ENCRYPTION_KEY || 'fallback-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        safetyProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hasSafeWord: !!user.safetyProfile?.safeWord,
      // Never expose the actual safe word
    });

  } catch (error) {
    console.error('Get safe word error:', error);
    return NextResponse.json(
      { error: 'Failed to check safe word' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { safeWord } = body;

    if (!safeWord || typeof safeWord !== 'string' || safeWord.length < 4) {
      return NextResponse.json(
        { error: 'Safe word must be at least 4 characters' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Encrypt the safe word
    const encryptedSafeWord = CryptoJS.AES.encrypt(
      safeWord.toLowerCase().trim(),
      ENCRYPTION_KEY
    ).toString();

    // Update or create safety profile
    await db.safetyProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        safeWord: encryptedSafeWord,
      },
      update: {
        safeWord: encryptedSafeWord,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Safe word set successfully',
    });

  } catch (error) {
    console.error('Set safe word error:', error);
    return NextResponse.json(
      { error: 'Failed to set safe word' },
      { status: 500 }
    );
  }
}
