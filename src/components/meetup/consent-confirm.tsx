'use client';

import { useState } from 'react';
import { Heart, CheckCircle, Clock, Shield, AlertTriangle, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConsentItem {
  id: string;
  text: string;
  required: boolean;
  confirmed: boolean;
}

interface ConsentConfirmProps {
  matchId: string;
  partnerName: string;
  meetupLocation: string;
  meetupTime: Date;
  onConsentComplete: (consentData: any) => void;
  onCancel: () => void;
}

export function ConsentConfirm({ 
  matchId, 
  partnerName, 
  meetupLocation, 
  meetupTime, 
  onConsentComplete,
  onCancel 
}: ConsentConfirmProps) {
  const [step, setStep] = useState<'intro' | 'checklist' | 'complete'>('intro');
  const [consentItems, setConsentItems] = useState<ConsentItem[]>([
    {
      id: 'enthusiastic',
      text: 'I am enthusiastically consenting to this meetup',
      required: true,
      confirmed: false
    },
    {
      id: 'boundaries',
      text: 'We have discussed boundaries and expectations',
      required: true,
      confirmed: false
    },
    {
      id: 'safety',
      text: 'I have safety measures in place (trusted friend knows location)',
      required: true,
      confirmed: false
    },
    {
      id: 'protection',
      text: 'Protection/contraception is available if needed',
      required: false,
      confirmed: false
    },
    {
      id: 'communication',
      text: 'I understand I can change my mind at any time',
      required: true,
      confirmed: false
    },
    {
      id: 'respect',
      text: 'I will respect my partner\'s boundaries and consent',
      required: true,
      confirmed: false
    },
    {
      id: 'no_pressure',
      text: 'I am not feeling pressured or coerced',
      required: true,
      confirmed: false
    }
  ]);

  const [partnerConsented, setPartnerConsented] = useState(false); // Mock - would come from API
  const [timestampCreated, setTimestampCreated] = useState<Date | null>(null);

  const toggleConsentItem = (id: string) => {
    setConsentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, confirmed: !item.confirmed } : item
      )
    );
  };

  const allRequiredConfirmed = consentItems
    .filter(item => item.required)
    .every(item => item.confirmed);

  const submitConsent = () => {
    const timestamp = new Date();
    setTimestampCreated(timestamp);
    
    const consentData = {
      matchId,
      partnerName,
      meetupLocation,
      meetupTime,
      consentItems: consentItems.filter(item => item.confirmed),
      timestamp,
      ipAddress: 'xxx.xxx.xxx.xxx', // Would be captured on backend
      requiresBothParties: true
    };

    // TODO: Submit to API for legal record
    onConsentComplete(consentData);
    setStep('complete');
  };

  const renderIntroStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Consent Confirmation
        </h3>
        <p className="text-muted-foreground text-sm">
          Before meeting {partnerName}, let's confirm mutual consent and safety
        </p>
      </div>

      {/* Meetup Summary */}
      <Card className="p-4 bg-card border border-border">
        <h4 className="font-medium text-foreground mb-3">Meetup Details</h4>
        <div className="space-y-2 text-sm">
          <div><strong>With:</strong> {partnerName}</div>
          <div><strong>Location:</strong> {meetupLocation}</div>
          <div><strong>Time:</strong> {meetupTime.toLocaleString()}</div>
        </div>
      </Card>

      {/* Consent Education */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Handshake className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-emerald-600">
            <p className="font-medium mb-2">What is Enthusiastic Consent?</p>
            <ul className="space-y-1 text-xs">
              <li>• Clear, voluntary agreement to engage in sexual activity</li>
              <li>• Can be revoked at any time, even during the encounter</li>
              <li>• Must be ongoing - consent to one act doesn't mean consent to all</li>
              <li>• Cannot be given under influence of drugs, alcohol, or coercion</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel Meetup
        </Button>
        <Button
          onClick={() => setStep('checklist')}
          className="flex-1 bg-pink-500 hover:bg-pink-600"
        >
          Continue to Consent
        </Button>
      </div>
    </div>
  );

  const renderChecklistStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Consent Checklist
        </h3>
        <p className="text-muted-foreground text-sm">
          Please confirm each item before proceeding
        </p>
      </div>

      {/* Partner Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground">{partnerName}'s Status</h4>
            <p className="text-sm text-muted-foreground">
              {partnerConsented ? 'Has completed consent checklist' : 'Waiting for consent confirmation'}
            </p>
          </div>
          <Badge variant={partnerConsented ? 'default' : 'secondary'}>
            {partnerConsented ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Consented
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </>
            )}
          </Badge>
        </div>
      </Card>

      {/* Consent Items */}
      <div className="space-y-3">
        {consentItems.map((item) => (
          <Card 
            key={item.id} 
            className={`p-4 cursor-pointer transition-colors ${
              item.confirmed ? 'bg-emerald-500/5 border-emerald-500/20' : 'hover:bg-card/80'
            }`}
            onClick={() => toggleConsentItem(item.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                item.confirmed 
                  ? 'bg-emerald-500 border-emerald-500' 
                  : 'border-gray-300'
              }`}>
                {item.confirmed && <CheckCircle className="h-3 w-3 text-white" />}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm ${item.confirmed ? 'text-emerald-600' : 'text-foreground'}`}>
                  {item.text}
                </p>
                {item.required && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Required
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Legal Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-600">
            <p className="font-medium mb-1">Legal Protection:</p>
            <p className="text-xs">This consent record is timestamped and legally binding. Both parties must confirm consent. Non-consensual activity is illegal and will be reported to authorities.</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep('intro')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={submitConsent}
          disabled={!allRequiredConfirmed}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600"
        >
          <Shield className="h-4 w-4 mr-2" />
          Confirm Consent
        </Button>
      </div>

      {!allRequiredConfirmed && (
        <p className="text-center text-sm text-muted-foreground">
          Please confirm all required items to proceed
        </p>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-emerald-500 mb-2">
          Consent Confirmed
        </h3>
        <p className="text-muted-foreground text-sm">
          Your consent has been recorded with legal timestamp
        </p>
      </div>

      {/* Consent Record */}
      <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
        <h4 className="font-medium text-emerald-600 mb-3">Consent Record</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Recorded:</span>
            <span className="text-emerald-600">
              {timestampCreated?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Match ID:</span>
            <span className="text-emerald-600 font-mono text-xs">
              {matchId.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span>Items Confirmed:</span>
            <span className="text-emerald-600">
              {consentItems.filter(item => item.confirmed).length}/{consentItems.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Both Parties:</span>
            <Badge variant={partnerConsented ? 'default' : 'secondary'}>
              {partnerConsented ? 'Both Confirmed' : 'Waiting for Partner'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Important Reminders */}
      <div className="space-y-3">
        <Card className="p-3 bg-blue-500/5 border-blue-500/20">
          <p className="text-sm text-blue-600">
            <strong>Remember:</strong> Consent can be revoked at any time. 
            If you feel uncomfortable, you can leave immediately.
          </p>
        </Card>

        <Card className="p-3 bg-purple-500/5 border-purple-500/20">
          <p className="text-sm text-purple-600">
            <strong>Safety First:</strong> Your safety tools remain active. 
            The panic button and check-in timer are ready if needed.
          </p>
        </Card>
      </div>

      <Button
        onClick={() => {
          // TODO: Navigate to active meetup screen
          onConsentComplete({
            confirmed: true,
            timestamp: timestampCreated,
            bothPartiesConfirmed: partnerConsented
          });
        }}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Proceed to Meetup
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {step === 'intro' && renderIntroStep()}
      {step === 'checklist' && renderChecklistStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
}
