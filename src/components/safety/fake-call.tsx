"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, PhoneCall, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FakeCallProps {
  className?: string;
  triggerVariant?: 'button' | 'emergency';
}

interface CallPreset {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
}

const DEFAULT_PRESETS: CallPreset[] = [
  { id: 'mom', name: 'Mom', relationship: 'Family' },
  { id: 'boss', name: 'Work', relationship: 'Manager' },
  { id: 'friend', name: 'Emergency Contact', relationship: 'Friend' },
  { id: 'doctor', name: 'Dr. Smith', relationship: 'Medical' },
];

export function FakeCall({ className, triggerVariant = 'button' }: FakeCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<CallPreset>(DEFAULT_PRESETS[0]);
  const [customName, setCustomName] = useState('');
  const [customRelation, setCustomRelation] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Simulate call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const startFakeCall = (preset?: CallPreset) => {
    const caller = preset || {
      id: 'custom',
      name: customName || 'Unknown',
      relationship: customRelation || 'Contact'
    };
    
    setSelectedPreset(caller);
    setIsCallActive(true);
    setCallDuration(0);

    // Trigger phone vibration if available
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }

    // Play ringtone if available (would need audio file)
    // playRingtone();
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Full-screen call interface
  if (isCallActive) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
        {/* Status bar */}
        <div className="flex justify-between items-center p-4 text-sm">
          <span>ProxiMeet</span>
          <span>📶 🔋</span>
        </div>

        {/* Call info */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Avatar */}
          <div className="w-32 h-32 bg-gray-600 rounded-full mb-6 flex items-center justify-center text-4xl">
            {selectedPreset.avatar || selectedPreset.name.charAt(0)}
          </div>

          {/* Caller name */}
          <h2 className="text-3xl font-light mb-2">{selectedPreset.name}</h2>
          <p className="text-lg text-gray-300 mb-8">{selectedPreset.relationship}</p>

          {/* Call duration */}
          <div className="text-lg text-gray-400 mb-8">
            {formatDuration(callDuration)}
          </div>

          {/* Incoming call animation */}
          <div className="mb-12">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mx-auto mb-2" />
            <p className="text-gray-400">Incoming call...</p>
          </div>
        </div>

        {/* Call controls */}
        <div className="flex justify-center items-center space-x-12 pb-12">
          {/* Decline button */}
          <button
            onClick={endCall}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="h-8 w-8 text-white" />
          </button>

          {/* Accept button */}
          <button
            onClick={endCall}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <Phone className="h-8 w-8 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // Trigger button for emergency use
  if (triggerVariant === 'emergency') {
    return (
      <Button
        onClick={() => startFakeCall()}
        variant="outline"
        className={cn("w-full", className)}
      >
        <PhoneCall className="h-4 w-4 mr-2" />
        Fake Call Now
      </Button>
    );
  }

  // Main interface with presets
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <PhoneCall className="h-4 w-4 mr-2" />
          Fake Call
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Fake Call</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick presets */}
          <div>
            <Label className="text-sm font-medium">Quick Options</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DEFAULT_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  onClick={() => startFakeCall(preset)}
                  className="h-auto p-3 flex flex-col items-start"
                >
                  <span className="font-medium">{preset.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {preset.relationship}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom caller */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="w-full justify-start p-0 h-auto"
            >
              <span className="text-sm">+ Custom Caller</span>
            </Button>

            {showCustomForm && (
              <div className="space-y-3 mt-3 p-3 border rounded-lg">
                <div>
                  <Label htmlFor="customName" className="text-sm">
                    Caller Name
                  </Label>
                  <Input
                    id="customName"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customRelation" className="text-sm">
                    Relationship
                  </Label>
                  <Input
                    id="customRelation"
                    value={customRelation}
                    onChange={(e) => setCustomRelation(e.target.value)}
                    placeholder="Friend, Family, Work..."
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={() => startFakeCall()}
                  disabled={!customName}
                  className="w-full"
                >
                  Start Call
                </Button>
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <p>
              This creates a realistic incoming call screen to help you safely exit
              uncomfortable situations. The call is completely fake and private.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
