'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, Phone, MapPin, UserX, Flag, Clock, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface SafetyToolsProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  partnerName: string;
}

export function SafetyTools({ isOpen, onClose, matchId, partnerName }: SafetyToolsProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [locationShared, setLocationShared] = useState(false);
  const [panicActivated, setPanicActivated] = useState(false);
  const [reportReason, setReportReason] = useState('');

  if (!isOpen) return null;

  const handlePanicButton = () => {
    setPanicActivated(true);
    // TODO: Trigger emergency protocol
    // - Alert emergency contacts
    // - Log incident
    // - Provide immediate help options
  };

  const handleFakeCall = () => {
    // TODO: Generate fake incoming call
    setActiveFeature('fake-call');
  };

  const handleLocationShare = () => {
    if (!locationShared) {
      // TODO: Share location with trusted contact
      setLocationShared(true);
      setActiveFeature('location-shared');
    }
  };

  const handleBlock = () => {
    // TODO: Block user and end conversation
    setActiveFeature('blocked');
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      // TODO: Submit report to safety team
      setActiveFeature('reported');
    }
  };

  const renderMainMenu = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Safety Tools
        </h3>
        <p className="text-muted-foreground text-sm">
          Your safety is our priority. Use these tools anytime you feel uncomfortable.
        </p>
      </div>

      {/* Emergency Panic Button */}
      <Card className="p-4 border-red-500/20 bg-red-500/5">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h4 className="font-semibold text-red-500">Emergency Panic Button</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Hold for 3 seconds to activate emergency protocol
          </p>
          <Button
            onMouseDown={() => {
              // TODO: Start 3-second timer
            }}
            onMouseUp={() => {
              // TODO: Cancel timer if released early
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3"
          >
            🚨 PANIC BUTTON
          </Button>
        </div>
      </Card>

      {/* Safety Tools Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleFakeCall}
          className="flex flex-col items-center space-y-2 h-20 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
        >
          <PhoneCall className="h-5 w-5" />
          <span className="text-xs">Fake Call</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleLocationShare}
          className="flex flex-col items-center space-y-2 h-20 text-blue-500 border-blue-500/20 hover:bg-blue-500/10"
        >
          <MapPin className="h-5 w-5" />
          <span className="text-xs">Share Location</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setActiveFeature('report')}
          className="flex flex-col items-center space-y-2 h-20 text-orange-500 border-orange-500/20 hover:bg-orange-500/10"
        >
          <Flag className="h-5 w-5" />
          <span className="text-xs">Report User</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleBlock}
          className="flex flex-col items-center space-y-2 h-20 text-red-500 border-red-500/20 hover:bg-red-500/10"
        >
          <UserX className="h-5 w-5" />
          <span className="text-xs">Block User</span>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Quick Safety Actions</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <span>Emergency Contact</span>
            <Badge variant={emergencyContact ? 'default' : 'secondary'}>
              {emergencyContact ? 'Set' : 'Not Set'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <span>Location Sharing</span>
            <Badge variant={locationShared ? 'default' : 'secondary'}>
              {locationShared ? 'Active' : 'Off'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <span>Check-in Timer</span>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              30 min
            </Badge>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onClose}
        className="w-full"
      >
        Close
      </Button>
    </div>
  );

  const renderReportForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Flag className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Report {partnerName}
        </h3>
        <p className="text-muted-foreground text-sm">
          Help us keep ProxiMeet safe by reporting inappropriate behavior.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">What happened?</h4>
        
        <div className="grid grid-cols-1 gap-2">
          {[
            'Inappropriate messages',
            'Harassment or abuse',
            'Non-consensual behavior',
            'Fake profile/catfishing',
            'Spam or scam',
            'Threatening behavior',
            'Other safety concern'
          ].map((reason) => (
            <Button
              key={reason}
              variant={reportReason === reason ? 'default' : 'outline'}
              onClick={() => setReportReason(reason)}
              className="justify-start text-left"
            >
              {reason}
            </Button>
          ))}
        </div>

        {reportReason && (
          <div className="space-y-3">
            <Input
              placeholder="Additional details (optional)"
              className="w-full"
            />
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <p className="text-sm text-amber-600">
                Reports are reviewed by our safety team within 2 hours. 
                For immediate danger, use the panic button above.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setActiveFeature(null)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleReport}
          disabled={!reportReason}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          Submit Report
        </Button>
      </div>
    </div>
  );

  const renderPanicActivated = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-red-500 mb-2">
          Emergency Protocol Activated
        </h3>
        <p className="text-muted-foreground">
          Your emergency contacts have been notified. Help is on the way.
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h4 className="font-medium text-red-500 mb-2">Immediate Actions Taken:</h4>
          <ul className="text-sm text-red-400 space-y-1">
            <li>✓ Emergency contacts alerted</li>
            <li>✓ Location shared with trusted friend</li>
            <li>✓ Incident logged with timestamp</li>
            <li>✓ Safety team notified</li>
          </ul>
        </div>

        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          <Phone className="h-4 w-4 mr-2" />
          Call Emergency Services
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-background border border-border max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {panicActivated && renderPanicActivated()}
          {!panicActivated && activeFeature === 'report' && renderReportForm()}
          {!panicActivated && !activeFeature && renderMainMenu()}
        </div>
      </Card>
    </div>
  );
}
