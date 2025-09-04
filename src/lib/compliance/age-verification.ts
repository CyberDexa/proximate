import { NextRequest } from 'next/server';

// UK-specific age verification requirements
export const UK_AGE_REQUIREMENTS = {
  minimumAge: 18,
  verificationMethods: [
    'government_id',
    'passport',
    'driving_license',
    'age_verification_service'
  ],
  requiredDocuments: {
    'government_id': {
      accepted: ['passport', 'driving_license', 'national_id'],
      features: ['photo', 'date_of_birth', 'expiry_date'],
      blacklisted: ['provisional_license'] // Under 18 can have these
    }
  }
} as const;

// EU age requirements for potential expansion
export const EU_AGE_REQUIREMENTS = {
  'GB': UK_AGE_REQUIREMENTS,
  'DE': { minimumAge: 18, verificationMethods: ['personalausweis', 'passport'] },
  'FR': { minimumAge: 18, verificationMethods: ['carte_identite', 'passport'] },
  'NL': { minimumAge: 18, verificationMethods: ['id_kaart', 'passport'] },
  'IE': { minimumAge: 18, verificationMethods: ['pps_card', 'passport', 'driving_license'] },
} as const;

export interface AgeVerificationResult {
  isValid: boolean;
  age: number | null;
  verificationMethod: string;
  documentType: string;
  confidence: number;
  requiresManualReview: boolean;
  errors: string[];
  metadata: {
    documentNumber?: string;
    expiryDate?: string;
    issueDate?: string;
    country: string;
    verifiedAt: Date;
  };
}

export interface VerificationRequest {
  userId: string;
  documentType: 'passport' | 'driving_license' | 'national_id';
  documentImages: {
    front: string; // Base64 encoded
    back?: string; // For driving licenses
    selfie: string; // Live selfie for comparison
  };
  userAgent: string;
  ipAddress: string;
  timestamp: Date;
}

/**
 * Main age verification service - UK focused with EU expansion capability
 */
export class AgeVerificationService {
  private static instance: AgeVerificationService;
  
  private constructor() {}
  
  public static getInstance(): AgeVerificationService {
    if (!AgeVerificationService.instance) {
      AgeVerificationService.instance = new AgeVerificationService();
    }
    return AgeVerificationService.instance;
  }

  /**
   * Verify age using UK government-issued documents
   */
  async verifyAge(request: VerificationRequest): Promise<AgeVerificationResult> {
    try {
      // Pre-validation
      const preValidation = this.preValidateRequest(request);
      if (!preValidation.isValid) {
        return {
          isValid: false,
          age: null,
          verificationMethod: 'none',
          documentType: request.documentType,
          confidence: 0,
          requiresManualReview: true,
          errors: preValidation.errors,
          metadata: {
            country: 'GB',
            verifiedAt: new Date()
          }
        };
      }

      // AI-powered document verification (would integrate with Veriff/Onfido)
      const documentAnalysis = await this.analyzeDocument(request);
      
      // Face matching between document and selfie
      const faceMatch = await this.performFaceMatching(
        request.documentImages.front,
        request.documentImages.selfie
      );

      // Age calculation from extracted date of birth
      const ageValidation = this.validateAge(documentAnalysis.dateOfBirth);

      // Fraud detection
      const fraudCheck = await this.detectFraud(request, documentAnalysis);

      const result: AgeVerificationResult = {
        isValid: documentAnalysis.isValid && 
                faceMatch.isMatch && 
                ageValidation.isValid && 
                !fraudCheck.isSuspicious,
        age: ageValidation.age,
        verificationMethod: 'document_plus_biometric',
        documentType: request.documentType,
        confidence: Math.min(
          documentAnalysis.confidence,
          faceMatch.confidence,
          fraudCheck.confidence
        ),
        requiresManualReview: documentAnalysis.requiresManualReview ||
                            faceMatch.confidence < 0.8 ||
                            fraudCheck.isSuspicious ||
                            ageValidation.age < 21, // Extra scrutiny for 18-21
        errors: [
          ...documentAnalysis.errors,
          ...faceMatch.errors,
          ...ageValidation.errors,
          ...fraudCheck.errors
        ],
        metadata: {
          documentNumber: documentAnalysis.documentNumber,
          expiryDate: documentAnalysis.expiryDate,
          issueDate: documentAnalysis.issueDate,
          country: documentAnalysis.country || 'GB',
          verifiedAt: new Date()
        }
      };

      // Log verification attempt (for compliance and auditing)
      await this.logVerificationAttempt(request, result);

      return result;

    } catch (error) {
      console.error('Age verification error:', error);
      
      return {
        isValid: false,
        age: null,
        verificationMethod: 'failed',
        documentType: request.documentType,
        confidence: 0,
        requiresManualReview: true,
        errors: ['System error during verification'],
        metadata: {
          country: 'GB',
          verifiedAt: new Date()
        }
      };
    }
  }

  /**
   * Validate request before processing
   */
  private preValidateRequest(request: VerificationRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (!request.userId) errors.push('User ID is required');
    if (!request.documentImages.front) errors.push('Document front image is required');
    if (!request.documentImages.selfie) errors.push('Selfie is required');
    
    // Validate document type
    if (!['passport', 'driving_license', 'national_id'].includes(request.documentType)) {
      errors.push('Invalid document type');
    }

    // Check image format and size
    try {
      const frontImageSize = this.getBase64Size(request.documentImages.front);
      const selfieSize = this.getBase64Size(request.documentImages.selfie);
      
      if (frontImageSize > 10 * 1024 * 1024) errors.push('Document image too large'); // 10MB
      if (selfieSize > 5 * 1024 * 1024) errors.push('Selfie too large'); // 5MB
    } catch {
      errors.push('Invalid image format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Analyze document using AI/ML services
   */
  private async analyzeDocument(request: VerificationRequest): Promise<{
    isValid: boolean;
    confidence: number;
    dateOfBirth?: string;
    documentNumber?: string;
    expiryDate?: string;
    issueDate?: string;
    country?: string;
    requiresManualReview: boolean;
    errors: string[];
  }> {
    // This would integrate with services like Veriff, Onfido, or Jumio
    // For now, simulate the analysis
    
    // In production, this would:
    // 1. Extract text using OCR
    // 2. Validate document security features
    // 3. Check against known document templates
    // 4. Verify MRZ codes for passports
    // 5. Validate holograms and security features
    
    return {
      isValid: true, // Placeholder
      confidence: 0.95,
      dateOfBirth: '1990-01-01', // Extracted from document
      documentNumber: 'DOC123456789',
      expiryDate: '2030-01-01',
      issueDate: '2020-01-01',
      country: 'GB',
      requiresManualReview: false,
      errors: []
    };
  }

  /**
   * Face matching between document photo and selfie
   */
  private async performFaceMatching(documentImage: string, selfie: string): Promise<{
    isMatch: boolean;
    confidence: number;
    errors: string[];
  }> {
    // This would use services like AWS Rekognition, Azure Face API, or similar
    // For now, simulate the matching
    
    return {
      isMatch: true, // Placeholder
      confidence: 0.92,
      errors: []
    };
  }

  /**
   * Validate age from date of birth
   */
  private validateAge(dateOfBirth?: string): {
    isValid: boolean;
    age: number;
    errors: string[];
  } {
    if (!dateOfBirth) {
      return {
        isValid: false,
        age: 0,
        errors: ['Date of birth not found']
      };
    }

    try {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) 
        ? age - 1 
        : age;

      return {
        isValid: actualAge >= UK_AGE_REQUIREMENTS.minimumAge,
        age: actualAge,
        errors: actualAge < UK_AGE_REQUIREMENTS.minimumAge 
          ? [`User is ${actualAge}, minimum age is ${UK_AGE_REQUIREMENTS.minimumAge}`]
          : []
      };
    } catch {
      return {
        isValid: false,
        age: 0,
        errors: ['Invalid date of birth format']
      };
    }
  }

  /**
   * Fraud detection
   */
  private async detectFraud(request: VerificationRequest, documentAnalysis: Record<string, unknown>): Promise<{
    isSuspicious: boolean;
    confidence: number;
    errors: string[];
  }> {
    const suspiciousIndicators: string[] = [];
    
    // Check for common fraud patterns
    // 1. Multiple attempts from same device/IP
    // 2. Document quality issues
    // 3. Inconsistent metadata
    // 4. Known fraudulent document numbers
    
    // This would integrate with fraud detection services
    
    return {
      isSuspicious: false, // Placeholder
      confidence: 0.95,
      errors: suspiciousIndicators
    };
  }

  /**
   * Log verification attempt for compliance
   */
  private async logVerificationAttempt(
    request: VerificationRequest, 
    result: AgeVerificationResult
  ): Promise<void> {
    // Log to secure audit system
    // Required for GDPR compliance and potential legal requests
    
    const auditLog = {
      userId: request.userId,
      timestamp: new Date(),
      verificationResult: {
        isValid: result.isValid,
        confidence: result.confidence,
        requiresManualReview: result.requiresManualReview
      },
      userAgent: request.userAgent,
      ipAddress: this.hashIP(request.ipAddress), // Hash for privacy
      documentType: request.documentType,
      // Note: Document images are not logged for privacy
    };

    // In production, store in secure audit database
    console.log('Audit log (placeholder):', auditLog);
  }

  /**
   * Utility functions
   */
  private getBase64Size(base64String: string): number {
    return Math.ceil(base64String.length * 0.75);
  }

  private hashIP(ip: string): string {
    // Simple hash for privacy - in production use proper cryptographic hash
    return Buffer.from(ip).toString('base64');
  }
}

/**
 * Middleware to enforce age verification
 */
export function requireAgeVerification(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    // Check if user has completed age verification
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check verification status in database
    const isVerified = await checkUserAgeVerification();
    
    if (!isVerified) {
      return new Response(JSON.stringify({ 
        error: 'Age verification required',
        redirectTo: '/age-verification'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return handler(req);
  };
}

/**
 * Check user age verification status
 */
async function checkUserAgeVerification(): Promise<boolean> {
  // In production, check database for verification status
  // For now, placeholder
  return true;
}

/**
 * Regional compliance checker
 */
export function getRegionalRequirements(countryCode: string) {
  return EU_AGE_REQUIREMENTS[countryCode as keyof typeof EU_AGE_REQUIREMENTS] || UK_AGE_REQUIREMENTS;
}

/**
 * Export singleton instance
 */
export const ageVerificationService = AgeVerificationService.getInstance();
