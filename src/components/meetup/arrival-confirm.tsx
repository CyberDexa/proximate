'use client';

import { useState, useRef } from 'react';
import { MapPin, Camera, CheckCircle, Clock, Shield, AlertTriangle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArrivalConfirmProps {
  encounterId: string;
  meetupLocation: string;
  partnerName: string;
  onArrivalConfirmed: (confirmationData: any) => void;
  onRequestHelp: () => void;
  onEmergency: () => void;
}

export function ArrivalConfirm({ 
  encounterId, 
  meetupLocation, 
  partnerName, 
  onArrivalConfirmed,
  onRequestHelp,
  onEmergency 
}: ArrivalConfirmProps) {
  const [step, setStep] = useState<'arrival' | 'verification' | 'confirmed' | 'extended'>('arrival');
  const [locationPhoto, setLocationPhoto] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
  const [extendTimer, setExtendTimer] = useState(30); // minutes
  const [partnerArrived, setPartnerArrived] = useState(false); // Mock - would come from API
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocationPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmArrival = () => {
    const confirmationData = {
      encounterId,
      arrivalTime: new Date(),
      location: currentLocation,
      locationPhoto,
      confirmedSafe: true
    };

    setArrivalTime(new Date());
    onArrivalConfirmed(confirmationData);
    setStep('confirmed');
  };

  const extendCheckIn = () => {
    // TODO: Call API to extend check-in timer
    setStep('extended');
  };

  const renderArrivalStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Arrival Confirmation
        </h3>
        <p className="text-muted-foreground text-sm">
          Let us know you've arrived safely at {meetupLocation}
        </p>
      </div>

      {/* Partner Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground">{partnerName}'s Status</h4>
            <p className="text-sm text-muted-foreground">
              {partnerArrived ? 'Has arrived at the location' : 'Not yet confirmed arrival'}
            </p>
          </div>
          <Badge variant={partnerArrived ? 'default' : 'secondary'}>
            {partnerArrived ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Arrived
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

      {/* Location Verification */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-3">Verify Your Location</h4>
        
        <div className="space-y-3">
          {/* Current Location */}
          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium">Share Current Location</p>
              <p className="text-xs text-muted-foreground">
                {currentLocation ? 'Location captured' : 'Location not captured'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={getCurrentLocation}
              className={currentLocation ? 'text-emerald-500 border-emerald-500/20' : ''}
            >
              {currentLocation ? <CheckCircle className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            </Button>
          </div>

          {/* Photo Verification */}
          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium">Photo of Location (Optional)</p>
              <p className="text-xs text-muted-foreground">
                {locationPhoto ? 'Photo captured' : 'Take a photo of the venue entrance'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className={locationPhoto ? 'text-emerald-500 border-emerald-500/20' : ''}
            >
              {locationPhoto ? <CheckCircle className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </div>
        </div>

        {/* Photo Preview */}
        {locationPhoto && (
          <div className="mt-3">
            <img
              src={locationPhoto}
              alt="Location verification"
              className="w-full h-32 object-cover rounded-lg border border-border"
            />
          </div>
        )}
      </Card>

      {/* Safety Reminder */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-600">
            <p className="font-medium mb-1">Safety Reminder:</p>
            <p className="text-xs">Stay in public areas, trust your instincts, and use the safety tools below if you feel uncomfortable.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={confirmArrival}
          disabled={!currentLocation}
          className="w-full bg-emerald-500 hover:bg-emerald-600 py-3"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          I've Arrived Safely
        </Button>

        {/* Safety Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onRequestHelp}
            className="text-orange-500 border-orange-500/20 hover:bg-orange-500/10"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Need Help
          </Button>

          <Button
            variant="outline"
            onClick={onEmergency}
            className="text-red-500 border-red-500/20 hover:bg-red-500/10"
          >
            <Phone className="h-4 w-4 mr-2" />
            Emergency
          </Button>
        </div>
      </div>
    </div>
  );

  const renderConfirmedStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-emerald-500 mb-2">
          Arrival Confirmed
        </h3>
        <p className="text-muted-foreground text-sm">
          Your safe arrival has been recorded and shared with trusted contacts
        </p>
      </div>

      {/* Confirmation Details */}
      <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
        <h4 className="font-medium text-emerald-600 mb-3">Arrival Record</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Confirmed at:</span>
            <span className="text-emerald-600">
              {arrivalTime?.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="text-emerald-600">
              {currentLocation ? 'GPS Verified' : 'Manual'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Photo taken:</span>
            <span className="text-emerald-600">
              {locationPhoto ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Next check-in:</span>
            <span className="text-emerald-600">
              {new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Active Safety Features */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-3">Active Safety Features</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Check-in timer active</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-600">30 min</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Location shared with trusted contacts</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-600">Active</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Panic button ready</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-600">Ready</Badge>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Button
          onClick={() => setStep('extended')}
          variant="outline"
          className="w-full"
        >
          <Clock className="h-4 w-4 mr-2" />
          Extend Check-in Timer
        </Button>

        {/* Safety Actions Always Available */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onRequestHelp}
            className="text-orange-500 border-orange-500/20 hover:bg-orange-500/10"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Need Help
          </Button>

          <Button
            variant="outline"
            onClick={onEmergency}
            className="text-red-500 border-red-500/20 hover:bg-red-500/10"
          >
            <Phone className="h-4 w-4 mr-2" />
            Emergency
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Enjoy your meetup! We'll check in with you in 30 minutes.
      </div>
    </div>
  );

  const renderExtendedStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Extend Check-in Timer
        </h3>
        <p className="text-muted-foreground text-sm">
          How much more time do you need before the next safety check-in?
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Select Extension Time</h4>
        
        <div className="grid grid-cols-3 gap-3">
          {[30, 60, 90].map((minutes) => (
            <Button
              key={minutes}
              variant={extendTimer === minutes ? 'default' : 'outline'}
              onClick={() => setExtendTimer(minutes)}
              className="flex flex-col py-4"
            >
              <span className="text-lg font-bold">{minutes}</span>
              <span className="text-xs">minutes</span>
            </Button>
          ))}
        </div>

        <Button
          onClick={extendCheckIn}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          <Clock className="h-4 w-4 mr-2" />
          Extend Timer to {extendTimer} Minutes
        </Button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Clock className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-600">
            <p className="font-medium mb-1">Timer Extension Notice:</p>
            <p className="text-xs">Your trusted contacts will be notified that you've extended your meetup safely. If you miss the extended check-in, they will be alerted.</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => setStep('confirmed')}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {step === 'arrival' && renderArrivalStep()}
      {step === 'confirmed' && renderConfirmedStep()}
      {step === 'extended' && renderExtendedStep()}
    </div>
  );
}
