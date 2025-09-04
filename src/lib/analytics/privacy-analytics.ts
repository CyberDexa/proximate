/**
 * Privacy-focused analytics for ProxiMeet
 * Uses Plausible Analytics for GDPR compliance
 */

export interface AnalyticsEvent {
  event?: string;
  name?: string;
  properties?: Record<string, unknown>;
  props?: Record<string, unknown>;
  url?: string;
}

export interface SafetyEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export interface UserEngagementEvent {
  type: 'match_created' | 'message_sent' | 'profile_viewed' | 'verification_completed' | 'premium_upgrade';
  userId?: string; // Hashed for privacy
  anonymized: boolean;
  metadata?: Record<string, any>;
}

/**
 * Privacy-focused analytics service
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private isEnabled: boolean;
  private domain: string;
  private apiEndpoint: string;

  private constructor() {
    this.isEnabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
    this.domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'proximeet.com';
    this.apiEndpoint = process.env.NEXT_PUBLIC_PLAUSIBLE_API || 'https://plausible.io/api/event';
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track privacy-compliant page views
   */
  trackPageView(url?: string): void {
    if (!this.isEnabled) return;

    try {
      // Use Plausible's automatic page view tracking
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('pageview', {
          u: url || window.location.href
        });
      }
    } catch (error) {
      console.warn('Analytics page view failed:', error);
    }
  }

  /**
   * Track custom events (anonymized)
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    try {
      if (typeof window !== 'undefined' && window.plausible && event.name) {
        window.plausible(event.name, {
          props: event.props,
          u: event.url || window.location.href
        });
      }
    } catch (error) {
      console.warn('Analytics event failed:', error);
    }
  }

  /**
   * Track safety-related events (critical for compliance)
   */
  trackSafetyEvent(event: SafetyEvent): void {
    try {
      // Always log safety events for audit trail
      const safetyLog = {
        type: event.type,
        severity: event.severity,
        timestamp: event.timestamp || new Date().toISOString(),
        userIdHash: event.userId ? this.hashUserId(event.userId) : null,
        metadata: this.sanitizeMetadata(event.metadata)
      };

      // Send to internal safety monitoring system
      this.sendToSafetyMonitoring(safetyLog);

      // Track anonymized event for analytics
      if (this.isEnabled) {
        this.trackEvent({
          name: 'safety_event',
          props: {
            type: event.type,
            severity: event.severity
          }
        });
      }
    } catch (error) {
      console.error('Safety event tracking failed:', error);
    }
  }

  /**
   * Track user engagement (anonymized)
   */
  trackUserEngagement(event: UserEngagementEvent): void {
    if (!this.isEnabled) return;

    try {
      const anonymizedEvent = {
        name: 'user_engagement',
        props: {
          type: event.type,
          anonymized: event.anonymized.toString()
        }
      };

      // Add non-PII metadata
      if (event.metadata) {
        const sanitizedMetadata = this.sanitizeMetadata(event.metadata);
        Object.assign(anonymizedEvent.props, sanitizedMetadata);
      }

      this.trackEvent(anonymizedEvent);
    } catch (error) {
      console.warn('User engagement tracking failed:', error);
    }
  }

  /**
   * Track premium/monetization events
   */
  trackPremiumEvent(eventType: 'subscription_started' | 'subscription_cancelled' | 'feature_used', tier?: string): void {
    if (!this.isEnabled) return;

    try {
      this.trackEvent({
        name: 'premium_event',
        props: {
          type: eventType,
          tier: tier || 'unknown'
        }
      });
    } catch (error) {
      console.warn('Premium event tracking failed:', error);
    }
  }

  /**
   * Track age verification events (critical for compliance)
   */
  trackAgeVerification(result: 'success' | 'failed' | 'pending', method: string): void {
    try {
      // Log for compliance audit
      const auditLog = {
        event: 'age_verification',
        result,
        method,
        timestamp: new Date().toISOString()
      };

      this.sendToComplianceAudit(auditLog);

      // Track anonymized analytics
      if (this.isEnabled) {
        this.trackEvent({
          name: 'age_verification',
          props: {
            result,
            method
          }
        });
      }
    } catch (error) {
      console.error('Age verification tracking failed:', error);
    }
  }

  /**
   * Track content moderation events
   */
  trackContentModeration(action: 'approved' | 'rejected' | 'flagged', contentType: string, reason?: string): void {
    try {
      // Internal moderation metrics
      const moderationLog = {
        action,
        contentType,
        reason,
        timestamp: new Date().toISOString()
      };

      this.sendToModerationMetrics(moderationLog);

      // Anonymized analytics
      if (this.isEnabled) {
        this.trackEvent({
          name: 'content_moderation',
          props: {
            action,
            content_type: contentType
          }
        });
      }
    } catch (error) {
      console.warn('Content moderation tracking failed:', error);
    }
  }

  /**
   * Utility functions
   */
  private hashUserId(userId: string): string {
    // Simple hash for privacy - in production use proper cryptographic hash
    return Buffer.from(userId).toString('base64').substring(0, 10);
  }

  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, string | number | boolean> {
    if (!metadata) return {};

    const sanitized: Record<string, string | number | boolean> = {};
    
    // Only include non-PII fields
    const allowedFields = [
      'feature_used',
      'duration_seconds',
      'success',
      'error_type',
      'verification_level',
      'content_type',
      'action_taken'
    ];

    for (const [key, value] of Object.entries(metadata)) {
      if (allowedFields.includes(key) && 
          (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private async sendToSafetyMonitoring(log: any): Promise<void> {
    try {
      // In production, send to internal safety monitoring system
      // This could be a webhook, database insert, or message queue
      console.log('Safety monitoring log:', log);
      
      // Example: send to internal API
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/internal/safety-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
      }
    } catch (error) {
      console.error('Failed to send to safety monitoring:', error);
    }
  }

  private async sendToComplianceAudit(log: any): Promise<void> {
    try {
      // In production, send to compliance audit system
      console.log('Compliance audit log:', log);
      
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/internal/compliance-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
      }
    } catch (error) {
      console.error('Failed to send to compliance audit:', error);
    }
  }

  private async sendToModerationMetrics(log: any): Promise<void> {
    try {
      // In production, send to moderation metrics system
      console.log('Moderation metrics log:', log);
      
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/internal/moderation-metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
      }
    } catch (error) {
      console.error('Failed to send to moderation metrics:', error);
    }
  }
}

/**
 * Error tracking service (Sentry integration)
 */
export class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  /**
   * Track application errors
   */
  trackError(error: Error, context?: Record<string, any>): void {
    if (!this.isEnabled) {
      console.error('Error:', error, context);
      return;
    }

    try {
      // In production, integrate with Sentry
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.withContext(context || {}, () => {
          window.Sentry?.captureException(error);
        });
      }
    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError);
      console.error('Original error:', error);
    }
  }

  /**
   * Track safety system errors (critical)
   */
  trackSafetyError(error: Error, safetyContext: {
    feature: string;
    userId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): void {
    try {
      // Always log safety errors
      const safetyErrorLog = {
        error: error.message,
        stack: error.stack,
        feature: safetyContext.feature,
        severity: safetyContext.severity,
        userIdHash: safetyContext.userId ? this.hashUserId(safetyContext.userId) : null,
        timestamp: new Date().toISOString()
      };

      // Send to internal safety monitoring
      this.sendToSafetyAlert(safetyErrorLog);

      // Track in external error service
      this.trackError(error, {
        safety_feature: safetyContext.feature,
        severity: safetyContext.severity
      });
    } catch (trackingError) {
      console.error('Safety error tracking failed:', trackingError);
      console.error('Original safety error:', error);
    }
  }

  private hashUserId(userId: string): string {
    return Buffer.from(userId).toString('base64').substring(0, 10);
  }

  private async sendToSafetyAlert(log: any): Promise<void> {
    try {
      console.log('Safety error alert:', log);
      
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/internal/safety-alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
      }
    } catch (error) {
      console.error('Failed to send safety alert:', error);
    }
  }
}

/**
 * Performance monitoring service
 */
export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;

  private constructor() {}

  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  /**
   * Track page load performance
   */
  trackPageLoad(pageName: string): void {
    if (typeof window === 'undefined') return;

    try {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          page: pageName,
          load_time: navigation.loadEventEnd - navigation.loadEventStart,
          dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          first_byte: navigation.responseStart - navigation.requestStart,
          dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp_connect: navigation.connectEnd - navigation.connectStart
        };

        analytics.trackEvent({
          name: 'page_performance',
          props: metrics
        });
      }
    } catch (error) {
      console.warn('Performance tracking failed:', error);
    }
  }

  /**
   * Track API response times
   */
  trackAPICall(endpoint: string, duration: number, status: number): void {
    try {
      analytics.trackEvent({
        name: 'api_performance',
        props: {
          endpoint,
          duration,
          status,
          success: status < 400
        }
      });
    } catch (error) {
      console.warn('API performance tracking failed:', error);
    }
  }
}

// Global instances
export const analytics = AnalyticsService.getInstance();
export const errorTracking = ErrorTrackingService.getInstance();
export const performance = PerformanceMonitoringService.getInstance();

// Extend window type for TypeScript
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any>; u?: string }) => void;
    Sentry?: {
      captureException: (error: Error) => void;
      withContext: (context: Record<string, any>, callback: () => void) => void;
    };
  }
}
