'use client';

import { useState, useEffect } from 'react';
import { UserCard } from '@/components/discover/user-card';
import { InstantMode } from '@/components/discover/instant-mode';
import { SafetyIndicator } from '@/components/discover/safety-indicator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Filter, Map, Users } from 'lucide-react';
import { useDiscovery } from '@/hooks/use-discovery';

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

export default function DiscoverPage() {
  const [instantMode, setInstantMode] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    users, 
    loading, 
    activeUsersNearby, 
    likeUser, 
    passUser,
    loadMore 
  } = useDiscovery({ instantMode });

  const handleSafetyAlert = () => {
    // Emergency safety protocol
    window.location.href = 'tel://911';
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      {/* Safety-First Top Bar */}
      <div className="sticky top-0 z-50 bg-dark-surface/95 backdrop-blur border-b border-dark-border">
        <div className="flex items-center justify-between p-4">
          {/* Safety Button - Always Visible */}
          <Button
            onClick={handleSafetyAlert}
            className="bg-danger hover:bg-danger/90 text-white"
            size="sm"
          >
            <Shield className="w-4 h-4 mr-2" />
            Safety
          </Button>

          {/* Available Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-dark-muted">Available Now:</span>
            <Button
              variant={instantMode ? "default" : "outline"}
              size="sm"
              onClick={() => setInstantMode(!instantMode)}
              className={instantMode ? "bg-available text-white" : ""}
            >
              <Zap className="w-4 h-4 mr-1" />
              {instantMode ? "ON" : "OFF"}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHeatMap(!showHeatMap)}
            >
              <Map className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Activity Indicator */}
        {instantMode && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-available rounded-full animate-pulse" />
              <span className="text-available font-medium">
                WHO'S NEARBY: {activeUsersNearby} Active
              </span>
              <Users className="w-4 h-4 text-available" />
            </div>
          </div>
        )}
      </div>

      {/* Heat Map Overlay */}
      {showHeatMap && (
        <div className="relative h-32 bg-dark-surface border-b border-dark-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/20 via-primary-blue/20 to-primary-purple/20 
                         animate-pulse flex items-center justify-center">
            <div className="text-center">
              <Map className="w-8 h-8 mx-auto mb-2 text-primary-blue" />
              <p className="text-sm text-dark-muted">Activity hotspots without exact locations</p>
            </div>
          </div>
        </div>
      )}

      {/* Instant Mode Component */}
      {instantMode && (
        <InstantMode 
          activeUsers={activeUsersNearby}
          onToggle={() => setInstantMode(false)}
        />
      )}

      {/* Main Discovery Feed */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-surface rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-dark-border rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-dark-border rounded w-1/3" />
                    <div className="h-3 bg-dark-border rounded w-1/2" />
                    <div className="h-3 bg-dark-border rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-dark-muted" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No one nearby right now</h3>
            <p className="text-dark-muted mb-4">
              {instantMode 
                ? "No users are available for immediate meetups in your area"
                : "Try adjusting your filters or check back later"
              }
            </p>
            {instantMode && (
              <Button 
                variant="outline"
                onClick={() => setInstantMode(false)}
              >
                View All Users
              </Button>
            )}
          </div>
        ) : (
          <>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onLike={() => likeUser(user.id)}
                onPass={() => passUser(user.id)}
                showInstantBadge={instantMode}
              />
            ))}
            
            {/* Load More */}
            <div className="text-center py-6">
              <Button 
                variant="outline" 
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Show More"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Safety Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-surface/95 backdrop-blur border-t border-dark-border p-4">
        <SafetyIndicator />
      </div>
    </div>
  );
}
