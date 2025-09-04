'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Shield, UserPlus, MapPin, AlertTriangle, Phone, Eye, MessageSquare } from 'lucide-react';

interface SafetySetupProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const consentPreferences = [
  {
    id: 'video_verify',
    label: 'Video verification before meetup',
    description: 'Require a brief video call before meeting',
    icon: Eye,
    recommended: true
  },
  {
    id: 'public_first',
    label: 'Public meetups only (first time)',
    description: 'Meet in public places for initial encounters',
    icon: MapPin,
    recommended: true
  },
  {
    id: 'check_in',
    label: 'Safety check-ins during meetup',
    description: 'Automated check-ins every 30 minutes',
    icon: MessageSquare,
    recommended: true
  },
  {
    id: 'sti_discussion',
    label: 'STI status discussion required',
    description: 'Discuss health status before intimate contact',
    icon: Shield,
    recommended: true
  }
];

export default function SafetySetup({ data, onUpdate }: SafetySetupProps) {
  const [trustedContact, setTrustedContact] = useState(data.trustedContact || '');
  const [trustedContactName, setTrustedContactName] = useState('');
  const [safeWord, setSafeWord] = useState(data.safeWord || '');
  const [enableLocationSharing, setEnableLocationSharing] = useState(data.enableLocationSharing || false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(data.consentPreferences || []);
  const [emergencyContactAdded, setEmergencyContactAdded] = useState(false);

  const handlePreferenceToggle = (preferenceId: string) => {
    const newPreferences = selectedPreferences.includes(preferenceId)
      ? selectedPreferences.filter(id => id !== preferenceId)
      : [...selectedPreferences, preferenceId];
    
    setSelectedPreferences(newPreferences);
    onUpdate({ consentPreferences: newPreferences });
  };

  const handleTrustedContactAdd = () => {
    if (trustedContact.trim() && trustedContactName.trim()) {
      setEmergencyContactAdded(true);
      onUpdate({ 
        trustedContact: trustedContact.trim(),
        trustedContactName: trustedContactName.trim()
      });
    }
  };

  const handleSafeWordChange = (value: string) => {
    setSafeWord(value);
    onUpdate({ safeWord: value });
  };

  const handleLocationSharingToggle = (checked: boolean) => {
    setEnableLocationSharing(checked);
    onUpdate({ enableLocationSharing: checked });
  };

  return (
    <div className="space-y-6">
      {/* Emergency Contact */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-green-400" />
            <span>Trusted Contact</span>
            <Badge variant="secondary" className="bg-green-900/20 text-green-300">
              Recommended
            </Badge>
          </CardTitle>
          <CardDescription>
            Add someone who can be notified in case of emergency
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emergencyContactAdded ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-sm font-medium">
                  Contact Name
                </label>
                <Input
                  id="contact-name"
                  placeholder="Best friend, family member, etc."
                  value={trustedContactName}
                  onChange={(e) => setTrustedContactName(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={trustedContact}
                  onChange={(e) => setTrustedContact(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <Button 
                onClick={handleTrustedContactAdd}
                disabled={!trustedContact.trim() || !trustedContactName.trim()}
                className="w-full"
              >
                Add Trusted Contact
              </Button>
              <p className="text-xs text-gray-400">
                This information is encrypted and only used for emergency situations
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <Phone className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-300">{trustedContactName}</h4>
                <p className="text-sm text-gray-400">Emergency contact added</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmergencyContactAdded(false)}
              >
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safe Word */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span>Safe Word</span>
          </CardTitle>
          <CardDescription>
            A code word that triggers emergency protocols if shared in messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Choose a unique safe word"
              value={safeWord}
              onChange={(e) => handleSafeWordChange(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
              <h4 className="text-yellow-300 font-medium mb-2">How Safe Words Work:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• If you send this word in a message, emergency protocols activate</li>
                <li>• Your trusted contact will be immediately notified</li>
                <li>• Your location will be shared automatically</li>
                <li>• Choose something you wouldn't use in normal conversation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Sharing */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span>Location Sharing</span>
          </CardTitle>
          <CardDescription>
            Share your live location with trusted contacts during meetups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-blue-300">Enable Location Sharing</h3>
                <p className="text-sm text-gray-400">
                  Automatically share location during active meetups
                </p>
              </div>
              <Switch
                checked={enableLocationSharing}
                onCheckedChange={handleLocationSharingToggle}
              />
            </div>
            
            {enableLocationSharing && (
              <div className="bg-blue-900/10 border border-blue-800 rounded-lg p-3">
                <h4 className="text-blue-300 font-medium mb-2">Location Sharing Features:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Live location shared only during confirmed meetups</li>
                  <li>• Automatically stops after 4 hours or when you check in as safe</li>
                  <li>• Only shared with your designated trusted contacts</li>
                  <li>• You can manually stop sharing anytime</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Consent Preferences */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Safety Preferences</span>
          </CardTitle>
          <CardDescription>
            Set your preferred safety measures for meetups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consentPreferences.map((preference) => {
              const Icon = preference.icon;
              const isSelected = selectedPreferences.includes(preference.id);
              
              return (
                <div
                  key={preference.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-900/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handlePreferenceToggle(preference.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mt-1"
                  />
                  <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {preference.label}
                      </h4>
                      {preference.recommended && (
                        <Badge variant="secondary" className="bg-green-900/20 text-green-300 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {preference.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Safety Summary */}
      <Card className="bg-purple-900/20 border-purple-800">
        <CardHeader>
          <CardTitle className="text-purple-300">Your Safety Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Trusted Contact</span>
              <Badge variant={emergencyContactAdded ? "default" : "outline"}>
                {emergencyContactAdded ? "Added" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Safe Word</span>
              <Badge variant={safeWord ? "default" : "outline"}>
                {safeWord ? "Set" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Location Sharing</span>
              <Badge variant={enableLocationSharing ? "default" : "outline"}>
                {enableLocationSharing ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Safety Preferences</span>
              <Badge variant={selectedPreferences.length > 0 ? "default" : "outline"}>
                {selectedPreferences.length} Selected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security Notice */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-300 mb-2">🔒 Security & Privacy</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• All safety information is encrypted and stored securely</li>
          <li>• Emergency contacts are only notified during actual emergencies</li>
          <li>• Location sharing is temporary and automatically expires</li>
          <li>• You have full control over all safety features</li>
          <li>• Safety preferences are private and not shared with matches</li>
        </ul>
      </div>
    </div>
  );
}
