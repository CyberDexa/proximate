/**
 * ProxiMeet Safety Constants
 * Emergency contacts, prohibited content patterns, and safety protocols
 */

// Emergency numbers by region
export const EMERGENCY_CONTACTS = {
  US: {
    emergency: '911',
    crisis_text: '741741',
    domestic_violence: '1-800-799-7233',
    sexual_assault: '1-800-656-4673'
  },
  CA: {
    emergency: '911',
    crisis_text: '686868',
    domestic_violence: '1-800-363-9010'
  },
  UK: {
    emergency: '999',
    domestic_violence: '0808-2000-247',
    sexual_assault: '0808-802-9999'
  }
} as const;

// Prohibited content patterns (for content moderation)
export const PROHIBITED_PATTERNS = [
  // Personal information
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
  /\b\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|lane|ln|drive|dr|court|ct|place|pl)\b/i, // Addresses
  
  // Financial exploitation
  /\b(?:venmo|cashapp|paypal|zelle)\b/i,
  /\$\d+/g, // Money amounts
  
  // Illegal services
  /\b(?:escort|prostitute|hooker|sugar.?baby|findom)\b/i,
  
  // Harassment indicators
  /\b(?:send.?nudes|dick.?pic|unsolicited)\b/i,
  
  // Age-related red flags
  /\b(?:barely|just.?turned|teen|young|school)\b/i
] as const;

// Suspicious behavior patterns
export const SUSPICIOUS_BEHAVIORS = {
  // Profile red flags
  PROFILE_RED_FLAGS: [
    'no_photos',
    'stock_photos',
    'inconsistent_age',
    'external_links',
    'financial_requests'
  ],
  
  // Message red flags
  MESSAGE_RED_FLAGS: [
    'immediate_meetup_request',
    'location_too_specific',
    'pressure_tactics',
    'personal_info_request',
    'external_communication'
  ],
  
  // Meeting red flags
  MEETUP_RED_FLAGS: [
    'private_location_first_meet',
    'no_public_verification',
    'pressure_for_home_address',
    'alcohol_drug_focus'
  ]
} as const;

// Consent keywords and phrases
export const CONSENT_KEYWORDS = {
  POSITIVE: [
    'yes', 'definitely', 'i want', 'i consent', 'i agree',
    'sounds good', 'im into that', 'lets do it'
  ],
  
  NEGATIVE: [
    'no', 'stop', 'dont', 'not comfortable', 'maybe later',
    'not ready', 'not sure', 'uncomfortable'
  ],
  
  UNCERTAIN: [
    'maybe', 'not sure', 'i guess', 'if you want',
    'whatever', 'up to you'
  ]
} as const;

// Safety protocol responses
export const SAFETY_RESPONSES = {
  PANIC_BUTTON_ACTIVATED: {
    immediate_actions: [
      'alert_emergency_contacts',
      'capture_location',
      'prepare_emergency_call',
      'log_incident'
    ],
    message_template: "EMERGENCY: {user_name} has activated their panic button. Last known location: {location}. Please check on them immediately."
  },
  
  SAFETY_CHECK_MISSED: {
    escalation_levels: [
      { minutes: 15, action: 'send_reminder' },
      { minutes: 30, action: 'alert_emergency_contact' },
      { minutes: 60, action: 'escalate_to_authorities' }
    ]
  },
  
  SUSPICIOUS_REPORT: {
    auto_actions: [
      'temporary_account_review',
      'alert_safety_team',
      'preserve_chat_evidence'
    ]
  }
} as const;

// Safe meetup location categories
export const SAFE_MEETUP_LOCATIONS = {
  COFFEE_SHOPS: ['starbucks', 'local coffee', 'cafe'],
  RESTAURANTS: ['casual dining', 'food court', 'diner'],
  PUBLIC_SPACES: ['library', 'mall', 'park', 'museum'],
  BARS: ['sports bar', 'wine bar', 'brewery'],
  
  // Location safety criteria
  SAFETY_CRITERIA: [
    'public_access',
    'good_lighting',
    'security_cameras',
    'multiple_exits',
    'cell_service',
    'public_transportation'
  ]
} as const;

export type EmergencyContact = typeof EMERGENCY_CONTACTS;
export type SafetyResponse = typeof SAFETY_RESPONSES;
