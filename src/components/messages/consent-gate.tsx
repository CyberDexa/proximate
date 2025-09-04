'use client';

import { useState } from 'react';
import { AlertTriangle, Heart, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ConsentGateProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
  partnerName: string;
}

export function ConsentGate({ isOpen, onClose, onConsent, partnerName }: ConsentGateProps) {
  const [step, setStep] = useState<'request' | 'confirm' | 'education'>('request');
  const [hasConfirmed, setHasConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConsent = () => {
    if (!hasConfirmed) {
      setStep('education');
      return;
    }
    onConsent();
  };

  const renderRequestStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Heart className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Intimate Photo Sharing
        </h3>
        <p className="text-muted-foreground">
          Do you consent to receive intimate photos from <span className="font-medium text-foreground">{partnerName}</span>?
        </p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-600">
            <p className="font-medium mb-1">Important Consent Information:</p>
            <ul className="space-y-1 text-xs">
              <li>• You can revoke consent at any time</li>
              <li>• Photos are encrypted and auto-delete after 24 hours</li>
              <li>• Screenshots are monitored and violations reported</li>
              <li>• Sharing without consent is illegal and grounds for immediate ban</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 text-sm">
          <input
            type="checkbox"
            checked={hasConfirmed}
            onChange={(e) => setHasConfirmed(e.target.checked)}
            className="rounded border-border"
          />
          <span>I understand and consent to receiving intimate photos</span>
        </label>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button
            onClick={handleConsent}
            disabled={!hasConfirmed}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
          >
            <Check className="h-4 w-4 mr-2" />
            Give Consent
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEducationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Consent Education
        </h3>
        <p className="text-muted-foreground">
          Understanding digital consent and safety
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">✓ Enthusiastic Consent</h4>
          <p className="text-sm text-muted-foreground">
            Consent should be clear, voluntary, and ongoing. You can change your mind at any time.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">🔒 Privacy Protection</h4>
          <p className="text-sm text-muted-foreground">
            Photos are encrypted, watermarked, and automatically deleted. We monitor for screenshots.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">⚖️ Legal Protections</h4>
          <p className="text-sm text-muted-foreground">
            Non-consensual sharing is illegal. We work with law enforcement on violations.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">🚨 How to Revoke</h4>
          <p className="text-sm text-muted-foreground">
            Tap "Safety" → "Revoke Photo Consent" or simply say "I revoke consent" in chat.
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep('request')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            setHasConfirmed(true);
            setStep('request');
          }}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          I Understand
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-background border border-border">
        <div className="p-6">
          {step === 'request' && renderRequestStep()}
          {step === 'education' && renderEducationStep()}
        </div>
      </Card>
    </div>
  );
}
