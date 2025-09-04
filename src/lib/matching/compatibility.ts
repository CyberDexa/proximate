interface UserPreferences {
  intentions: string[];
  ageRange: { min: number; max: number };
  maxDistance: number;
  interests: string[];
  boundaries: string[];
  dealBreakers: string[];
  kinks?: string[];
  lookingFor: string[];
  availableNow: boolean;
}

interface User {
  id: string;
  age: number;
  distance: number;
  preferences: UserPreferences;
  verificationStatus: {
    photoVerified: boolean;
    idVerified: boolean;
    backgroundChecked: boolean;
  };
  safetyScore: number;
}

interface CompatibilityScore {
  overall: number;
  breakdown: {
    intentions: number;
    preferences: number;
    boundaries: number;
    interests: number;
    safety: number;
  };
  flags: string[];
  suggestions: string[];
}

export class CompatibilityCalculator {
  static calculateCompatibility(user1: User, user2: User): CompatibilityScore {
    const intentionScore = this.calculateIntentionAlignment(
      user1.preferences.intentions,
      user2.preferences.intentions
    );

    const preferencesScore = this.calculatePreferenceMatch(
      user1.preferences,
      user2.preferences
    );

    const boundaryScore = this.checkBoundaryCompatibility(
      user1.preferences.boundaries,
      user2.preferences.boundaries,
      user1.preferences.dealBreakers,
      user2.preferences.dealBreakers
    );

    const interestsScore = this.calculateInterestOverlap(
      user1.preferences.interests,
      user2.preferences.interests
    );

    const safetyScore = this.calculateSafetyScore(
      user1.verificationStatus,
      user2.verificationStatus,
      user1.safetyScore,
      user2.safetyScore
    );

    const flags = this.identifyPotentialIssues(user1, user2);
    const suggestions = this.generateConversationStarters(user1, user2);

    // Weighted overall score
    const overall = (
      intentionScore * 0.3 +
      preferencesScore * 0.25 +
      boundaryScore * 0.25 +
      interestsScore * 0.1 +
      safetyScore * 0.1
    );

    return {
      overall,
      breakdown: {
        intentions: intentionScore,
        preferences: preferencesScore,
        boundaries: boundaryScore,
        interests: interestsScore,
        safety: safetyScore
      },
      flags,
      suggestions
    };
  }

  private static calculateIntentionAlignment(
    intentions1: string[],
    intentions2: string[]
  ): number {
    if (!intentions1.length || !intentions2.length) return 0;

    const overlap = intentions1.filter(intention => 
      intentions2.includes(intention)
    );

    if (overlap.length === 0) return 0;

    // Weight certain intentions more heavily
    const weightedScore = overlap.reduce((score, intention) => {
      switch (intention) {
        case 'tonight':
          return score + 100; // Highest urgency match
        case 'this week':
          return score + 80;
        case 'ongoing':
          return score + 60;
        default:
          return score + 40;
      }
    }, 0);

    return Math.min(100, weightedScore);
  }

  private static calculatePreferenceMatch(
    prefs1: UserPreferences,
    prefs2: UserPreferences
  ): number {
    let score = 0;
    let totalChecks = 0;

    // Age compatibility
    totalChecks += 2;
    if (prefs1.ageRange.min <= prefs2.ageRange.max && 
        prefs1.ageRange.max >= prefs2.ageRange.min) {
      score += 50; // Significant weight for age compatibility
    }

    // Distance compatibility
    totalChecks += 1;
    if (prefs1.maxDistance >= prefs2.maxDistance) {
      score += 25;
    }

    // Looking for compatibility
    if (prefs1.lookingFor.length && prefs2.lookingFor.length) {
      const lookingForOverlap = prefs1.lookingFor.filter(item =>
        prefs2.lookingFor.includes(item)
      );
      if (lookingForOverlap.length > 0) {
        score += 25;
      }
    }

    return Math.min(100, score);
  }

  private static checkBoundaryCompatibility(
    boundaries1: string[],
    boundaries2: string[],
    dealBreakers1: string[],
    dealBreakers2: string[]
  ): number {
    // Check for deal breaker conflicts
    const conflicts1 = dealBreakers1.filter(breaker =>
      boundaries2.includes(breaker) || !boundaries2.length
    );
    
    const conflicts2 = dealBreakers2.filter(breaker =>
      boundaries1.includes(breaker) || !boundaries1.length
    );

    if (conflicts1.length > 0 || conflicts2.length > 0) {
      return 0; // Immediate incompatibility
    }

    // Check boundary alignment (optional but good)
    if (!boundaries1.length || !boundaries2.length) {
      return 70; // Neutral score if boundaries not set
    }

    const commonBoundaries = boundaries1.filter(boundary =>
      boundaries2.includes(boundary)
    );

    const alignmentScore = (commonBoundaries.length / 
      Math.max(boundaries1.length, boundaries2.length)) * 100;

    return Math.max(50, alignmentScore); // Minimum 50 if no conflicts
  }

  private static calculateInterestOverlap(
    interests1: string[],
    interests2: string[]
  ): number {
    if (!interests1.length || !interests2.length) return 50;

    const overlap = interests1.filter(interest =>
      interests2.includes(interest)
    );

    return (overlap.length / Math.max(interests1.length, interests2.length)) * 100;
  }

  private static calculateSafetyScore(
    verification1: User['verificationStatus'],
    verification2: User['verificationStatus'],
    safetyScore1: number,
    safetyScore2: number
  ): number {
    const avgSafetyScore = (safetyScore1 + safetyScore2) / 2;
    
    let verificationBonus = 0;
    if (verification1.photoVerified && verification2.photoVerified) {
      verificationBonus += 20;
    }
    if (verification1.idVerified && verification2.idVerified) {
      verificationBonus += 15;
    }
    if (verification1.backgroundChecked && verification2.backgroundChecked) {
      verificationBonus += 10;
    }

    return Math.min(100, (avgSafetyScore * 10) + verificationBonus);
  }

  private static identifyPotentialIssues(user1: User, user2: User): string[] {
    const flags: string[] = [];

    // Age gap warning
    const ageGap = Math.abs(user1.age - user2.age);
    if (ageGap > 10) {
      flags.push('Large age gap - ensure both parties are comfortable');
    }

    // Distance warning
    if (user1.distance > 5) {
      flags.push('Long distance - consider meeting halfway');
    }

    // Verification mismatch
    const verification1 = user1.verificationStatus;
    const verification2 = user2.verificationStatus;
    
    if (verification1.photoVerified !== verification2.photoVerified) {
      flags.push('Different verification levels - consider video call');
    }

    // Safety score disparity
    const scoreDiff = Math.abs(user1.safetyScore - user2.safetyScore);
    if (scoreDiff > 2) {
      flags.push('Different safety ratings - proceed with extra caution');
    }

    // Availability mismatch
    if (user1.preferences.availableNow !== user2.preferences.availableNow) {
      flags.push('Different availability - confirm timing expectations');
    }

    return flags;
  }

  private static generateConversationStarters(user1: User, user2: User): string[] {
    const suggestions: string[] = [];

    // Based on shared intentions
    const sharedIntentions = user1.preferences.intentions.filter(intention =>
      user2.preferences.intentions.includes(intention)
    );

    if (sharedIntentions.includes('tonight')) {
      suggestions.push("Hey! I see we're both looking for something tonight. What sounds fun to you?");
    }

    if (sharedIntentions.includes('ongoing')) {
      suggestions.push("I noticed we're both interested in something ongoing. Want to chat about what that looks like for you?");
    }

    // Based on shared interests
    const sharedInterests = user1.preferences.interests.filter(interest =>
      user2.preferences.interests.includes(interest)
    );

    if (sharedInterests.length > 0) {
      suggestions.push(`I see we both enjoy ${sharedInterests[0]}. That's awesome!`);
    }

    // Default safe openers
    suggestions.push("Hey there! Your profile caught my eye. How's your day going?");
    suggestions.push("Hi! I'd love to get to know you better. What are you up to today?");

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  static shouldShowMatch(compatibilityScore: CompatibilityScore): boolean {
    // Minimum thresholds for showing a match
    return (
      compatibilityScore.overall >= 60 &&
      compatibilityScore.breakdown.boundaries >= 50 &&
      compatibilityScore.breakdown.intentions > 0
    );
  }

  static getPriorityScore(
    compatibilityScore: CompatibilityScore,
    user: User
  ): number {
    let priority = compatibilityScore.overall;

    // Boost verified users
    if (user.verificationStatus.photoVerified) priority += 10;
    if (user.verificationStatus.idVerified) priority += 5;

    // Boost high safety scores
    if (user.safetyScore >= 9) priority += 10;

    // Boost available now users
    if (user.preferences.availableNow) priority += 15;

    return Math.min(100, priority);
  }
}
