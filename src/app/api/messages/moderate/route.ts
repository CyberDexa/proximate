import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // TODO: Implement auth config
// import { prisma } from '@/lib/prisma'; // TODO: Implement prisma config

interface ModerationFlags {
  containsPersonalInfo: boolean;
  isPotentialScam: boolean;
  hasAggressiveLanguage: boolean;
  hasIntimateContent: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  autoBlur: boolean;
  requiresReview: boolean;
}

interface ModerationRequest {
  messageId?: string;
  content: string;
  messageType: 'text' | 'photo' | 'location';
  matchId: string;
  senderId: string;
  isFirstThreeMessages?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Uncomment when auth is implemented
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body: ModerationRequest = await request.json();
    const { content, messageType, matchId, senderId, isFirstThreeMessages = false } = body;

    // Perform content moderation
    const moderationResult = await moderateContent(content, messageType, isFirstThreeMessages);

    // Log moderation result for safety team review
    if (moderationResult.requiresReview || moderationResult.riskLevel === 'critical') {
      await logModerationAlert({
        matchId,
        senderId,
        content: moderationResult.riskLevel === 'critical' ? '[REDACTED]' : content,
        flags: moderationResult,
        timestamp: new Date()
      });
    }

    // If critical risk, immediately alert safety team
    if (moderationResult.riskLevel === 'critical') {
      await alertSafetyTeam({
        matchId,
        senderId,
        riskLevel: 'critical',
        flags: moderationResult
      });
    }

    return NextResponse.json({
      success: true,
      moderation: moderationResult,
      message: getResponseMessage(moderationResult)
    });

  } catch (error) {
    console.error('Message moderation error:', error);
    return NextResponse.json(
      { error: 'Moderation service unavailable' },
      { status: 500 }
    );
  }
}

async function moderateContent(content: string, messageType: string, isFirstThreeMessages: boolean): Promise<ModerationFlags> {
  const flags: ModerationFlags = {
    containsPersonalInfo: false,
    isPotentialScam: false,
    hasAggressiveLanguage: false,
    hasIntimateContent: false,
    riskLevel: 'low',
    autoBlur: false,
    requiresReview: false
  };

  // Personal information detection (especially critical in first 3 messages)
  const personalInfoPatterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
    /\b\d{1,5}\s+([A-Z][a-z]+\s*)+\b/, // Street addresses
    /\b(snapchat|instagram|insta|snap|whatsapp|telegram|kik)\b/i, // Social media
    /\b(venmo|cashapp|paypal|zelle)\b/i, // Payment apps
  ];

  for (const pattern of personalInfoPatterns) {
    if (pattern.test(content)) {
      flags.containsPersonalInfo = true;
      if (isFirstThreeMessages) {
        flags.riskLevel = 'high';
        flags.requiresReview = true;
      }
      break;
    }
  }

  // Scam detection patterns
  const scamPatterns = [
    /\b(verify|verification|account|suspended|click|link|urgent)\b/i,
    /\b(money|cash|payment|send|transfer|bitcoin|crypto)\b/i,
    /\b(emergency|hospital|stuck|help|western union)\b/i,
    /\b(gift card|steam|itunes|amazon card)\b/i,
  ];

  let scamScore = 0;
  for (const pattern of scamPatterns) {
    if (pattern.test(content)) {
      scamScore++;
    }
  }

  if (scamScore >= 2) {
    flags.isPotentialScam = true;
    flags.riskLevel = 'high';
    flags.requiresReview = true;
  }

  // Aggressive language detection
  const aggressivePatterns = [
    /\b(fuck you|bitch|slut|whore|cunt)\b/i,
    /\b(kill|hurt|rape|force|make you)\b/i,
    /\b(don't take no|you have to|you will)\b/i,
    /\b(pathetic|worthless|stupid bitch)\b/i,
  ];

  for (const pattern of aggressivePatterns) {
    if (pattern.test(content)) {
      flags.hasAggressiveLanguage = true;
      flags.riskLevel = 'critical';
      flags.requiresReview = true;
      break;
    }
  }

  // Intimate content detection (for auto-blur)
  const intimatePatterns = [
    /\b(nude|naked|dick|cock|pussy|tits|ass|sex|fuck)\b/i,
    /\b(send me|show me|your body|how wet)\b/i,
    /\b(cam|video call|private|alone)\b/i,
  ];

  for (const pattern of intimatePatterns) {
    if (pattern.test(content)) {
      flags.hasIntimateContent = true;
      if (messageType === 'photo') {
        flags.autoBlur = true;
      }
      break;
    }
  }

  // Consent-related red flags
  const consentRedFlags = [
    /\b(don't tell|secret|between us|no one knows)\b/i,
    /\b(just this once|try it|what happens)\b/i,
    /\b(you owe me|after I paid|I bought you)\b/i,
  ];

  for (const pattern of consentRedFlags) {
    if (pattern.test(content)) {
      flags.riskLevel = 'high';
      flags.requiresReview = true;
      break;
    }
  }

  return flags;
}

async function logModerationAlert(alertData: any) {
  // TODO: Store moderation alerts in database
  console.log('Moderation alert logged:', {
    timestamp: alertData.timestamp,
    matchId: alertData.matchId,
    riskLevel: alertData.flags.riskLevel,
    flagsTriggered: Object.keys(alertData.flags).filter(key => alertData.flags[key] === true)
  });

  // TODO: Implement database storage
  // await prisma.moderationAlert.create({
  //   data: {
  //     matchId: alertData.matchId,
  //     senderId: alertData.senderId,
  //     content: alertData.content,
  //     flags: alertData.flags,
  //     createdAt: alertData.timestamp
  //   }
  // });
}

async function alertSafetyTeam(alertData: any) {
  // TODO: Implement real-time safety team alerts
  console.log('CRITICAL SAFETY ALERT:', {
    matchId: alertData.matchId,
    senderId: alertData.senderId,
    riskLevel: alertData.riskLevel,
    timestamp: new Date().toISOString()
  });

  // TODO: Integrate with safety team dashboard, Slack, SMS alerts
  // - Send to safety team Slack channel
  // - Create high-priority ticket
  // - SMS safety team lead for critical alerts
  // - Auto-flag user account for review
}

function getResponseMessage(moderation: ModerationFlags): string {
  if (moderation.riskLevel === 'critical') {
    return 'This message has been flagged for safety review. Our team will investigate immediately.';
  }
  
  if (moderation.containsPersonalInfo) {
    return 'For your safety, avoid sharing personal information like phone numbers or social media accounts in early messages.';
  }
  
  if (moderation.isPotentialScam) {
    return 'This message contains patterns associated with scams. Please be cautious and report if you feel this is suspicious.';
  }
  
  if (moderation.hasIntimateContent && moderation.autoBlur) {
    return 'Intimate content will be blurred until consent is confirmed by both parties.';
  }
  
  return 'Message approved.';
}

// Additional endpoint for reporting false positives
export async function PATCH(request: NextRequest) {
  try {
    const { messageId, reportType } = await request.json();
    
    // TODO: Handle false positive reports to improve moderation accuracy
    console.log(`False positive reported for message ${messageId}: ${reportType}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to report' }, { status: 500 });
  }
}
