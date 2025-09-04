/**
 * Consent Tracker - ProxiMeet
 * Handles consent education completion tracking and compliance
 */

interface ConsentEducationRecord {
  userId: string;
  completedAt: string;
  topicsCompleted: string[];
  quizScore: number;
  quizPassed: boolean;
  agreementSigned: boolean;
  version: string; // Track which version of consent education was completed
  expiresAt?: string; // For periodic re-education
}

interface ConsentConfirmation {
  userId: string;
  encounterId?: string;
  consentType: 'general' | 'photo_sharing' | 'location_sharing' | 'intimate_activity';
  confirmed: boolean;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

interface ConsentReminder {
  userId: string;
  type: 'annual_refresh' | 'policy_update' | 'incident_followup';
  createdAt: string;
  scheduledFor: string;
  completed: boolean;
  completedAt?: string;
}

const CONSENT_EDUCATION_VERSION = '1.0';
const RE_EDUCATION_INTERVAL_MONTHS = 12; // Annual re-education

/**
 * Check if user has completed current consent education
 */
export function hasValidConsentEducation(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem(`consent_education_${userId}`);
  if (!stored) return false;
  
  try {
    const record: ConsentEducationRecord = JSON.parse(stored);
    
    // Check if completed
    if (!record.agreementSigned || !record.quizPassed) {
      return false;
    }
    
    // Check if current version
    if (record.version !== CONSENT_EDUCATION_VERSION) {
      return false;
    }
    
    // Check if expired (if expiration is set)
    if (record.expiresAt) {
      const expiration = new Date(record.expiresAt);
      const now = new Date();
      if (now > expiration) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Store consent education completion
 */
export function storeConsentEducation(data: {
  userId: string;
  topicsCompleted: string[];
  quizScore: number;
  quizPassed: boolean;
  agreementSigned: boolean;
}): void {
  if (typeof window === 'undefined') return;
  
  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + RE_EDUCATION_INTERVAL_MONTHS);
  
  const record: ConsentEducationRecord = {
    ...data,
    completedAt: now.toISOString(),
    version: CONSENT_EDUCATION_VERSION,
    expiresAt: expiresAt.toISOString()
  };
  
  localStorage.setItem(`consent_education_${data.userId}`, JSON.stringify(record));
  
  // Schedule re-education reminder
  scheduleReEducationReminder(data.userId, expiresAt);
}

/**
 * Get consent education record
 */
export function getConsentEducationRecord(userId: string): ConsentEducationRecord | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(`consent_education_${userId}`);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Log consent confirmation for specific actions
 */
export function logConsentConfirmation(confirmation: Omit<ConsentConfirmation, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const record: ConsentConfirmation = {
    ...confirmation,
    timestamp: new Date().toISOString()
  };
  
  // In production, this would be sent to the API
  const key = `consent_confirmations_${confirmation.userId}`;
  const existing = localStorage.getItem(key);
  const confirmations = existing ? JSON.parse(existing) : [];
  
  confirmations.push(record);
  
  // Keep only last 100 confirmations per user
  if (confirmations.length > 100) {
    confirmations.splice(0, confirmations.length - 100);
  }
  
  localStorage.setItem(key, JSON.stringify(confirmations));
  
  console.log('Consent confirmation logged:', record);
}

/**
 * Get user's consent confirmations
 */
export function getUserConsentConfirmations(userId: string): ConsentConfirmation[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(`consent_confirmations_${userId}`);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Check if user has confirmed consent for specific type
 */
export function hasConsentForType(
  userId: string, 
  consentType: ConsentConfirmation['consentType'],
  withinHours: number = 24
): boolean {
  const confirmations = getUserConsentConfirmations(userId);
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - withinHours);
  
  return confirmations.some(c => 
    c.consentType === consentType && 
    c.confirmed && 
    new Date(c.timestamp) > cutoff
  );
}

/**
 * Schedule re-education reminder
 */
export function scheduleReEducationReminder(userId: string, scheduledFor: Date): void {
  if (typeof window === 'undefined') return;
  
  const reminder: ConsentReminder = {
    userId,
    type: 'annual_refresh',
    createdAt: new Date().toISOString(),
    scheduledFor: scheduledFor.toISOString(),
    completed: false
  };
  
  const key = `consent_reminders_${userId}`;
  const existing = localStorage.getItem(key);
  const reminders = existing ? JSON.parse(existing) : [];
  
  reminders.push(reminder);
  localStorage.setItem(key, JSON.stringify(reminders));
}

/**
 * Get pending reminders for user
 */
export function getPendingReminders(userId: string): ConsentReminder[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(`consent_reminders_${userId}`);
  if (!stored) return [];
  
  try {
    const reminders = JSON.parse(stored);
    const now = new Date();
    
    return reminders.filter((r: ConsentReminder) => 
      !r.completed && new Date(r.scheduledFor) <= now
    );
  } catch {
    return [];
  }
}

/**
 * Mark reminder as completed
 */
export function completeReminder(userId: string, reminderIndex: number): void {
  if (typeof window === 'undefined') return;
  
  const key = `consent_reminders_${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return;
  
  try {
    const reminders = JSON.parse(stored);
    if (reminders[reminderIndex]) {
      reminders[reminderIndex].completed = true;
      reminders[reminderIndex].completedAt = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(reminders));
    }
  } catch {
    // Handle error silently
  }
}

/**
 * Clear all consent data for user (for account deletion)
 */
export function clearUserConsentData(userId: string): void {
  if (typeof window === 'undefined') return;
  
  const keys = [
    `consent_education_${userId}`,
    `consent_confirmations_${userId}`,
    `consent_reminders_${userId}`
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
}

/**
 * Generate consent audit report for user
 */
export function generateConsentAuditReport(userId: string): {
  education: ConsentEducationRecord | null;
  confirmations: ConsentConfirmation[];
  reminders: ConsentReminder[];
  compliance: {
    hasValidEducation: boolean;
    lastEducationDate: string | null;
    totalConfirmations: number;
    pendingReminders: number;
  };
} {
  const education = getConsentEducationRecord(userId);
  const confirmations = getUserConsentConfirmations(userId);
  const reminders = getPendingReminders(userId);
  
  return {
    education,
    confirmations,
    reminders,
    compliance: {
      hasValidEducation: hasValidConsentEducation(userId),
      lastEducationDate: education?.completedAt || null,
      totalConfirmations: confirmations.length,
      pendingReminders: reminders.length
    }
  };
}

/**
 * Validate consent before sensitive actions
 */
export function validateConsentForAction(
  userId: string,
  action: 'photo_sharing' | 'location_sharing' | 'intimate_planning'
): {
  isValid: boolean;
  reasons: string[];
  requirements: string[];
} {
  const reasons: string[] = [];
  const requirements: string[] = [];
  
  // Check general consent education
  if (!hasValidConsentEducation(userId)) {
    reasons.push('Consent education not completed or expired');
    requirements.push('Complete consent education');
  }
  
  // Check action-specific consent
  const actionConsentMap: Record<string, ConsentConfirmation['consentType']> = {
    'photo_sharing': 'photo_sharing',
    'location_sharing': 'location_sharing',
    'intimate_planning': 'intimate_activity'
  };
  
  const consentType = actionConsentMap[action];
  if (consentType && !hasConsentForType(userId, consentType, 24)) {
    reasons.push(`No recent consent confirmation for ${action.replace('_', ' ')}`);
    requirements.push(`Confirm consent for ${action.replace('_', ' ')}`);
  }
  
  return {
    isValid: reasons.length === 0,
    reasons,
    requirements
  };
}
