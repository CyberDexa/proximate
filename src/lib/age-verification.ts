/**
 * Age Verification Utilities for ProxiMeet
 * Handles age calculation, verification status, and compliance
 */

import { APP_CONFIG } from '@/lib/config/app-config';

export interface AgeVerificationResult {
  isValid: boolean;
  age: number;
  errors: string[];
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Verify if user meets minimum age requirement
 */
export function verifyAge(birthDate: Date): AgeVerificationResult {
  const errors: string[] = [];
  
  // Validate birth date is not in the future
  if (birthDate > new Date()) {
    errors.push('Birth date cannot be in the future');
  }
  
  // Validate birth date is not unreasonably old (120 years)
  const maxAge = 120;
  const minBirthYear = new Date().getFullYear() - maxAge;
  if (birthDate.getFullYear() < minBirthYear) {
    errors.push('Birth date is not valid');
  }
  
  const age = calculateAge(birthDate);
  
  // Check minimum age requirement
  if (age < APP_CONFIG.MINIMUM_AGE) {
    errors.push(`You must be at least ${APP_CONFIG.MINIMUM_AGE} years old to use this service`);
  }
  
  return {
    isValid: errors.length === 0 && age >= APP_CONFIG.MINIMUM_AGE,
    age,
    errors
  };
}

/**
 * Check if age verification is stored (cookie/localStorage)
 */
export function isAgeVerificationStored(): boolean {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem('age_verified');
  if (!stored) return false;
  
  try {
    const data = JSON.parse(stored);
    const timestamp = new Date(data.timestamp);
    const now = new Date();
    
    // Verification expires after 30 days
    const expirationDays = 30;
    const expirationMs = expirationDays * 24 * 60 * 60 * 1000;
    
    return now.getTime() - timestamp.getTime() < expirationMs;
  } catch {
    return false;
  }
}

/**
 * Store age verification status
 */
export function storeAgeVerification(birthDate: Date): void {
  if (typeof window === 'undefined') return;
  
  const verification = verifyAge(birthDate);
  
  if (verification.isValid) {
    const data = {
      verified: true,
      timestamp: new Date().toISOString(),
      age: verification.age
    };
    
    localStorage.setItem('age_verified', JSON.stringify(data));
  }
}

/**
 * Clear age verification (for logout/reset)
 */
export function clearAgeVerification(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('age_verified');
}

/**
 * Get stored age verification data
 */
export function getStoredAgeVerification(): { verified: boolean; age?: number } | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('age_verified');
  if (!stored) return null;
  
  try {
    const data = JSON.parse(stored);
    if (isAgeVerificationStored()) {
      return {
        verified: true,
        age: data.age
      };
    }
  } catch {
    // Invalid data, clear it
    clearAgeVerification();
  }
  
  return null;
}

/**
 * Validate date input format
 */
export function validateDateInput(dateString: string): Date | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return null;
  
  return date;
}

/**
 * Format age verification error messages for display
 */
export function formatAgeVerificationErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) return errors[0];
  
  return `${errors.slice(0, -1).join(', ')} and ${errors[errors.length - 1]}`;
}

/**
 * Generate age verification audit log entry
 */
export function createAgeVerificationLog(
  userId: string,
  birthDate: Date,
  result: AgeVerificationResult,
  ipAddress?: string
): {
  userId: string;
  timestamp: string;
  age: number;
  verified: boolean;
  ipAddress?: string;
  errors?: string[];
} {
  return {
    userId,
    timestamp: new Date().toISOString(),
    age: result.age,
    verified: result.isValid,
    ipAddress,
    ...(result.errors.length > 0 && { errors: result.errors })
  };
}
