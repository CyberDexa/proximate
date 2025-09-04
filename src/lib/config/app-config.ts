/**
 * ProxiMeet Application Configuration
 * Centralized configuration for safety, legal, and business rules
 */

export const APP_CONFIG = {
  // Legal & Safety Requirements
  MINIMUM_AGE: 18,
  ADULT_CONTENT_WARNING: true,
  
  // File Upload Limits
  MAX_PHOTO_SIZE_MB: 10,
  MAX_PHOTOS_PUBLIC: 6,
  MAX_PHOTOS_PRIVATE: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Data Retention
  MESSAGE_RETENTION_DAYS: 7,
  INACTIVE_PROFILE_DELETION_DAYS: 90,
  
  // Location & Privacy
  LOCATION_FUZZING_RADIUS_MILES: {
    MIN: 0.5,
    MAX: 2,
    DEFAULT: 1
  },
  
  // Safety Features
  SAFETY_CHECK_IN_INTERVALS: {
    MEETUP_REMINDER_MINUTES: 30,
    POST_MEETUP_CHECK_HOURS: 2,
    EMERGENCY_TIMEOUT_MINUTES: 5
  },
  
  // Rate Limits
  RATE_LIMITS: {
    SWIPES_PER_DAY_FREE: 10,
    MESSAGES_PER_HOUR: 50,
    PROFILE_UPDATES_PER_DAY: 5,
    PHOTO_UPLOADS_PER_DAY: 10
  },
  
  // Verification Requirements
  VERIFICATION: {
    PHOTO_VERIFICATION_REQUIRED: true,
    ID_VERIFICATION_PREMIUM: true,
    RE_VERIFICATION_DAYS: 90
  },
  
  // Matching Algorithm
  MATCHING: {
    MAX_DISTANCE_MILES: 25,
    INTENTION_WEIGHT: 0.4,
    SAFETY_SCORE_WEIGHT: 0.3,
    COMPATIBILITY_WEIGHT: 0.3
  },
  
  // Business Rules
  PREMIUM_FEATURES: {
    MONTHLY_PRICE_USD: 19.99,
    PREMIUM_PLUS_PRICE_USD: 39.99,
    FREE_TRIAL_DAYS: 7
  }
} as const;

export type AppConfig = typeof APP_CONFIG;
