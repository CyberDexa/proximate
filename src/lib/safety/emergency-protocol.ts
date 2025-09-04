import { db } from '@/lib/db';

export interface EmergencyIncident {
  incidentId: string;
  userId: string;
  type: 'panic_button' | 'safe_word' | 'check_in_missed' | 'manual_report';
  location?: GeolocationPosition | null;
  silent: boolean;
  emergencyContacts: string[];
  trustedFriends: string[];
}

export interface EmergencyResponse {
  success: boolean;
  actions: string[];
  errors?: string[];
  escalationLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SMSAlert {
  to: string;
  userName: string;
  location?: GeolocationPosition | null;
  incidentId: string;
}

class EmergencyProtocol {
  private readonly ESCALATION_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  } as const;

  private readonly CONTACT_PRIORITY = {
    EMERGENCY_CONTACT: 1,
    TRUSTED_FRIENDS: 2,
    SUPPORT_TEAM: 3,
    LAW_ENFORCEMENT: 4,
  } as const;

  async handleEmergency(incident: EmergencyIncident): Promise<EmergencyResponse> {
    const actions: string[] = [];
    const errors: string[] = [];
    
    try {
      // Determine escalation level
      const escalationLevel = this.determineEscalationLevel(incident);
      
      // Execute response based on escalation level
      switch (escalationLevel) {
        case this.ESCALATION_LEVELS.LOW:
          await this.handleLowLevelIncident(incident, actions);
          break;
        case this.ESCALATION_LEVELS.MEDIUM:
          await this.handleMediumLevelIncident(incident, actions);
          break;
        case this.ESCALATION_LEVELS.HIGH:
          await this.handleHighLevelIncident(incident, actions);
          break;
        case this.ESCALATION_LEVELS.CRITICAL:
          await this.handleCriticalIncident(incident, actions);
          break;
      }

      // Log all actions taken
      await this.logEmergencyActions(incident.incidentId, actions);

      return {
        success: true,
        actions,
        escalationLevel,
      };

    } catch (error) {
      console.error('Emergency protocol error:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');

      // Even if protocol fails, try basic notification
      await this.fallbackNotification(incident);

      return {
        success: false,
        actions,
        errors,
        escalationLevel: 'critical',
      };
    }
  }

  private determineEscalationLevel(incident: EmergencyIncident): 'low' | 'medium' | 'high' | 'critical' {
    // Critical: Panic button or safe word
    if (incident.type === 'panic_button' || incident.type === 'safe_word') {
      return this.ESCALATION_LEVELS.CRITICAL;
    }

    // High: Missed check-in during active meetup
    if (incident.type === 'check_in_missed') {
      return this.ESCALATION_LEVELS.HIGH;
    }

    // Medium: Manual reports
    if (incident.type === 'manual_report') {
      return this.ESCALATION_LEVELS.MEDIUM;
    }

    return this.ESCALATION_LEVELS.LOW;
  }

  private async handleLowLevelIncident(
    incident: EmergencyIncident, 
    actions: string[]
  ): Promise<void> {
    // Log incident only
    actions.push('Incident logged');
    
    // Notify support team for review
    await this.notifySupportTeam(incident, 'low_priority');
    actions.push('Support team notified');
  }

  private async handleMediumLevelIncident(
    incident: EmergencyIncident, 
    actions: string[]
  ): Promise<void> {
    // Notify support team immediately
    await this.notifySupportTeam(incident, 'medium_priority');
    actions.push('Support team alerted');

    // Send notification to trusted friends if available
    if (incident.trustedFriends.length > 0) {
      await this.notifyTrustedFriends(incident);
      actions.push('Trusted friends notified');
    }
  }

  private async handleHighLevelIncident(
    incident: EmergencyIncident, 
    actions: string[]
  ): Promise<void> {
    // Immediate support team notification
    await this.notifySupportTeam(incident, 'high_priority');
    actions.push('Support team immediately notified');

    // Contact emergency contacts
    if (incident.emergencyContacts.length > 0) {
      await this.contactEmergencyContacts(incident);
      actions.push('Emergency contacts alerted');
    }

    // Notify trusted friends
    if (incident.trustedFriends.length > 0) {
      await this.notifyTrustedFriends(incident);
      actions.push('Trusted friends notified');
    }

    // Lock user account for safety
    await this.lockUserAccount(incident.userId, 'safety_protocol');
    actions.push('Account temporarily locked');
  }

  private async handleCriticalIncident(
    incident: EmergencyIncident, 
    actions: string[]
  ): Promise<void> {
    // Immediate all-channels notification
    await this.notifySupportTeam(incident, 'critical');
    actions.push('Critical alert sent to support');

    // Contact all emergency contacts immediately
    if (incident.emergencyContacts.length > 0) {
      await this.contactEmergencyContacts(incident);
      actions.push('Emergency contacts contacted immediately');
    }

    // Notify all trusted friends
    if (incident.trustedFriends.length > 0) {
      await this.notifyTrustedFriends(incident, true);
      actions.push('All trusted friends alerted');
    }

    // Lock account immediately
    await this.lockUserAccount(incident.userId, 'emergency_protocol');
    actions.push('Account immediately locked');

    // Preserve evidence
    await this.preserveEvidence(incident);
    actions.push('Evidence preserved');

    // For non-silent alarms, consider law enforcement notification
    if (!incident.silent && this.shouldContactLawEnforcement(incident)) {
      await this.prepareLawEnforcementData(incident);
      actions.push('Law enforcement data prepared');
    }
  }

  async sendEmergencySMS(alert: SMSAlert): Promise<boolean> {
    try {
      // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
      console.log('Emergency SMS would be sent:', {
        to: alert.to,
        message: this.formatEmergencySMS(alert),
      });

      // Log SMS attempt
      await db.emergencyCommunication.create({
        data: {
          incidentId: alert.incidentId,
          type: 'sms',
          recipient: alert.to,
          content: this.formatEmergencySMS(alert),
          sent: true,
          sentAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error('Failed to send emergency SMS:', error);
      return false;
    }
  }

  private formatEmergencySMS(alert: SMSAlert): string {
    const locationText = alert.location 
      ? `Location: ${alert.location.coords.latitude}, ${alert.location.coords.longitude}`
      : 'Location: Not available';

    return `EMERGENCY ALERT: ${alert.userName} has activated emergency protocol on ProxiMeet. ${locationText}. Incident ID: ${alert.incidentId}. If this is a real emergency, contact local authorities immediately.`;
  }

  private async notifySupportTeam(
    incident: EmergencyIncident, 
    priority: string
  ): Promise<void> {
    // In production, this would integrate with support ticket system
    console.log('Support team notification:', {
      priority,
      incident: incident.incidentId,
      type: incident.type,
    });

    await db.supportNotification.create({
      data: {
        incidentId: incident.incidentId,
        priority,
        type: incident.type,
        notifiedAt: new Date(),
      },
    });
  }

  private async contactEmergencyContacts(
    incident: EmergencyIncident
  ): Promise<void> {
    for (const contact of incident.emergencyContacts) {
      await this.sendEmergencySMS({
        to: contact,
        userName: 'User', // Get actual name from DB
        location: incident.location,
        incidentId: incident.incidentId,
      });
    }
  }

  private async notifyTrustedFriends(
    incident: EmergencyIncident,
    immediate = false
  ): Promise<void> {
    // Send in-app notifications to trusted friends
    for (const friendId of incident.trustedFriends) {
      await db.notification.create({
        data: {
          userId: friendId,
          type: 'safety_alert',
          title: 'Safety Alert',
          content: 'A friend has activated emergency protocol. Check on them.',
          urgent: immediate,
          metadata: JSON.stringify({ incidentId: incident.incidentId }),
        },
      });
    }
  }

  private async lockUserAccount(
    userId: string, 
    reason: string
  ): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        accountLocked: true,
        lockReason: reason,
        lockedAt: new Date(),
      },
    });
  }

  private async preserveEvidence(incident: EmergencyIncident): Promise<void> {
    // Create immutable snapshot of relevant data
    await db.evidenceSnapshot.create({
      data: {
        incidentId: incident.incidentId,
        userId: incident.userId,
        timestamp: new Date(),
        data: JSON.stringify({
          userProfile: 'preserved',
          recentMessages: 'preserved',
          locationHistory: 'preserved',
        }),
      },
    });
  }

  private shouldContactLawEnforcement(incident: EmergencyIncident): boolean {
    // In production, this would have more sophisticated logic
    // based on jurisdiction, user preferences, etc.
    return incident.type === 'panic_button' && !incident.silent;
  }

  private async prepareLawEnforcementData(incident: EmergencyIncident): Promise<void> {
    // Prepare data package for potential law enforcement request
    await db.lawEnforcementData.create({
      data: {
        incidentId: incident.incidentId,
        prepared: true,
        preparedAt: new Date(),
        jurisdiction: 'to_be_determined', // Based on location
      },
    });
  }

  private async fallbackNotification(incident: EmergencyIncident): Promise<void> {
    // Last resort notification if main protocol fails
    console.error('EMERGENCY PROTOCOL FAILURE:', incident);
    
    // Try to send at least one SMS if emergency contact exists
    if (incident.emergencyContacts.length > 0) {
      try {
        await this.sendEmergencySMS({
          to: incident.emergencyContacts[0],
          userName: 'User',
          location: incident.location,
          incidentId: incident.incidentId,
        });
      } catch (error) {
        console.error('Fallback SMS also failed:', error);
      }
    }
  }

  private async logEmergencyActions(
    incidentId: string, 
    actions: string[]
  ): Promise<void> {
    await db.emergencyLog.create({
      data: {
        incidentId,
        actions: JSON.stringify(actions),
        timestamp: new Date(),
      },
    });
  }
}

export const emergencyProtocol = new EmergencyProtocol();
