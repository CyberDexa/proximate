'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ExternalLink, Shield, X } from 'lucide-react';

interface AgeWarningProps {
  isOpen: boolean;
  onConfirm: () => void;
  onExit: () => void;
}

export default function AgeWarning({ isOpen, onConfirm, onExit }: AgeWarningProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  if (!isOpen) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollTop > 50) {
      setHasScrolled(true);
    }
  };

  const minorResources = [
    {
      name: "Crisis Text Line",
      url: "https://www.crisistextline.org",
      description: "Text HOME to 741741"
    },
    {
      name: "National Suicide Prevention Lifeline",
      url: "https://suicidepreventionlifeline.org",
      description: "Call 988"
    },
    {
      name: "LGBTQ National Hotline",
      url: "https://www.lgbtqnationalhotline.org",
      description: "1-888-843-4564"
    },
    {
      name: "Teen Helpline",
      url: "https://www.teenhelpline.org",
      description: "Support for teens in crisis"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto border-destructive/20 bg-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-destructive">
            ⚠️ ADULT CONTENT WARNING ⚠️
          </CardTitle>
          
          <div className="text-muted-foreground">
            <p className="text-lg font-semibold">
              This application is exclusively for adults (18+) and contains explicit sexual content.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div 
            className="max-h-60 overflow-y-auto pr-2 space-y-4 text-sm text-muted-foreground"
            onScroll={handleScroll}
          >
            <div className="bg-muted/50 p-4 rounded-lg border border-muted">
              <h3 className="font-semibold text-foreground mb-2">⚠️ Legal Disclaimer</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>You must be 18 or older to access this content</li>
                <li>This app facilitates adult casual encounters and hookups</li>
                <li>Content may include explicit sexual material</li>
                <li>Use is prohibited where adult content is illegal</li>
                <li>By continuing, you confirm legal right to access adult material</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-muted">
              <h3 className="font-semibold text-foreground mb-2">🔒 Privacy & Safety</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>All users must verify they are 18+</li>
                <li>Consent education is mandatory</li>
                <li>Built-in safety features and emergency protocols</li>
                <li>Zero tolerance for harassment or abuse</li>
                <li>Secure, private, and discreet by design</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Resources for Minors
              </h3>
              <p className="mb-3 text-blue-300">
                If you are under 18, please exit now and consider these resources:
              </p>
              <div className="space-y-2">
                {minorResources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 bg-blue-500/5 rounded border border-blue-500/10 hover:bg-blue-500/10 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-blue-400">{resource.name}</div>
                      <div className="text-xs text-blue-300">{resource.description}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onExit}
              className="flex-1 border-muted-foreground/20 hover:bg-muted/10"
            >
              <X className="w-4 h-4 mr-2" />
              I'm Under 18 - Exit
            </Button>
            
            <Button
              onClick={onConfirm}
              disabled={!hasScrolled}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Shield className="w-4 h-4 mr-2" />
              I'm 18+ - Continue
            </Button>
          </div>

          {!hasScrolled && (
            <p className="text-xs text-muted-foreground text-center">
              Please scroll through the disclaimer above to continue
            </p>
          )}

          <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
            <p>
              By clicking "I'm 18+ - Continue", you confirm that you are at least 18 years old,
              have the legal right to access adult content in your jurisdiction, and understand
              the nature of this adult-oriented application.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
