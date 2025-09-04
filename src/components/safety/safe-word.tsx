"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Shield, AlertTriangle, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafeWordProps {
  className?: string;
  onSafeWordSet?: (word: string) => void;
  onSafeWordTriggered?: () => void;
}

export function SafeWord({ 
  className, 
  onSafeWordSet,
  onSafeWordTriggered 
}: SafeWordProps) {
  const [safeWord, setSafeWord] = useState('');
  const [currentSafeWord, setCurrentSafeWord] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [confirmWord, setConfirmWord] = useState('');
  const [isTriggered, setIsTriggered] = useState(false);

  // Load existing safe word on mount
  useEffect(() => {
    loadSafeWord();
  }, []);

  const loadSafeWord = async () => {
    try {
      const response = await fetch('/api/user/safe-word');
      if (response.ok) {
        const data = await response.json();
        if (data.hasSafeWord) {
          setCurrentSafeWord('***SET***'); // Don't expose the actual word
        }
      }
    } catch (error) {
      console.error('Failed to load safe word:', error);
    }
  };

  const saveSafeWord = async () => {
    if (!safeWord.trim() || safeWord !== confirmWord) {
      return;
    }

    try {
      const response = await fetch('/api/user/safe-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ safeWord: safeWord.trim() }),
      });

      if (response.ok) {
        setCurrentSafeWord('***SET***');
        setSafeWord('');
        setConfirmWord('');
        setIsSettingUp(false);
        onSafeWordSet?.(safeWord);
      }
    } catch (error) {
      console.error('Failed to save safe word:', error);
    }
  };

  const triggerSafeWord = async () => {
    try {
      setIsTriggered(true);
      
      const response = await fetch('/api/emergency/safe-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location: await getCurrentLocation(),
        }),
      });

      if (response.ok) {
        onSafeWordTriggered?.();
        
        // Lock account temporarily
        await lockAccount();
      }
    } catch (error) {
      console.error('Failed to trigger safe word protocol:', error);
    }
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

  const lockAccount = async () => {
    try {
      await fetch('/api/user/emergency-lock', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to lock account:', error);
    }
  };

  const isWordValid = safeWord.length >= 4 && !/\s/.test(safeWord);
  const wordsMatch = safeWord === confirmWord;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status display */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-3">
          <Shield className={cn(
            "h-5 w-5",
            currentSafeWord ? "text-green-500" : "text-yellow-500"
          )} />
          <div>
            <p className="font-medium">Safe Word Protection</p>
            <p className="text-sm text-muted-foreground">
              {currentSafeWord 
                ? "Safe word is set and active" 
                : "No safe word configured"
              }
            </p>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant={currentSafeWord ? "outline" : "default"} 
              size="sm"
              onClick={() => setIsSettingUp(true)}
            >
              {currentSafeWord ? "Change" : "Set Up"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {currentSafeWord ? "Change Safe Word" : "Set Safe Word"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Explanation */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium mb-1">How it works:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>If you type this word in any chat, an immediate alert is sent</li>
                      <li>Your account is temporarily locked for safety</li>
                      <li>Support team is notified immediately</li>
                      <li>Emergency contacts are alerted (if set)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Safe word input */}
              <div className="space-y-2">
                <Label htmlFor="safeWord">Choose Safe Word</Label>
                <div className="relative">
                  <Input
                    id="safeWord"
                    type={showWord ? "text" : "password"}
                    value={safeWord}
                    onChange={(e) => setSafeWord(e.target.value)}
                    placeholder="Enter a unique word"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWord(!showWord)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showWord ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {safeWord && !isWordValid && (
                  <p className="text-xs text-red-500">
                    Word must be at least 4 characters with no spaces
                  </p>
                )}
              </div>

              {/* Confirm safe word */}
              {isWordValid && (
                <div className="space-y-2">
                  <Label htmlFor="confirmWord">Confirm Safe Word</Label>
                  <div className="relative">
                    <Input
                      id="confirmWord"
                      type={showWord ? "text" : "password"}
                      value={confirmWord}
                      onChange={(e) => setConfirmWord(e.target.value)}
                      placeholder="Type the word again"
                      className="pr-10"
                    />
                    {confirmWord && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {wordsMatch ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {confirmWord && !wordsMatch && (
                    <p className="text-xs text-red-500">Words don't match</p>
                  )}
                </div>
              )}

              {/* Save button */}
              <Button
                onClick={saveSafeWord}
                disabled={!isWordValid || !wordsMatch}
                className="w-full"
              >
                {currentSafeWord ? "Update Safe Word" : "Set Safe Word"}
              </Button>

              {/* Additional security note */}
              <div className="text-xs text-muted-foreground">
                <p>
                  Choose a word you wouldn't normally use in conversation. 
                  This word is encrypted and never shown to other users.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Emergency trigger (for testing/admin) */}
      {process.env.NODE_ENV === 'development' && currentSafeWord && (
        <div className="p-3 border-2 border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            Development Only - Test Safe Word Protocol
          </p>
          <Button
            onClick={triggerSafeWord}
            variant="destructive"
            size="sm"
            disabled={isTriggered}
          >
            {isTriggered ? "Protocol Activated" : "Test Safe Word Trigger"}
          </Button>
        </div>
      )}
    </div>
  );
}
