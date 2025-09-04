'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Zap, Clock, Users, MapPin, X } from 'lucide-react';

interface InstantModeProps {
  activeUsers: number;
  onToggle: () => void;
}

export function InstantMode({ activeUsers, onToggle }: InstantModeProps) {
  const [expiresIn, setExpiresIn] = useState(118); // minutes until auto-expire

  return (
    <Card className="mx-4 mt-4 bg-gradient-to-r from-available/10 to-primary-blue/10 border-available/30">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-available rounded-full animate-pulse" />
            <h3 className="font-semibold text-available">Instant Mode Active</h3>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
            className="text-dark-muted hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-available" />
                <span className="text-white">
                  {activeUsers} available nearby
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-available" />
                <span className="text-dark-muted">
                  Within 1 mile
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-dark-muted">
              <Clock className="w-4 h-4" />
              <span>Expires in {expiresIn}m</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-dark-muted">
            Only showing users who are available for immediate meetups. 
            Your status will auto-expire in 2 hours for safety.
          </p>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs border-available/30 text-available">
              <Zap className="w-3 h-3 mr-1" />
              Available Now
            </Badge>
            <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-400">
              <Clock className="w-3 h-3 mr-1" />
              Auto-expires
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
