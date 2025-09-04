"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustScoreProps {
  score?: number;
  className?: string;
  showDetails?: boolean;
}

interface TrustFactors {
  verificationLevel: number;
  userRatings: number;
  accountAge: number;
  responseRate: number;
}

export function TrustScore({ score, className, showDetails = false }: TrustScoreProps) {
  const [trustScore, setTrustScore] = useState(score || 0);
  const [factors, setFactors] = useState<TrustFactors>({
    verificationLevel: 0,
    userRatings: 0,
    accountAge: 0,
    responseRate: 0,
  });
  const [loading, setLoading] = useState(!score);

  useEffect(() => {
    if (!score) {
      calculateTrustScore();
    }
  }, [score]);

  const calculateTrustScore = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/trust-score');
      
      if (response.ok) {
        const data = await response.json();
        setTrustScore(data.score);
        setFactors(data.factors);
      }
    } catch (error) {
      console.error('Failed to calculate trust score:', error);
      // Set default values
      setTrustScore(50);
      setFactors({
        verificationLevel: 20,
        userRatings: 15,
        accountAge: 10,
        responseRate: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'; // Green
    if (score >= 60) return 'secondary'; // Yellow
    if (score >= 40) return 'outline'; // Orange
    return 'destructive'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Very Poor';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Check className="h-4 w-4" />;
    if (score >= 60) return <Shield className="h-4 w-4" />;
    if (score >= 40) return <AlertTriangle className="h-4 w-4" />;
    return <X className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Score display */}
      <div className="flex items-center space-x-2">
        <div className={cn("flex items-center space-x-1", getScoreColor(trustScore))}>
          {getScoreIcon(trustScore)}
          <span className="font-bold text-lg">{trustScore}</span>
        </div>
        <Badge variant={getScoreBadgeVariant(trustScore)}>
          {getScoreLabel(trustScore)}
        </Badge>
      </div>

      {/* Score breakdown (if requested) */}
      {showDetails && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Verification Level (40%)</span>
            <span className={getScoreColor(factors.verificationLevel * 2.5)}>
              {factors.verificationLevel}/40
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">User Ratings (30%)</span>
            <span className={getScoreColor(factors.userRatings * 3.33)}>
              {factors.userRatings}/30
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Account Age (15%)</span>
            <span className={getScoreColor(factors.accountAge * 6.67)}>
              {factors.accountAge}/15
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Response Rate (15%)</span>
            <span className={getScoreColor(factors.responseRate * 6.67)}>
              {factors.responseRate}/15
            </span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center font-medium">
              <span>Total Score</span>
              <span className={getScoreColor(trustScore)}>{trustScore}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Improvement suggestions */}
      {trustScore < 80 && showDetails && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-2">Improve Your Score:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            {factors.verificationLevel < 35 && (
              <li>• Complete photo and ID verification (+{40 - factors.verificationLevel} points)</li>
            )}
            {factors.userRatings < 25 && (
              <li>• Receive positive ratings from matches (+{30 - factors.userRatings} points)</li>
            )}
            {factors.responseRate < 12 && (
              <li>• Respond promptly to messages (+{15 - factors.responseRate} points)</li>
            )}
            {factors.accountAge < 12 && (
              <li>• Maintain active account over time (+{15 - factors.accountAge} points)</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
