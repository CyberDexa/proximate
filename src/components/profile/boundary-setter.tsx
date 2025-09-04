'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Shield, AlertTriangle, Plus, X } from 'lucide-react';

interface BoundarySetterProps {
  interests: string[];
  boundaries: string[];
  dealBreakers: string[];
  onInterestsChange: (interests: string[]) => void;
  onBoundariesChange: (boundaries: string[]) => void;
  onDealBreakersChange: (dealBreakers: string[]) => void;
}

const commonInterests = [
  'Vanilla', 'BDSM', 'Roleplay', 'Outdoor', 'Rough', 'Gentle', 'Dominant', 'Submissive',
  'Switch', 'Toys', 'Oral', 'Massage', 'Tantric', 'Bondage', 'Fetish', 'Experimental',
  'Public Play', 'Group', 'Threesome', 'Voyeur', 'Exhibition', 'Roleplay Scenarios'
];

const commonBoundaries = [
  'No anal', 'Condoms required', 'No rough play', 'No choking', 'No hair pulling',
  'No name calling', 'No recording', 'No photos', 'No public meetups', 'No car meets',
  'No drugs/alcohol', 'No smoking', 'No overnight stays', 'No emotional attachment',
  'No multiple partners', 'No unprotected sex', 'No face showing'
];

const commonDealBreakers = [
  'Smokers', 'Drug users', 'Heavy drinkers', 'Unverified profiles',
  'No recent STI test', 'Under 21', 'Over 50', 'No photos',
  'Married/partnered', 'Looking for relationships', 'Aggressive communication'
];

export default function BoundarySetter({
  interests,
  boundaries,
  dealBreakers,
  onInterestsChange,
  onBoundariesChange,
  onDealBreakersChange
}: BoundarySetterProps) {
  const [customInterest, setCustomInterest] = useState('');
  const [customBoundary, setCustomBoundary] = useState('');
  const [customDealBreaker, setCustomDealBreaker] = useState('');

  // Interest handlers
  const handleInterestToggle = (interest: string) => {
    const newInterests = interests.includes(interest)
      ? interests.filter(i => i !== interest)
      : [...interests, interest];
    onInterestsChange(newInterests);
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      onInterestsChange([...interests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  // Boundary handlers
  const handleBoundaryToggle = (boundary: string) => {
    const newBoundaries = boundaries.includes(boundary)
      ? boundaries.filter(b => b !== boundary)
      : [...boundaries, boundary];
    onBoundariesChange(newBoundaries);
  };

  const addCustomBoundary = () => {
    if (customBoundary.trim() && !boundaries.includes(customBoundary.trim())) {
      onBoundariesChange([...boundaries, customBoundary.trim()]);
      setCustomBoundary('');
    }
  };

  // Deal breaker handlers
  const handleDealBreakerToggle = (dealBreaker: string) => {
    const newDealBreakers = dealBreakers.includes(dealBreaker)
      ? dealBreakers.filter(d => d !== dealBreaker)
      : [...dealBreakers, dealBreaker];
    onDealBreakersChange(newDealBreakers);
  };

  const addCustomDealBreaker = () => {
    if (customDealBreaker.trim() && !dealBreakers.includes(customDealBreaker.trim())) {
      onDealBreakersChange([...dealBreakers, customDealBreaker.trim()]);
      setCustomDealBreaker('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Interests */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-green-400" />
            <span className="text-green-400">What I'm Into</span>
          </CardTitle>
          <CardDescription>
            Select your interests and preferences (private until matched)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest) => {
              const isSelected = interests.includes(interest);
              
              return (
                <Badge
                  key={interest}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          
          {/* Custom Interest Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom interest..."
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
              className="bg-gray-700 border-gray-600"
            />
            <Button 
              onClick={addCustomInterest}
              variant="outline"
              size="sm"
              disabled={!customInterest.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {interests.length > 0 && (
            <div className="text-sm text-gray-400">
              {interests.length} interest{interests.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boundaries */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-red-400">My Boundaries</span>
          </CardTitle>
          <CardDescription>
            Set clear boundaries about what you won't do (always respected)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonBoundaries.map((boundary) => {
              const isSelected = boundaries.includes(boundary);
              
              return (
                <Badge
                  key={boundary}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                  }`}
                  onClick={() => handleBoundaryToggle(boundary)}
                >
                  {boundary}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          
          {/* Custom Boundary Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom boundary..."
              value={customBoundary}
              onChange={(e) => setCustomBoundary(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomBoundary()}
              className="bg-gray-700 border-gray-600"
            />
            <Button 
              onClick={addCustomBoundary}
              variant="outline"
              size="sm"
              disabled={!customBoundary.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {boundaries.length > 0 && (
            <div className="text-sm text-gray-400">
              {boundaries.length} boundar{boundaries.length !== 1 ? 'ies' : 'y'} set
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deal Breakers */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400">Deal Breakers</span>
          </CardTitle>
          <CardDescription>
            Automatically filter out profiles with these characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonDealBreakers.map((dealBreaker) => {
              const isSelected = dealBreakers.includes(dealBreaker);
              
              return (
                <Badge
                  key={dealBreaker}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                  }`}
                  onClick={() => handleDealBreakerToggle(dealBreaker)}
                >
                  {dealBreaker}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          
          {/* Custom Deal Breaker Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom deal breaker..."
              value={customDealBreaker}
              onChange={(e) => setCustomDealBreaker(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomDealBreaker()}
              className="bg-gray-700 border-gray-600"
            />
            <Button 
              onClick={addCustomDealBreaker}
              variant="outline"
              size="sm"
              disabled={!customDealBreaker.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {dealBreakers.length > 0 && (
            <div className="text-sm text-gray-400">
              {dealBreakers.length} deal breaker{dealBreakers.length !== 1 ? 's' : ''} set
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {(interests.length > 0 || boundaries.length > 0 || dealBreakers.length > 0) && (
        <Card className="bg-purple-900/20 border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-300">Preference Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{interests.length}</div>
                <div className="text-sm text-gray-400">Interests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{boundaries.length}</div>
                <div className="text-sm text-gray-400">Boundaries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{dealBreakers.length}</div>
                <div className="text-sm text-gray-400">Deal Breakers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
        <h4 className="font-medium text-purple-300 mb-2">🔒 Privacy & Matching</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Your interests and boundaries are private until you match</li>
          <li>• Deal breakers automatically filter your discovery feed</li>
          <li>• Compatibility scores are calculated privately</li>
          <li>• You can update preferences anytime without losing matches</li>
        </ul>
      </div>
    </div>
  );
}
