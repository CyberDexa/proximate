'use client';

import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Users, Shield, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Location {
  id: string;
  name: string;
  type: 'bar' | 'restaurant' | 'cafe' | 'hotel_lobby' | 'public_space';
  address: string;
  distance: number; // in miles
  rating: number;
  safetyScore: number; // 1-5, based on lighting, crowd, security
  description: string;
  hours: string;
  busyTimes: string[];
  features: string[];
  priceRange: '$' | '$$' | '$$$';
  isOpen: boolean;
  website?: string;
  phoneNumber?: string;
}

interface LocationSuggesterProps {
  userLocation: { lat: number; lng: number };
  partnerLocation: { lat: number; lng: number };
  onLocationSelect: (location: Location) => void;
  onClose: () => void;
}

export function LocationSuggester({ 
  userLocation, 
  partnerLocation, 
  onLocationSelect, 
  onClose 
}: LocationSuggesterProps) {
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [customLocation, setCustomLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [userLocation, partnerLocation, selectedType]);

  const loadSuggestions = async () => {
    setLoading(true);
    
    // TODO: Replace with actual API call to find midpoint and safe locations
    const mockSuggestions: Location[] = [
      {
        id: '1',
        name: 'The Library Bar',
        type: 'bar',
        address: '123 Main St, Downtown',
        distance: 0.8,
        rating: 4.8,
        safetyScore: 5,
        description: 'Upscale cocktail bar with well-lit entrance and busy atmosphere',
        hours: 'Open until 2:00 AM',
        busyTimes: ['7:00 PM - 11:00 PM'],
        features: ['Well-lit', 'Security staff', 'Busy area', 'Valet parking'],
        priceRange: '$$',
        isOpen: true,
        website: 'https://thelibrarybar.com',
        phoneNumber: '(555) 123-4567'
      },
      {
        id: '2',
        name: 'Hilton Downtown Lobby',
        type: 'hotel_lobby',
        address: '456 Business Blvd',
        distance: 1.2,
        rating: 4.5,
        safetyScore: 5,
        description: 'Hotel lobby bar with 24/7 security and professional atmosphere',
        hours: 'Open 24/7',
        busyTimes: ['6:00 PM - 10:00 PM'],
        features: ['24/7 security', 'Well-lit', 'Professional setting', 'Parking garage'],
        priceRange: '$$$',
        isOpen: true,
        website: 'https://hilton.com',
        phoneNumber: '(555) 987-6543'
      },
      {
        id: '3',
        name: 'Central Coffee Co',
        type: 'cafe',
        address: '789 Park Avenue',
        distance: 0.5,
        rating: 4.6,
        safetyScore: 4,
        description: 'Popular coffee shop with large windows and plenty of foot traffic',
        hours: 'Open until 10:00 PM',
        busyTimes: ['8:00 AM - 10:00 AM', '6:00 PM - 9:00 PM'],
        features: ['Large windows', 'Busy area', 'Free WiFi', 'Street parking'],
        priceRange: '$',
        isOpen: true,
        website: 'https://centralcoffee.com'
      },
      {
        id: '4',
        name: 'Riverside Restaurant',
        type: 'restaurant',
        address: '321 River Walk',
        distance: 1.5,
        rating: 4.7,
        safetyScore: 4,
        description: 'Family-friendly restaurant with outdoor seating and river views',
        hours: 'Open until 11:00 PM',
        busyTimes: ['7:00 PM - 9:00 PM'],
        features: ['Outdoor seating', 'Family-friendly', 'Waterfront', 'Valet available'],
        priceRange: '$$',
        isOpen: true,
        website: 'https://riversiderestaurant.com',
        phoneNumber: '(555) 456-7890'
      }
    ];

    // Filter by type if not 'all'
    const filtered = selectedType === 'all' 
      ? mockSuggestions 
      : mockSuggestions.filter(loc => loc.type === selectedType);

    // Sort by safety score and distance
    filtered.sort((a, b) => {
      if (a.safetyScore !== b.safetyScore) {
        return b.safetyScore - a.safetyScore; // Higher safety first
      }
      return a.distance - b.distance; // Closer first
    });

    setSuggestions(filtered);
    setLoading(false);
  };

  const getSafetyColor = (score: number) => {
    if (score >= 5) return 'text-emerald-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bar': return '🍸';
      case 'restaurant': return '🍽️';
      case 'cafe': return '☕';
      case 'hotel_lobby': return '🏨';
      case 'public_space': return '🏛️';
      default: return '📍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bar': return 'Bar';
      case 'restaurant': return 'Restaurant';
      case 'cafe': return 'Café';
      case 'hotel_lobby': return 'Hotel Lobby';
      case 'public_space': return 'Public Space';
      default: return 'Location';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Safe Meeting Locations
        </h3>
        <p className="text-muted-foreground text-sm">
          AI-suggested public, safe spots at your midpoint
        </p>
      </div>

      {/* Location Type Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All', icon: '📍' },
          { value: 'bar', label: 'Bars', icon: '🍸' },
          { value: 'restaurant', label: 'Restaurants', icon: '🍽️' },
          { value: 'cafe', label: 'Cafés', icon: '☕' },
          { value: 'hotel_lobby', label: 'Hotel Lobbies', icon: '🏨' }
        ].map((type) => (
          <Button
            key={type.value}
            size="sm"
            variant={selectedType === type.value ? 'default' : 'outline'}
            onClick={() => setSelectedType(type.value)}
            className="flex-shrink-0"
          >
            <span className="mr-1">{type.icon}</span>
            {type.label}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Location Suggestions */}
      {!loading && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {suggestions.map((location) => (
            <Card key={location.id} className="p-4 hover:bg-card/80 transition-colors">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{getTypeIcon(location.type)}</span>
                      <h4 className="font-semibold text-foreground">{location.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {getTypeLabel(location.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {location.description}
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm font-medium">{location.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className={`h-3 w-3 ${getSafetyColor(location.safetyScore)}`} />
                      <span className={`text-sm font-medium ${getSafetyColor(location.safetyScore)}`}>
                        {location.safetyScore}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{location.distance} mi away</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className={location.isOpen ? 'text-emerald-500' : 'text-red-500'}>
                          {location.hours}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {location.priceRange}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <strong>Address:</strong> {location.address}
                  </div>

                  {location.busyTimes.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Busy times: </span>
                      <span className="text-emerald-500">{location.busyTimes.join(', ')}</span>
                    </div>
                  )}

                  {/* Safety Features */}
                  <div className="flex flex-wrap gap-1">
                    {location.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs bg-emerald-500/10 text-emerald-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex space-x-2">
                    {location.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(location.website, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Website
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const address = encodeURIComponent(location.address);
                        window.open(`https://maps.google.com/?q=${address}`, '_blank');
                      }}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Directions
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onLocationSelect(location)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Select Location
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Custom Location */}
      <Card className="p-4 border-dashed border-2 border-border">
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Suggest Your Own Location</h4>
          <div className="flex space-x-2">
            <Input
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Enter location name or address..."
              className="flex-1"
            />
            <Button
              onClick={() => {
                if (customLocation.trim()) {
                  const customLoc: Location = {
                    id: 'custom',
                    name: customLocation,
                    type: 'public_space',
                    address: customLocation,
                    distance: 0,
                    rating: 0,
                    safetyScore: 3,
                    description: 'Custom location suggested by user',
                    hours: 'Unknown',
                    busyTimes: [],
                    features: ['User suggested'],
                    priceRange: '$',
                    isOpen: true
                  };
                  onLocationSelect(customLoc);
                }
              }}
              disabled={!customLocation.trim()}
            >
              Suggest
            </Button>
          </div>
        </div>
      </Card>

      {/* Safety Notice */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Shield className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-emerald-600">
            <p className="font-medium mb-1">Safety Reminder:</p>
            <p className="text-xs">Always meet in public places with good lighting and security. Trust your instincts and have an exit plan.</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onClose}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
}
