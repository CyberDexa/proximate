'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Video, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Clock
} from 'lucide-react';

interface PreMeetChecklistProps {
  matchId: string;
  partnerName: string;
  onComplete: (checklist: PreMeetChecklist) => void;
  onCancel: () => void;
}

interface PreMeetChecklist {
  videoVerifyCompleted: boolean;
  locationShared: boolean;
  publicMeetingSpot: boolean;
  boundariesDiscussed: boolean;
  emergencyContactNotified: boolean;
  consentConfirmed: boolean;
}

export function PreMeetChecklist({ 
  matchId, 
  partnerName, 
  onComplete, 
  onCancel 
}: PreMeetChecklistProps) {
  const [checklist, setChecklist] = useState<PreMeetChecklist>({
    videoVerifyCompleted: false,
    locationShared: false,
    publicMeetingSpot: false,
    boundariesDiscussed: false,
    emergencyContactNotified: false,
    consentConfirmed: false
  });

  const [bothPartnersReady, setBothPartnersReady] = useState(false);

  const requiredItems = [
    'publicMeetingSpot',
    'boundariesDiscussed',
    'consentConfirmed'
  ] as const;

  const optionalItems = [
    'videoVerifyCompleted',
    'locationShared',
    'emergencyContactNotified'
  ] as const;

  const allRequiredCompleted = requiredItems.every(item => checklist[item]);
  const canProceed = allRequiredCompleted && bothPartnersReady;

  const updateChecklist = (key: keyof PreMeetChecklist, value: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: value }));
  };

  const handleVideoVerify = () => {
    // In real implementation, start video call
    updateChecklist('videoVerifyCompleted', true);
  };

  const handleShareLocation = () => {
    // In real implementation, share live location
    updateChecklist('locationShared', true);
  };

  const checklistItems = [
    {
      key: 'videoVerifyCompleted' as const,
      title: 'Video Verification',
      description: 'Quick 30-second video call to verify identity',
      icon: Video,
      required: false,
      action: handleVideoVerify,
      actionText: 'Start Video Call'
    },
    {
      key: 'locationShared' as const,
      title: 'Share Live Location',
      description: 'Share your location with a trusted friend',
      icon: MapPin,
      required: false,
      action: handleShareLocation,
      actionText: 'Share Location'
    },
    {
      key: 'publicMeetingSpot' as const,
      title: 'Public Meeting Spot Agreed',
      description: 'Both parties agreed to meet in a public location first',
      icon: Users,
      required: true,
      checked: checklist.publicMeetingSpot
    },
    {
      key: 'boundariesDiscussed' as const,
      title: 'Boundaries Discussed',
      description: 'Clear communication about expectations and limits',
      icon: Shield,
      required: true,
      checked: checklist.boundariesDiscussed
    },
    {
      key: 'emergencyContactNotified' as const,
      title: 'Emergency Contact Notified',
      description: 'Someone knows where you\'re going and when',
      icon: AlertTriangle,
      required: false,
      checked: checklist.emergencyContactNotified
    },
    {
      key: 'consentConfirmed' as const,
      title: 'Enthusiastic Consent',
      description: 'Both parties are excited and willing participants',
      icon: CheckCircle2,
      required: true,
      checked: checklist.consentConfirmed
    }
  ];

  return (
    <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-dark-surface border-dark-border max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Pre-Meet Safety Checklist
            </h2>
            <p className="text-dark-muted">
              Complete this checklist before meeting with {partnerName}
            </p>
          </div>

          {/* Partner Status */}
          <div className="bg-dark-bg/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">
                  {partnerName}'s Status
                </p>
                <p className="text-sm text-dark-muted">
                  {bothPartnersReady ? 'Ready to meet' : 'Completing checklist...'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {bothPartnersReady ? (
                  <Badge className="bg-success/20 text-success border-success/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-warning/30 text-warning">
                    <Clock className="w-3 h-3 mr-1" />
                    Waiting
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4 mb-6">
            {checklistItems.map((item) => (
              <div 
                key={item.key}
                className="bg-dark-bg/30 rounded-lg p-4 border border-dark-border"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {item.action ? (
                      <div className="w-6 h-6 rounded border-2 border-primary-blue bg-dark-surface flex items-center justify-center">
                        {checklist[item.key] && (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        )}
                      </div>
                    ) : (
                      <Checkbox
                        checked={checklist[item.key]}
                        onCheckedChange={(checked) => 
                          updateChecklist(item.key, checked as boolean)
                        }
                        className="mt-0.5"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-4 h-4 text-primary-blue" />
                      <h3 className="font-medium text-white">
                        {item.title}
                        {item.required && (
                          <span className="text-danger ml-1">*</span>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-dark-muted mb-2">
                      {item.description}
                    </p>

                    {item.action && !checklist[item.key] && (
                      <Button
                        size="sm"
                        onClick={item.action}
                        className="bg-primary-blue hover:bg-primary-blue/90"
                      >
                        {item.actionText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="bg-dark-bg/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                Safety Checklist Progress
              </span>
              <span className="text-sm text-dark-muted">
                {requiredItems.filter(item => checklist[item]).length}/{requiredItems.length} required
              </span>
            </div>
            <div className="w-full bg-dark-border rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(requiredItems.filter(item => checklist[item]).length / requiredItems.length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel Meetup
            </Button>
            
            <Button
              onClick={() => onComplete(checklist)}
              disabled={!canProceed}
              className="flex-1 bg-success hover:bg-success/90 disabled:bg-dark-border disabled:text-dark-muted"
            >
              {canProceed ? 'Enable Meetup Mode' : 'Complete Required Items'}
            </Button>
          </div>

          {!allRequiredCompleted && (
            <p className="text-xs text-danger text-center mt-2">
              * Required items must be completed by both parties
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
