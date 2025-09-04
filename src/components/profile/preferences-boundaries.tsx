'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, X, Plus, Minus } from 'lucide-react';

interface PreferencesBoundariesProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const genderOptions = [
  { id: 'women', label: 'Women', emoji: '♀️' },
  { id: 'men', label: 'Men', emoji: '♂️' },
  { id: 'non_binary', label: 'Non-binary', emoji: '⚧️' },
  { id: 'trans_women', label: 'Trans Women', emoji: '🏳️‍⚧️' },
  { id: 'trans_men', label: 'Trans Men', emoji: '🏳️‍⚧️' },
  { id: 'everyone', label: 'Everyone', emoji: '🌈' }
];

const commonKinks = [
  'Vanilla', 'BDSM', 'Roleplay', 'Outdoor', 'Rough', 'Gentle', 'Dominant', 'Submissive',
  'Switch', 'Toys', 'Oral', 'Massage', 'Tantric', 'Bondage', 'Fetish', 'Experimental',
  'Public Play', 'Group', 'Threesome', 'Voyeur', 'Exhibition', 'Roleplay Scenarios',
  'Age Play', 'Pet Play', 'Impact Play', 'Sensation Play', 'Temperature Play'
];

const commonBoundaries = [
  'No anal', 'Condoms required', 'No rough play', 'No choking', 'No hair pulling',
  'No name calling', 'No recording', 'No photos', 'No public meetups', 'No car meets',
  'No drugs/alcohol', 'No smoking', 'No overnight stays', 'No emotional attachment',
  'No multiple partners', 'No unprotected sex', 'No face showing', 'No personal info sharing'
];

export default function PreferencesBoundaries({ data, onUpdate }: PreferencesBoundariesProps) {
  const [interestedIn, setInterestedIn] = useState<string[]>(data.interestedIn || []);
  const [selectedKinks, setSelectedKinks] = useState<string[]>(data.kinks || []);
  const [selectedBoundaries, setSelectedBoundaries] = useState<string[]>(data.boundaries || []);
  const [dealBreakers, setDealBreakers] = useState<string[]>(data.dealBreakers || []);
  const [customKink, setCustomKink] = useState('');
  const [customBoundary, setCustomBoundary] = useState('');
  const [customDealBreaker, setCustomDealBreaker] = useState('');

  const handleGenderToggle = (genderId: string) => {
    let newInterestedIn;
    if (genderId === 'everyone') {
      newInterestedIn = interestedIn.includes('everyone') ? [] : ['everyone'];
    } else {
      newInterestedIn = interestedIn.includes(genderId)
        ? interestedIn.filter(id => id !== genderId && id !== 'everyone')
        : [...interestedIn.filter(id => id !== 'everyone'), genderId];
    }
    
    setInterestedIn(newInterestedIn);
    onUpdate({ interestedIn: newInterestedIn });
  };

  const handleKinkToggle = (kink: string) => {
    const newKinks = selectedKinks.includes(kink)
      ? selectedKinks.filter(k => k !== kink)
      : [...selectedKinks, kink];
    
    setSelectedKinks(newKinks);
    onUpdate({ kinks: newKinks });
  };

  const handleBoundaryToggle = (boundary: string) => {
    const newBoundaries = selectedBoundaries.includes(boundary)
      ? selectedBoundaries.filter(b => b !== boundary)
      : [...selectedBoundaries, boundary];
    
    setSelectedBoundaries(newBoundaries);
    onUpdate({ boundaries: newBoundaries });
  };

  const handleDealBreakerToggle = (dealBreaker: string) => {
    const newDealBreakers = dealBreakers.includes(dealBreaker)
      ? dealBreakers.filter(d => d !== dealBreaker)
      : [...dealBreakers, dealBreaker];
    
    setDealBreakers(newDealBreakers);
    onUpdate({ dealBreakers: newDealBreakers });
  };

  const addCustomKink = () => {
    if (customKink.trim() && !selectedKinks.includes(customKink.trim())) {
      const newKinks = [...selectedKinks, customKink.trim()];
      setSelectedKinks(newKinks);
      onUpdate({ kinks: newKinks });
      setCustomKink('');
    }
  };

  const addCustomBoundary = () => {
    if (customBoundary.trim() && !selectedBoundaries.includes(customBoundary.trim())) {
      const newBoundaries = [...selectedBoundaries, customBoundary.trim()];
      setSelectedBoundaries(newBoundaries);
      onUpdate({ boundaries: newBoundaries });
      setCustomBoundary('');
    }
  };

  const addCustomDealBreaker = () => {
    if (customDealBreaker.trim() && !dealBreakers.includes(customDealBreaker.trim())) {
      const newDealBreakers = [...dealBreakers, customDealBreaker.trim()];
      setDealBreakers(newDealBreakers);
      onUpdate({ dealBreakers: newDealBreakers });
      setCustomDealBreaker('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Interested In */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span>I'm interested in</span>
          </CardTitle>
          <CardDescription>
            Select all that apply - you can be specific about your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genderOptions.map((option) => {
              const isSelected = interestedIn.includes(option.id);
              
              return (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-pink-600 bg-pink-900/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handleGenderToggle(option.id)}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {option.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kinks & Interests */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-400">What I'm Into</CardTitle>
          <CardDescription>
            Select your interests and kinks (private until matched)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonKinks.map((kink) => {
              const isSelected = selectedKinks.includes(kink);
              
              return (
                <Badge
                  key={kink}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                  }`}
                  onClick={() => handleKinkToggle(kink)}
                >
                  {kink}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          
          {/* Add Custom Kink */}
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom interest..."
              value={customKink}
              onChange={(e) => setCustomKink(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomKink()}
              className="bg-gray-700 border-gray-600"
            />
            <Button 
              onClick={addCustomKink}
              variant="outline"
              size="sm"
              disabled={!customKink.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Boundaries */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-red-400">My Boundaries</CardTitle>
          <CardDescription>
            Set clear boundaries about what you won't do (always respected)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonBoundaries.map((boundary) => {
              const isSelected = selectedBoundaries.includes(boundary);
              
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
          
          {/* Add Custom Boundary */}
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
        </CardContent>
      </Card>

      {/* Deal Breakers */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Deal Breakers</CardTitle>
          <CardDescription>
            Automatically filter out profiles with these characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              'Smokers', 'Drug users', 'Heavy drinkers', 'Unverified profiles',
              'No recent STI test', 'Under 21', 'Over 50', 'No photos',
              'Married/partnered', 'Looking for relationships', 'No meetup experience',
              'Bad reviews', 'Aggressive communication', 'Pushy behavior'
            ].map((dealBreaker) => {
              const isSelected = dealBreakers.includes(dealBreaker);
              
              return (
                <div key={dealBreaker} className="flex items-center space-x-3">
                  <Checkbox
                    id={dealBreaker}
                    checked={isSelected}
                    onCheckedChange={() => handleDealBreakerToggle(dealBreaker)}
                  />
                  <label
                    htmlFor={dealBreaker}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {dealBreaker}
                  </label>
                </div>
              );
            })}
          </div>
          
          {/* Add Custom Deal Breaker */}
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
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
        <h4 className="font-medium text-purple-300 mb-2">🔒 Preference Privacy</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Your kinks and boundaries are private until you match</li>
          <li>• Deal breakers automatically filter your discovery feed</li>
          <li>• You can update preferences anytime without losing matches</li>
          <li>• Compatibility scores are calculated privately</li>
        </ul>
      </div>
    </div>
  );
}
