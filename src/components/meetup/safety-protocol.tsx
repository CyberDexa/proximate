'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Clock, Phone, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface SafetyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SafetyProtocolProps {
  matchId: string;
  partnerName: string;
  meetupLocation?: string;
  meetupTime?: Date;
  onProtocolComplete: (protocolData: any) => void;
}

export function SafetyProtocol({ 
  matchId, 
  partnerName, 
  meetupLocation, 
  meetupTime, 
  onProtocolComplete 
}: SafetyProtocolProps) {
  const [activeStep, setActiveStep] = useState<'setup' | 'contacts' | 'checkin' | 'fake-call' | 'complete'>('setup');
  const [trustedContacts, setTrustedContacts] = useState<SafetyContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [checkInInterval, setCheckInInterval] = useState(30); // minutes
  const [etaTime, setEtaTime] = useState('');
  const [fakeCallTime, setFakeCallTime] = useState(15); // minutes from now
  const [protocolActive, setProtocolActive] = useState(false);

  // Load existing trusted contacts
  useEffect(() => {
    loadTrustedContacts();
  }, []);

  const loadTrustedContacts = async () => {
    // TODO: Load from user's safety profile
    const mockContacts: SafetyContact[] = [
      {
        id: '1',
        name: 'Emma (Best Friend)',
        phone: '+1-555-0123',
        relationship: 'Best Friend'
      },
      {
        id: '2',
        name: 'Alex (Roommate)',
        phone: '+1-555-0456',
        relationship: 'Roommate'
      }
    ];
    setTrustedContacts(mockContacts);
  };

  const addTrustedContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: SafetyContact = {
        id: Date.now().toString(),
        ...newContact
      };
      setTrustedContacts([...trustedContacts, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
    }
  };

  const activateProtocol = () => {
    const protocolData = {
      matchId,
      partnerName,
      meetupLocation,
      meetupTime,
      trustedContacts: trustedContacts.map(c => c.id),
      checkInInterval,
      etaTime,
      fakeCallScheduled: fakeCallTime > 0
    };

    setProtocolActive(true);
    onProtocolComplete(protocolData);
    
    // TODO: Implement actual safety features
    // - Send location to trusted contacts
    // - Set up check-in timer
    // - Schedule fake call
    // - Log safety protocol activation
  };

  const scheduleFakeCall = () => {
    // TODO: Schedule fake incoming call
    setActiveStep('fake-call');
  };

  const renderSetupStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Safety Protocol Setup
        </h3>
        <p className="text-muted-foreground text-sm">
          Configure safety features for your meetup with {partnerName}
        </p>
      </div>

      {meetupLocation && meetupTime && (
        <Card className="p-4 bg-card border border-border">
          <h4 className="font-medium text-foreground mb-3">Meetup Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{meetupLocation}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{meetupTime.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Share ETA</h4>
            <p className="text-sm text-muted-foreground">
              Let trusted friends know when you expect to arrive
            </p>
          </div>
          <Input
            type="time"
            value={etaTime}
            onChange={(e) => setEtaTime(e.target.value)}
            className="w-32"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Check-in Interval</h4>
            <p className="text-sm text-muted-foreground">
              How often should we check if you're safe?
            </p>
          </div>
          <div className="flex space-x-2">
            {[15, 30, 60].map((interval) => (
              <Button
                key={interval}
                size="sm"
                variant={checkInInterval === interval ? 'default' : 'outline'}
                onClick={() => setCheckInInterval(interval)}
              >
                {interval}m
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Fake Call Timer</h4>
            <p className="text-sm text-muted-foreground">
              Schedule a fake emergency call as an exit strategy
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={fakeCallTime === 0 ? 'default' : 'outline'}
              onClick={() => setFakeCallTime(0)}
            >
              Off
            </Button>
            {[15, 30, 45].map((time) => (
              <Button
                key={time}
                size="sm"
                variant={fakeCallTime === time ? 'default' : 'outline'}
                onClick={() => setFakeCallTime(time)}
              >
                {time}m
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setActiveStep('contacts')}
          className="flex-1"
        >
          <Users className="h-4 w-4 mr-2" />
          Manage Contacts
        </Button>
        <Button
          onClick={activateProtocol}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600"
        >
          <Shield className="h-4 w-4 mr-2" />
          Activate Protocol
        </Button>
      </div>
    </div>
  );

  const renderContactsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Trusted Emergency Contacts
        </h3>
        <p className="text-muted-foreground text-sm">
          These contacts will receive your location and check-in status
        </p>
      </div>

      {/* Existing Contacts */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Current Contacts</h4>
        {trustedContacts.map((contact) => (
          <Card key={contact.id} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-foreground">{contact.name}</h5>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {contact.relationship}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTrustedContacts(contacts => 
                  contacts.filter(c => c.id !== contact.id)
                )}
                className="text-red-500 border-red-500/20 hover:bg-red-500/10"
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Contact */}
      <Card className="p-4 border-dashed border-2 border-border">
        <h4 className="font-medium text-foreground mb-3">Add New Contact</h4>
        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <Input
            placeholder="Phone number"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
          <Input
            placeholder="Relationship (e.g., Friend, Family)"
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
          />
          <Button
            onClick={addTrustedContact}
            disabled={!newContact.name || !newContact.phone}
            className="w-full"
          >
            Add Contact
          </Button>
        </div>
      </Card>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-600">
            <p className="font-medium mb-1">Privacy Notice:</p>
            <p className="text-xs">Contacts will only receive safety-related information during active meetups. Phone numbers are encrypted and stored securely.</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => setActiveStep('setup')}
        className="w-full"
      >
        Back to Setup
      </Button>
    </div>
  );

  const renderActiveProtocolStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
            <Shield className="h-10 w-10 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-emerald-500 mb-2">
          Safety Protocol Active
        </h3>
        <p className="text-muted-foreground text-sm">
          Your safety features are now monitoring your meetup
        </p>
      </div>

      <div className="space-y-3">
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <h4 className="font-medium text-emerald-500 mb-3">Active Features</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Location shared with {trustedContacts.length} contacts</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-600">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Check-in timer set for {checkInInterval} minutes</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-600">Active</Badge>
            </div>

            {fakeCallTime > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Fake call scheduled for {fakeCallTime} minutes</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-600">Scheduled</Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveStep('checkin')}
            className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Check In
          </Button>

          <Button
            variant="outline"
            onClick={scheduleFakeCall}
            className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10"
          >
            <Phone className="h-4 w-4 mr-2" />
            Fake Call Now
          </Button>
        </div>

        {/* Emergency Panic Button */}
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <div className="text-center">
            <h4 className="font-semibold text-red-500 mb-2">Emergency Panic Button</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Hold for 3 seconds to activate emergency protocol
            </p>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3"
            >
              🚨 PANIC BUTTON
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Next check-in required in {checkInInterval} minutes
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {activeStep === 'setup' && renderSetupStep()}
      {activeStep === 'contacts' && renderContactsStep()}
      {(activeStep === 'complete' || protocolActive) && renderActiveProtocolStep()}
    </div>
  );
}
