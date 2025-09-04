'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Flame, Calendar, RefreshCw, Sparkles, Clock, Moon, Sun, Sunset } from 'lucide-react';

interface IntentionsAvailabilityProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const intentionOptions = [
  {
    id: 'tonight',
    label: 'Tonight Only',
    description: 'Looking for something tonight',
    icon: Flame,
    color: 'text-red-400',
    bgColor: 'bg-red-900/20 border-red-800',
    expires: '24h'
  },
  {
    id: 'this_week',
    label: 'This Week',
    description: 'Available within the next 7 days',
    icon: Calendar,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20 border-blue-800',
    expires: '7d'
  },
  {
    id: 'ongoing_fwb',
    label: 'Ongoing FWB',
    description: 'Friends with benefits arrangement',
    icon: RefreshCw,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20 border-purple-800',
    expires: null
  },
  {
    id: 'one_time',
    label: 'One-time',
    description: 'Single encounter, no strings',
    icon: Sparkles,
    color: 'text-green-400',
    bgColor: 'bg-green-900/20 border-green-800',
    expires: null
  }
];

const availabilityOptions = [
  {
    id: 'now',
    label: 'Available Now',
    description: 'Ready to meet within the hour',
    icon: Clock,
    urgent: true
  },
  {
    id: 'tonight',
    label: 'Tonight',
    description: 'Free later today',
    icon: Moon,
    urgent: false
  },
  {
    id: 'weekends',
    label: 'Weekends',
    description: 'Weekend availability',
    icon: Sun,
    urgent: false
  }
];

const meetupTimeOptions = [
  { id: 'evening', label: 'Evening (6-9 PM)', icon: Sunset },
  { id: 'late_night', label: 'Late Night (9 PM+)', icon: Moon },
  { id: 'flexible', label: 'Flexible', icon: Clock }
];

export default function IntentionsAvailability({ data, onUpdate }: IntentionsAvailabilityProps) {
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>(data.intentions || []);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(data.availability || []);
  const [preferredMeetupTime, setPreferredMeetupTime] = useState(data.preferredMeetupTime || '');
  const [availableNow, setAvailableNow] = useState(false);

  const handleIntentionToggle = (intentionId: string) => {
    const newIntentions = selectedIntentions.includes(intentionId)
      ? selectedIntentions.filter(id => id !== intentionId)
      : [...selectedIntentions, intentionId];
    
    setSelectedIntentions(newIntentions);
    onUpdate({ intentions: newIntentions });
  };

  const handleAvailabilityToggle = (availabilityId: string) => {
    const newAvailability = selectedAvailability.includes(availabilityId)
      ? selectedAvailability.filter(id => id !== availabilityId)
      : [...selectedAvailability, availabilityId];
    
    setSelectedAvailability(newAvailability);
    onUpdate({ availability: newAvailability });
  };

  const handleMeetupTimeSelect = (timeId: string) => {
    setPreferredMeetupTime(timeId);
    onUpdate({ preferredMeetupTime: timeId });
  };

  const handleAvailableNowToggle = (checked: boolean) => {
    setAvailableNow(checked);
    onUpdate({ availableNow: checked });
  };

  return (
    <div className="space-y-6">
      {/* Intentions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>What are you looking for?</CardTitle>
          <CardDescription>
            Be clear about your intentions to find compatible matches (select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intentionOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedIntentions.includes(option.id);
              
              return (
                <div
                  key={option.id}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? option.bgColor
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handleIntentionToggle(option.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-6 h-6 mt-1 ${isSelected ? option.color : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {option.description}
                      </p>
                      {option.expires && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Expires in {option.expires}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>When are you available?</CardTitle>
          <CardDescription>
            Let others know when you're typically free to meet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Available Now Toggle */}
          <div className="flex items-center justify-between p-4 bg-green-900/10 border border-green-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold text-green-300">Available Now</h3>
                <p className="text-sm text-gray-400">
                  Show as available for immediate meetups
                </p>
              </div>
            </div>
            <Switch
              checked={availableNow}
              onCheckedChange={handleAvailableNowToggle}
            />
          </div>

          {/* General Availability */}
          <div className="space-y-3">
            {availabilityOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedAvailability.includes(option.id);
              
              return (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-900/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handleAvailabilityToggle(option.id)}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {option.description}
                    </p>
                  </div>
                  {option.urgent && (
                    <Badge variant="secondary" className="bg-red-900/20 text-red-300">
                      Urgent
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Meetup Time */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Preferred Meetup Time</CardTitle>
          <CardDescription>
            When do you usually prefer to meet?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {meetupTimeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = preferredMeetupTime === option.id;
              
              return (
                <Button
                  key={option.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-auto p-4 justify-start ${
                    isSelected 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handleMeetupTimeSelect(option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{option.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
        <h4 className="font-medium text-purple-300 mb-2">🔒 Intention Privacy</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Your intentions are only visible to mutual matches</li>
          <li>• "Tonight" intentions automatically expire after 24 hours</li>
          <li>• You can change your availability status anytime</li>
          <li>• Available now status increases your visibility in discovery</li>
        </ul>
      </div>
    </div>
  );
}
