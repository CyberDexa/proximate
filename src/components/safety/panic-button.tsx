"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanicButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  silent?: boolean;
  onActivate?: () => void;
}

export function PanicButton({ 
  className, 
  size = 'md', 
  silent = false,
  onActivate 
}: PanicButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);

  const HOLD_DURATION = 3000; // 3 seconds
  const PROGRESS_INTERVAL = 50; // Update every 50ms

  const startHold = () => {
    if (isActivated) return;
    
    setIsHolding(true);
    setProgress(0);

    // Progress animation
    progressTimer.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (HOLD_DURATION / PROGRESS_INTERVAL));
        return Math.min(newProgress, 100);
      });
    }, PROGRESS_INTERVAL);

    // Activation timer
    holdTimer.current = setTimeout(() => {
      activatePanic();
    }, HOLD_DURATION);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const stopHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  };

  const activatePanic = async () => {
    setIsActivated(true);
    setIsHolding(false);
    setProgress(100);

    // Strong haptic feedback for activation
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    try {
      // Send emergency alert
      const response = await fetch('/api/emergency/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'panic_button',
          silent,
          location: await getCurrentLocation(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Emergency alert failed');
      }

      onActivate?.();
    } catch (error) {
      console.error('Emergency alert failed:', error);
      // Still show activated state even if API fails
    }

    // Reset after 10 seconds
    setTimeout(() => {
      setIsActivated(false);
      setProgress(0);
    }, 10000);
  };

  const getCurrentLocation = (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        () => resolve(null),
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  };

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, []);

  const sizeClasses = {
    sm: 'h-12 w-12 text-sm',
    md: 'h-16 w-16 text-base',
    lg: 'h-20 w-20 text-lg'
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="destructive"
        size="icon"
        className={cn(
          "relative overflow-hidden select-none transition-all duration-200",
          sizeClasses[size],
          isHolding && "scale-95 shadow-2xl",
          isActivated && "bg-red-600 scale-110 shadow-2xl animate-pulse",
          "hover:bg-red-600 active:scale-95"
        )}
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={startHold}
        onTouchEnd={stopHold}
        disabled={isActivated}
      >
        {/* Progress ring */}
        {isHolding && (
          <div 
            className="absolute inset-0 border-4 border-white rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent ${100 - progress}%, white ${100 - progress}%)`
            }}
          />
        )}

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          {isActivated ? (
            <Shield className="h-6 w-6 text-white animate-pulse" />
          ) : silent ? (
            <AlertTriangle className="h-6 w-6 text-white" />
          ) : (
            <Phone className="h-6 w-6 text-white" />
          )}
        </div>

        {/* Hold indicator text */}
        {isHolding && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-1 rounded whitespace-nowrap">
            Hold to activate
          </div>
        )}
      </Button>

      {/* Status text */}
      {isActivated && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-red-400 bg-black/80 px-2 py-1 rounded whitespace-nowrap animate-pulse">
          Emergency alert sent
        </div>
      )}

      {/* Instructions */}
      {!isActivated && !isHolding && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground text-center whitespace-nowrap">
          Hold 3s for {silent ? 'silent' : 'emergency'}
        </div>
      )}
    </div>
  );
}
