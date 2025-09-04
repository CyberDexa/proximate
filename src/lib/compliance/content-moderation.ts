// Content moderation configuration
export const MODERATION_CONFIG = {
  // UK-specific legal requirements
  csam: {
    enabled: true,
    reportToAuthorities: true,
    contactDetails: {
      police: '101', // Non-emergency
      emergency: '999',
      ceop: 'https://www.ceop.police.uk/safety-centre/',
      ica: 'https://www.internetwatch.org.uk/'
    }
  },
  
  // AI moderation thresholds
  aiThresholds: {
    nudity: {
      adult: 0.8, // Allow adult nudity in private albums
      explicit: 0.6, // Block explicit content in public profiles
      suggestive: 0.9 // Higher threshold for suggestive content
    },
    violence: 0.3, // Very low tolerance
    harassment: 0.5,
    hate_speech: 0.4,
    spam: 0.7,
    scam: 0.6
  },

  // Manual review triggers
  manualReviewTriggers: {
    reportThreshold: 3, // 3+ reports trigger manual review
    aiUncertainty: 0.5, // Confidence below 50% needs human review
    newUserContent: true, // All content from users < 24h old
    sensitiveKeywords: true
  }
} as const;

export interface ModerationResult {
  action: 'approve' | 'reject' | 'review' | 'quarantine';
  confidence: number;
  violations: ContentViolation[];
  requiresManualReview: boolean;
  flaggedContent?: string[];
  metadata: {
    aiModels: string[];
    processingTime: number;
    reviewedAt: Date;
    reviewId: string;
  };
}

export interface ContentViolation {
  type: 'csam' | 'nudity' | 'violence' | 'harassment' | 'hate_speech' | 'spam' | 'scam' | 'underage' | 'illegal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  requiresLawEnforcement: boolean;
  evidence?: {
    location: string; // Where in content the violation was found
    context: string;
  };
}

export interface ContentSubmission {
  contentId: string;
  userId: string;
  type: 'profile_photo' | 'private_photo' | 'message' | 'bio' | 'profile_info';
  content: {
    text?: string;
    imageUrl?: string;
    imageBase64?: string;
    metadata?: Record<string, unknown>;
  };
  userContext: {
    accountAge: number; // Hours since account creation
    verificationLevel: 'none' | 'phone' | 'id' | 'full';
    reportHistory: number; // Number of previous reports
    trustScore: number; // 0-100
  };
  submissionContext: {
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
    location?: string;
  };
}

/**
 * Content Moderation Service with UK legal compliance
 */
export class ContentModerationService {
  private static instance: ContentModerationService;
  
  private constructor() {}
  
  public static getInstance(): ContentModerationService {
    if (!ContentModerationService.instance) {
      ContentModerationService.instance = new ContentModerationService();
    }
    return ContentModerationService.instance;
  }

  /**
   * Main content moderation pipeline
   */
  async moderateContent(submission: ContentSubmission): Promise<ModerationResult> {
    const startTime = Date.now();
    const reviewId = this.generateReviewId();
    
    try {
      const violations: ContentViolation[] = [];
      const flaggedContent: string[] = [];
      const aiModelsUsed: string[] = [];

      // 1. CSAM Detection (HIGHEST PRIORITY)
      const csamResult = await this.detectCSAM(submission);
      if (csamResult.violations.length > 0) {
        violations.push(...csamResult.violations);
        
        // Immediate action for CSAM
        if (csamResult.violations.some(v => v.type === 'csam' || v.type === 'underage')) {
          await this.handleCSAMDetection(submission, csamResult.violations, reviewId);
          
          return {
            action: 'reject',
            confidence: 1.0,
            violations: csamResult.violations,
            requiresManualReview: false, // Already handled
            metadata: {
              aiModels: ['csam_detector'],
              processingTime: Date.now() - startTime,
              reviewedAt: new Date(),
              reviewId
            }
          };
        }
      }
      aiModelsUsed.push(...csamResult.modelsUsed);

      // 2. Adult Content Analysis
      if (submission.content.imageUrl || submission.content.imageBase64) {
        const adultContentResult = await this.analyzeAdultContent(submission);
        violations.push(...adultContentResult.violations);
        flaggedContent.push(...adultContentResult.flaggedElements);
        aiModelsUsed.push(...adultContentResult.modelsUsed);
      }

      // 3. Text Content Analysis
      if (submission.content.text) {
        const textAnalysisResult = await this.analyzeTextContent(submission);
        violations.push(...textAnalysisResult.violations);
        flaggedContent.push(...textAnalysisResult.flaggedElements);
        aiModelsUsed.push(...textAnalysisResult.modelsUsed);
      }

      // 4. User Context Analysis
      const contextAnalysis = this.analyzeUserContext(submission);
      violations.push(...contextAnalysis.violations);

      // 5. Determine Action
      const decision = this.determineAction(violations);
      
      // 6. Log for compliance
      await this.logModerationDecision(submission, decision, violations, reviewId);

      return {
        action: decision.action,
        confidence: decision.confidence,
        violations,
        requiresManualReview: decision.requiresManualReview,
        flaggedContent: flaggedContent.length > 0 ? flaggedContent : undefined,
        metadata: {
          aiModels: aiModelsUsed,
          processingTime: Date.now() - startTime,
          reviewedAt: new Date(),
          reviewId
        }
      };

    } catch (error) {
      console.error('Content moderation error:', error);
      
      // Fail safe - require manual review on errors
      return {
        action: 'review',
        confidence: 0,
        violations: [{
          type: 'illegal',
          severity: 'medium',
          confidence: 0,
          description: 'System error during moderation',
          requiresLawEnforcement: false
        }],
        requiresManualReview: true,
        metadata: {
          aiModels: [],
          processingTime: Date.now() - startTime,
          reviewedAt: new Date(),
          reviewId
        }
      };
    }
  }

  /**
   * CSAM Detection - Critical security function
   */
  private async detectCSAM(submission: ContentSubmission): Promise<{
    violations: ContentViolation[];
    modelsUsed: string[];
  }> {
    const violations: ContentViolation[] = [];
    
    // This would integrate with specialized CSAM detection services
    // like PhotoDNA, CSAI Match, or other law enforcement approved tools
    
    if (submission.content.imageUrl || submission.content.imageBase64) {
      // Placeholder for actual CSAM detection
      // In production, this would use Microsoft PhotoDNA or similar
      
      const csamConfidence = await this.mockCSAMDetection();
      
      if (csamConfidence > 0.1) { // Very low threshold for CSAM
        violations.push({
          type: 'csam',
          severity: 'critical',
          confidence: csamConfidence,
          description: 'Potential child sexual abuse material detected',
          requiresLawEnforcement: true,
          evidence: {
            location: 'image_content',
            context: 'Automated CSAM detection system flagged this content'
          }
        });
      }
    }

    // Age detection in photos
    if (submission.content.imageUrl || submission.content.imageBase64) {
      const ageEstimate = await this.estimateAgeInPhoto();
      
      if (ageEstimate.estimatedAge < 18 && ageEstimate.confidence > 0.7) {
        violations.push({
          type: 'underage',
          severity: 'critical',
          confidence: ageEstimate.confidence,
          description: `Detected person appears to be ${ageEstimate.estimatedAge} years old`,
          requiresLawEnforcement: ageEstimate.estimatedAge < 16, // UK specific
          evidence: {
            location: 'image_content',
            context: `Age estimation: ${ageEstimate.estimatedAge} ± ${ageEstimate.margin}`
          }
        });
      }
    }

    return {
      violations,
      modelsUsed: ['csam_detector', 'age_estimator']
    };
  }

  /**
   * Handle CSAM detection - immediate response required by law
   */
  private async handleCSAMDetection(
    submission: ContentSubmission, 
    violations: ContentViolation[],
    reviewId: string
  ): Promise<void> {
    // 1. Immediately suspend user account
    await this.suspendUserAccount(submission.userId, 'csam_detected');
    
    // 2. Preserve evidence
    await this.preserveEvidence(submission, violations, reviewId);
    
    // 3. Report to authorities (UK legal requirement)
    await this.reportToAuthorities({
      type: 'csam',
      userId: submission.userId,
      contentId: submission.contentId,
      reviewId,
      violations,
      preservedEvidence: true,
      timestamp: new Date()
    });
    
    // 4. Alert internal safety team
    await this.alertSafetyTeam({
      priority: 'critical',
      type: 'csam_detected',
      userId: submission.userId,
      reviewId,
      requiresImmediate: true
    });
  }

  /**
   * Adult content analysis for legitimate adult dating context
   */
  private async analyzeAdultContent(submission: ContentSubmission): Promise<{
    violations: ContentViolation[];
    flaggedElements: string[];
    modelsUsed: string[];
  }> {
    const violations: ContentViolation[] = [];
    const flaggedElements: string[] = [];
    
    // Use AI models like AWS Rekognition, Google Vision AI, or Azure Computer Vision
    const adultContentAnalysis = await this.mockAdultContentAnalysis();
    
    // Different rules for different content types
    if (submission.type === 'profile_photo') {
      // Public profile photos - stricter rules
      if (adultContentAnalysis.explicitNudity > MODERATION_CONFIG.aiThresholds.nudity.explicit) {
        violations.push({
          type: 'nudity',
          severity: 'medium',
          confidence: adultContentAnalysis.explicitNudity,
          description: 'Explicit nudity not allowed in public profile photos',
          requiresLawEnforcement: false
        });
        flaggedElements.push('explicit_nudity');
      }
    } else if (submission.type === 'private_photo') {
      // Private photos - more permissive but still moderated
      if (adultContentAnalysis.explicitNudity > 0.95) { // Very high threshold
        violations.push({
          type: 'nudity',
          severity: 'low',
          confidence: adultContentAnalysis.explicitNudity,
          description: 'Potentially inappropriate content in private album',
          requiresLawEnforcement: false
        });
      }
    }

    return {
      violations,
      flaggedElements,
      modelsUsed: ['content_classifier', 'nudity_detector']
    };
  }

  /**
   * Text content analysis
   */
  private async analyzeTextContent(submission: ContentSubmission): Promise<{
    violations: ContentViolation[];
    flaggedElements: string[];
    modelsUsed: string[];
  }> {
    const violations: ContentViolation[] = [];
    const flaggedElements: string[] = [];
    
    const text = submission.content.text!;
    
    // 1. Hate speech detection
    const hateSpeechScore = await this.detectHateSpeech();
    if (hateSpeechScore > MODERATION_CONFIG.aiThresholds.hate_speech) {
      violations.push({
        type: 'hate_speech',
        severity: 'high',
        confidence: hateSpeechScore,
        description: 'Hate speech detected in text content',
        requiresLawEnforcement: false
      });
      flaggedElements.push('hate_speech');
    }

    // 2. Harassment detection
    const harassmentScore = await this.detectHarassment();
    if (harassmentScore > MODERATION_CONFIG.aiThresholds.harassment) {
      violations.push({
        type: 'harassment',
        severity: 'medium',
        confidence: harassmentScore,
        description: 'Potentially harassing language detected',
        requiresLawEnforcement: false
      });
      flaggedElements.push('harassment');
    }

    // 3. Spam/scam detection
    const spamScore = await this.detectSpam();
    if (spamScore > MODERATION_CONFIG.aiThresholds.spam) {
      violations.push({
        type: 'spam',
        severity: 'low',
        confidence: spamScore,
        description: 'Spam content detected',
        requiresLawEnforcement: false
      });
      flaggedElements.push('spam');
    }

    // 4. Check for personal information sharing
    const personalInfo = this.detectPersonalInformation();
    if (personalInfo.length > 0) {
      flaggedElements.push(...personalInfo);
    }

    return {
      violations,
      flaggedElements,
      modelsUsed: ['hate_speech_classifier', 'harassment_detector', 'spam_classifier']
    };
  }

  /**
   * Analyze user context for risk assessment
   */
  private analyzeUserContext(submission: ContentSubmission): { violations: ContentViolation[] } {
    const violations: ContentViolation[] = [];
    
    // New user with unverified content
    if (submission.userContext.accountAge < 24 && 
        submission.userContext.verificationLevel === 'none') {
      violations.push({
        type: 'spam',
        severity: 'low',
        confidence: 0.6,
        description: 'Content from new, unverified user requires review',
        requiresLawEnforcement: false
      });
    }

    // User with poor trust score
    if (submission.userContext.trustScore < 30) {
      violations.push({
        type: 'spam',
        severity: 'medium',
        confidence: 0.8,
        description: 'Content from user with low trust score',
        requiresLawEnforcement: false
      });
    }

    return { violations };
  }

  /**
   * Determine final action based on violations
   */
  private determineAction(violations: ContentViolation[]): {
    action: 'approve' | 'reject' | 'review' | 'quarantine';
    confidence: number;
    requiresManualReview: boolean;
  } {
    // Critical violations = immediate rejection
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    if (criticalViolations.length > 0) {
      return {
        action: 'reject',
        confidence: Math.max(...criticalViolations.map(v => v.confidence)),
        requiresManualReview: false
      };
    }

    // High severity violations = review
    const highViolations = violations.filter(v => v.severity === 'high');
    if (highViolations.length > 0) {
      return {
        action: 'review',
        confidence: Math.max(...highViolations.map(v => v.confidence)),
        requiresManualReview: true
      };
    }

    // Multiple medium violations = quarantine
    const mediumViolations = violations.filter(v => v.severity === 'medium');
    if (mediumViolations.length >= 2) {
      return {
        action: 'quarantine',
        confidence: Math.max(...mediumViolations.map(v => v.confidence)),
        requiresManualReview: true
      };
    }

    // Single medium violation = review
    if (mediumViolations.length === 1) {
      return {
        action: 'review',
        confidence: mediumViolations[0].confidence,
        requiresManualReview: true
      };
    }

    // Only low violations or none = approve
    return {
      action: 'approve',
      confidence: violations.length > 0 ? 
        Math.min(...violations.map(v => v.confidence)) : 
        1.0,
      requiresManualReview: false
    };
  }

  /**
   * Mock implementations for AI services (replace with real integrations)
   */
  private async mockCSAMDetection(): Promise<number> {
    // In production, integrate with PhotoDNA, CSAI Match, etc.
    return 0; // Placeholder
  }

  private async estimateAgeInPhoto(): Promise<{
    estimatedAge: number;
    confidence: number;
    margin: number;
  }> {
    // In production, use age estimation AI
    return {
      estimatedAge: 25, // Placeholder
      confidence: 0.8,
      margin: 3
    };
  }

  private async mockAdultContentAnalysis(): Promise<{
    explicitNudity: number;
    suggestiveNudity: number;
    adultContent: number;
  }> {
    // In production, use AWS Rekognition, Google Vision, etc.
    return {
      explicitNudity: 0.1, // Placeholder
      suggestiveNudity: 0.2,
      adultContent: 0.3
    };
  }

  private async detectHateSpeech(): Promise<number> {
    // In production, use Perspective API, Azure Text Analytics, etc.
    return 0.1; // Placeholder
  }

  private async detectHarassment(): Promise<number> {
    // In production, use specialized harassment detection
    return 0.1; // Placeholder
  }

  private async detectSpam(): Promise<number> {
    // In production, use spam detection services
    return 0.1; // Placeholder
  }

  private detectPersonalInformation(): string[] {
    // In production, this would analyze the actual text content
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Utility functions
   */
  private generateReviewId(): string {
    return `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async suspendUserAccount(userId: string, reason: string): Promise<void> {
    // Implement account suspension
    console.log(`Account suspended: ${userId}, reason: ${reason}`);
  }

  private async preserveEvidence(
    submission: ContentSubmission, 
    violations: ContentViolation[],
    reviewId: string
  ): Promise<void> {
    // Implement evidence preservation for legal compliance
    console.log(`Evidence preserved for review: ${reviewId}`);
  }

  private async reportToAuthorities(report: any): Promise<void> {
    // Implement reporting to UK authorities (CEOP, NCA, etc.)
    console.log('Reported to authorities:', report);
  }

  private async alertSafetyTeam(alert: any): Promise<void> {
    // Implement internal safety team alerts
    console.log('Safety team alerted:', alert);
  }

  private async logModerationDecision(
    submission: ContentSubmission,
    decision: any,
    violations: ContentViolation[],
    reviewId: string
  ): Promise<void> {
    // Log for compliance and auditing
    console.log('Moderation decision logged:', {
      reviewId,
      decision: decision.action,
      violationCount: violations.length
    });
  }
}

/**
 * Export singleton instance
 */
export const contentModerationService = ContentModerationService.getInstance();
