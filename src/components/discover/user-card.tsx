'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Heart, X, Shield, Clock, MapPin, Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  age: number;
  distance: number;
  blurredPhoto: string;
  intentions: string[];
  verified: boolean;
  availableNow: boolean;
  mutualInterests: number;
  lastActive: string;
  safetyScore: number;
}

interface UserCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
  showInstantBadge?: boolean;
}

export function UserCard({ user, onLike, onPass, showInstantBadge }: UserCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isPassing, setIsPassing] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    await onLike();
    setIsLiking(false);
  };

  const handlePass = async () => {
    setIsPassing(true);
    await onPass();
    setIsPassing(false);
  };

  const getIntentionColor = (intention: string) => {
    switch (intention.toLowerCase()) {
      case 'tonight':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'this week':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const getDistanceDisplay = (distance: number) => {
    if (distance < 1) return `${Math.round(distance * 10) / 10} miles`;
    return `~${Math.round(distance)} miles`;
  };

  const getLastActiveDisplay = (lastActive: string) => {
    const now = new Date();
    const active = new Date(lastActive);
    const diffMinutes = Math.floor((now.getTime() - active.getTime()) / (1000 * 60));
    
    if (diffMinutes < 5) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return 'Offline';
  };

  return (
    <Card className="bg-dark-surface border-dark-border overflow-hidden">
      <div className="p-4">
        <div className="flex gap-4">
          {/* Blurred Photo */}
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-lg bg-dark-border backdrop-blur-sm border border-dark-border/50
                         flex items-center justify-center"
              style={{
                backgroundImage: `url(${user.blurredPhoto})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(8px) brightness(0.7)'
              }}
            >
              <div className="absolute inset-0 bg-dark-bg/40 rounded-lg flex items-center justify-center">
                <p className="text-xs text-white font-medium text-center px-2">
                  Match to<br />reveal
                </p>
              </div>
            </div>
            
            {/* Available Now Indicator */}
            {user.availableNow && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-available rounded-full border-2 border-dark-surface" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {user.name}, {user.age}
                </h3>
                {user.verified && (
                  <Shield className="w-4 h-4 text-primary-blue" />
                )}
              </div>
              
              {showInstantBadge && user.availableNow && (
                <Badge className="bg-available/20 text-available border-available/30">
                  Available Now
                </Badge>
              )}
            </div>

            {/* Location & Activity */}
            <div className="flex items-center gap-4 text-sm text-dark-muted">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{getDistanceDisplay(user.distance)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{getLastActiveDisplay(user.lastActive)}</span>
              </div>
            </div>

            {/* Intentions */}
            <div className="flex gap-2 flex-wrap">
              {user.intentions.slice(0, 2).map((intention) => (
                <Badge 
                  key={intention}
                  variant="outline"
                  className={cn("text-xs", getIntentionColor(intention))}
                >
                  {intention === 'tonight' && '🔥'} {intention}
                </Badge>
              ))}
            </div>

            {/* Mutual Interests */}
            {user.mutualInterests > 0 && (
              <div className="flex items-center gap-1 text-sm text-primary-blue">
                <Users2 className="w-3 h-3" />
                <span>Matched interests: {user.mutualInterests}</span>
              </div>
            )}
          </div>
        </div>

        {/* Safety Score */}
        <div className="mt-3 pt-3 border-t border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-dark-muted">
                Safety Score: 
                <span className="text-success font-medium ml-1">
                  {user.safetyScore}/10
                </span>
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePass}
                disabled={isPassing || isLiking}
                className="w-12 h-12 rounded-full p-0 border-danger/30 hover:bg-danger/10"
              >
                <X className="w-5 h-5 text-danger" />
              </Button>
              
              <Button
                size="sm"
                onClick={handleLike}
                disabled={isPassing || isLiking}
                className="w-12 h-12 rounded-full p-0 bg-primary-purple hover:bg-primary-purple/90"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
