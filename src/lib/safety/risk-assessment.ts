import { db } from '@/lib/db';

export interface RiskFactors {
  accountAge: number; // Days since account creation
  verificationStatus: 'none' | 'partial' | 'full';
  reportCount: number; // Number of reports received
  blockCount: number; // Number of times blocked
  messagePatterns: {
    aggressiveLanguage: number;
    requestsPersonalInfo: number;
    rapidFireMessages: number;
  };
  behaviorPatterns: {
    rapidAccountCreation: boolean;
    suspiciousPhotoUploads: boolean;
    ageInconsistencies: boolean;
  };
  interactionMetrics: {
    responseRate: number;
    averageConversationLength: number;
    unmatchRate: number;
  };
}

export interface RiskAssessment {
  userId: string;
  riskScore: number; // 0-100, higher = more risky
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactors;
  recommendations: string[];
  lastAssessed: Date;
}

class RiskAssessmentService {
  private readonly RISK_THRESHOLDS = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 90,
  };

  private readonly WEIGHT_FACTORS = {
    ACCOUNT_AGE: 0.15,
    VERIFICATION: 0.20,
    REPORTS: 0.25,
    BLOCKS: 0.15,
    MESSAGE_PATTERNS: 0.15,
    BEHAVIOR_PATTERNS: 0.10,
  };

  async assessUserRisk(userId: string): Promise<RiskAssessment> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          verification: true,
          reportsReceived: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
              },
            },
          },
          blocksReceived: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
              },
            },
          },
          photos: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const factors = await this.calculateRiskFactors();
      const riskScore = this.calculateRiskScore(factors);
      const riskLevel = this.determineRiskLevel(riskScore);
      const recommendations = this.generateRecommendations(factors, riskLevel);

      const assessment: RiskAssessment = {
        userId,
        riskScore,
        riskLevel,
        factors,
        recommendations,
        lastAssessed: new Date(),
      };

      // Store assessment in database
      await this.storeAssessment(assessment);

      // Take automatic actions if needed
      await this.takeAutomaticActions(assessment);

      return assessment;
    } catch (error) {
      console.error('Risk assessment failed:', error);
      throw error;
    }
  }

  private async calculateRiskFactors(): Promise<RiskFactors> {
    // Simplified for now - in production would analyze actual user data
    return {
      accountAge: 30, // days
      verificationLevel: 0.5,
      reportHistory: 0,
      blockHistory: 0,
      messagePatterns: {
        frequency: 0.3,
        timeDistribution: 0.3,
        recipientVariety: 0.3
      },
      interactionHistory: {
        ghostingRate: 0.1,
        reportRate: 0.05,
        positiveRatings: 0.8
      }
    };
  }

  private getVerificationStatus(verification: Record<string, unknown>): 'none' | 'partial' | 'full' {
    if (!verification) return 'none';
    
    const verificationCount = [
      verification.idVerified,
      verification.photoVerified,
      verification.backgroundCheck,
    ].filter(Boolean).length;

    if (verificationCount === 0) return 'none';
    if (verificationCount < 3) return 'partial';
    return 'full';
  }

  private async analyzeMessagePatterns(): Promise<RiskFactors['messagePatterns']> {
    // In a real implementation, this would analyze message content
    // For now, returning mock patterns
    return {
      aggressiveLanguage: 0,
      requestsPersonalInfo: 0,
      rapidFireMessages: 0,
    };
  }

  private async analyzeBehaviorPatterns(): Promise<RiskFactors['behaviorPatterns']> {
    // Simplified for now - in production would analyze actual behavior
    return {
      rapidAccountCreation: false,
      suspiciousPhotoUploads: false,
      ageInconsistencies: false,
    };
  }

  private async calculateInteractionMetrics(): Promise<RiskFactors['interactionMetrics']> {
    // Mock implementation - in real app, would calculate from actual interactions
    return {
      responseRate: 0.8, // 80% response rate
      averageConversationLength: 15, // 15 messages average
      unmatchRate: 0.1, // 10% unmatch rate
    };
  }

  private calculateRiskScore(factors: RiskFactors): number {
    let score = 0;

    // Account age factor (newer accounts are riskier)
    const ageScore = Math.max(0, 30 - factors.accountAge) * 2; // Max 60 points
    score += ageScore * this.WEIGHT_FACTORS.ACCOUNT_AGE;

    // Verification factor
    const verificationScore = {
      none: 80,
      partial: 40,
      full: 0,
    }[factors.verificationStatus];
    score += verificationScore * this.WEIGHT_FACTORS.VERIFICATION;

    // Reports factor (exponential growth)
    const reportsScore = Math.min(100, factors.reportCount * 25);
    score += reportsScore * this.WEIGHT_FACTORS.REPORTS;

    // Blocks factor
    const blocksScore = Math.min(100, factors.blockCount * 20);
    score += blocksScore * this.WEIGHT_FACTORS.BLOCKS;

    // Message patterns
    const messageScore = (
      factors.messagePatterns.aggressiveLanguage * 30 +
      factors.messagePatterns.requestsPersonalInfo * 40 +
      factors.messagePatterns.rapidFireMessages * 20
    );
    score += Math.min(100, messageScore) * this.WEIGHT_FACTORS.MESSAGE_PATTERNS;

    // Behavior patterns
    const behaviorScore = Object.values(factors.behaviorPatterns)
      .filter(Boolean).length * 33.33; // Each pattern is worth ~33 points
    score += behaviorScore * this.WEIGHT_FACTORS.BEHAVIOR_PATTERNS;

    return Math.round(Math.min(100, score));
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= this.RISK_THRESHOLDS.CRITICAL) return 'critical';
    if (score >= this.RISK_THRESHOLDS.HIGH) return 'high';
    if (score >= this.RISK_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  }

  private generateRecommendations(
    factors: RiskFactors, 
    riskLevel: string
  ): string[] {
    const recommendations: string[] = [];

    if (factors.verificationStatus === 'none') {
      recommendations.push('Require immediate photo verification');
    }

    if (factors.reportCount > 2) {
      recommendations.push('Manual review of recent reports');
    }

    if (factors.accountAge < 7) {
      recommendations.push('Limit daily interactions for new account');
    }

    if (factors.behaviorPatterns.rapidAccountCreation) {
      recommendations.push('Check for duplicate accounts');
    }

    if (factors.behaviorPatterns.suspiciousPhotoUploads) {
      recommendations.push('Manual photo review required');
    }

    if (riskLevel === 'critical') {
      recommendations.push('Consider immediate account suspension');
      recommendations.push('Escalate to senior moderator');
    }

    if (riskLevel === 'high') {
      recommendations.push('Increase monitoring frequency');
      recommendations.push('Require additional verification');
    }

    return recommendations;
  }

  private async storeAssessment(assessment: RiskAssessment): Promise<void> {
    try {
      await db.riskAssessment.create({
        data: {
          userId: assessment.userId,
          riskScore: assessment.riskScore,
          riskLevel: assessment.riskLevel,
          factors: JSON.stringify(assessment.factors),
          recommendations: JSON.stringify(assessment.recommendations),
          assessedAt: assessment.lastAssessed,
        },
      });
    } catch (error) {
      console.error('Failed to store risk assessment:', error);
    }
  }

  private async takeAutomaticActions(assessment: RiskAssessment): Promise<void> {
    const { userId, riskLevel, riskScore } = assessment;

    try {
      if (riskLevel === 'critical') {
        // Auto-suspend critical risk accounts
        await db.user.update({
          where: { id: userId },
          data: {
            suspended: true,
            suspendedReason: `Auto-suspended: Critical risk score ${riskScore}`,
          },
        });

        // Create support notification
        await db.supportNotification.create({
          data: {
            incidentId: `risk_${userId}_${Date.now()}`,
            priority: 'critical',
            type: 'high_risk_user',
            notifiedAt: new Date(),
          },
        });
      }

      if (riskLevel === 'high') {
        // Increase monitoring for high-risk users
        await db.userMonitoring.upsert({
          where: { userId },
          create: {
            userId,
            monitoringLevel: 'high',
            startedAt: new Date(),
            reason: `High risk score: ${riskScore}`,
          },
          update: {
            monitoringLevel: 'high',
            reason: `High risk score: ${riskScore}`,
          },
        });
      }
    } catch (error) {
      console.error('Failed to take automatic actions:', error);
    }
  }

  async getPatternAnalysis(): Promise<any> {
    // Analyze patterns across all users
    const recentAssessments = await db.riskAssessment.findMany({
      where: {
        assessedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: {
        riskScore: 'desc',
      },
    });

    const patterns = {
      totalAssessments: recentAssessments.length,
      averageRiskScore: recentAssessments.length > 0 
        ? recentAssessments.reduce((sum: number, a: any) => sum + a.riskScore, 0) / recentAssessments.length 
        : 0,
      riskDistribution: {
        critical: recentAssessments.filter((a: any) => a.riskLevel === 'critical').length,
        high: recentAssessments.filter((a: any) => a.riskLevel === 'high').length,
        medium: recentAssessments.filter((a: any) => a.riskLevel === 'medium').length,
        low: recentAssessments.filter((a: any) => a.riskLevel === 'low').length,
      },
      topRiskFactors: this.analyzeTopRiskFactors(recentAssessments),
    };

    return patterns;
  }

  private analyzeTopRiskFactors(assessments: any[]): string[] {
    // Analyze which factors are most common in high-risk assessments
    const highRiskAssessments = assessments.filter(a => 
      a.riskLevel === 'high' || a.riskLevel === 'critical'
    );

    const factorCounts: Record<string, number> = {};

    highRiskAssessments.forEach(assessment => {
      try {
        const factors = JSON.parse(assessment.factors);
        
        if (factors.verificationStatus === 'none') {
          factorCounts['No verification'] = (factorCounts['No verification'] || 0) + 1;
        }
        
        if (factors.reportCount > 0) {
          factorCounts['Multiple reports'] = (factorCounts['Multiple reports'] || 0) + 1;
        }
        
        if (factors.accountAge < 7) {
          factorCounts['New account'] = (factorCounts['New account'] || 0) + 1;
        }
        
        if (factors.behaviorPatterns.rapidAccountCreation) {
          factorCounts['Rapid account creation'] = (factorCounts['Rapid account creation'] || 0) + 1;
        }
      } catch (error) {
        console.error('Error parsing risk factors:', error);
      }
    });

    return Object.entries(factorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([factor]) => factor);
  }
}

export const riskAssessment = new RiskAssessmentService();
