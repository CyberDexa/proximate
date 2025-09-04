'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Clock, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Match {
  id: string;
  user: {
    id: string;
    name: string;
    age: number;
    photo: string;
    verified: boolean;
  };
  intentionsMatch: boolean;
  matchedIntentions: string[];
  chatExpiresAt: string;
}

interface MatchCelebrationProps {
  match: Match;
  onMessageNow: () => void;
  onSaveForLater: () => void;
  onClose: () => void;
}

export function MatchCelebration({ 
  match, 
  onMessageNow, 
  onSaveForLater, 
  onClose 
}: MatchCelebrationProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expires = new Date(match.chatExpiresAt).getTime();
      const difference = expires - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Expired');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [match.chatExpiresAt]);

  useEffect(() => {
    // Auto-hide celebration after 5 seconds
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-dark-surface border-primary-purple/30 overflow-hidden">
        {/* Celebration Header */}
        <div className={cn(
          "relative p-6 text-center transition-all duration-1000",
          showCelebration 
            ? "bg-gradient-to-br from-primary-purple/20 to-primary-blue/20" 
            : "bg-dark-surface"
        )}>
          {showCelebration && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/10 to-primary-blue/10 animate-pulse" />
          )}
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-purple fill-current" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2 text-white">
              It's a Match!
            </h2>
            
            <p className="text-dark-muted">
              You and {match.user.name} liked each other
            </p>
          </div>
        </div>

        {/* Match Details */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={match.user.photo}
                alt={match.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {match.user.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">
                {match.user.name}, {match.user.age}
              </h3>
              <div className="flex items-center gap-2 text-sm text-dark-muted">
                {match.user.verified && (
                  <>
                    <Shield className="w-4 h-4 text-primary-blue" />
                    <span>Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Matched Intentions */}
          {match.intentionsMatch && match.matchedIntentions.length > 0 && (
            <div className="bg-dark-bg/50 rounded-lg p-3">
              <p className="text-sm font-medium text-success mb-2">
                Matched Intentions:
              </p>
              <div className="flex gap-2 flex-wrap">
                {match.matchedIntentions.map((intention) => (
                  <Badge 
                    key={intention}
                    variant="outline"
                    className="border-success/30 text-success"
                  >
                    {intention === 'tonight' && '🔥'} {intention}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Chat Timer */}
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-warning">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Chat expires in {timeLeft}
              </span>
            </div>
            <p className="text-xs text-dark-muted mt-1">
              Start chatting to keep this connection alive
            </p>
          </div>

          {/* Safety Reminder */}
          <div className="bg-primary-blue/10 border border-primary-blue/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-primary-blue mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Safety First</span>
            </div>
            <p className="text-xs text-dark-muted">
              Remember to meet in public, trust your instincts, and communicate boundaries clearly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onMessageNow}
              className="flex-1 bg-primary-purple hover:bg-primary-purple/90"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message Now
            </Button>
            
            <Button
              onClick={onSaveForLater}
              variant="outline"
              className="flex-1"
            >
              Save for Later
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-dark-muted hover:text-white"
            size="sm"
          >
            Continue Browsing
          </Button>
        </div>
      </Card>
    </div>
  );
}
