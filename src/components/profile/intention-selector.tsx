'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Flame, Calendar, RefreshCw, Sparkles, Clock } from 'lucide-react';

interface IntentionSelectorProps {
  selectedIntentions: string[];
  onIntentionsChange: (intentions: string[]) => void;
  availableNow?: boolean;
  onAvailableNowChange?: (available: boolean) => void;
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

export default function IntentionSelector({ 
  selectedIntentions, 
  onIntentionsChange,
  availableNow = false,
  onAvailableNowChange 
}: IntentionSelectorProps) {
  const handleIntentionToggle = (intentionId: string) => {
    const newIntentions = selectedIntentions.includes(intentionId)
      ? selectedIntentions.filter(id => id !== intentionId)
      : [...selectedIntentions, intentionId];
    
    onIntentionsChange(newIntentions);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>What are you looking for?</CardTitle>
        <CardDescription>
          Be clear about your intentions to find compatible matches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Now Toggle */}
        {onAvailableNowChange && (
          <div className="flex items-center justify-between p-4 bg-green-900/10 border border-green-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${availableNow ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
              <div>
                <h3 className={`font-semibold ${availableNow ? 'text-green-300' : 'text-gray-400'}`}>
                  Available Now
                </h3>
                <p className="text-sm text-gray-400">
                  Show as available for immediate meetups
                </p>
              </div>
            </div>
            <Switch
              checked={availableNow}
              onCheckedChange={onAvailableNowChange}
            />
          </div>
        )}

        {/* Intentions */}
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

        {/* Selected Summary */}
        {selectedIntentions.length > 0 && (
          <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
            <h4 className="font-medium text-purple-300 mb-2">Your Intentions</h4>
            <div className="flex flex-wrap gap-2">
              {selectedIntentions.map((intentionId) => {
                const intention = intentionOptions.find(opt => opt.id === intentionId);
                if (!intention) return null;
                
                return (
                  <Badge 
                    key={intentionId} 
                    variant="secondary" 
                    className="bg-purple-900/30 text-purple-300"
                  >
                    {intention.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
