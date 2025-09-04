'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, FileText, Users, Heart, CheckCircle } from 'lucide-react';

interface ConsentAgreementProps {
  onComplete: () => void;
  progress: number;
}

interface AgreementItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const agreementItems: AgreementItem[] = [
  {
    id: 'consent-withdrawal',
    title: 'Consent Can Be Withdrawn',
    description: 'I understand that consent can be withdrawn at any time, for any reason, and I will immediately respect when someone changes their mind.',
    icon: <Shield className="w-5 h-5" />,
    required: true
  },
  {
    id: 'respect-boundaries',
    title: 'Respect Others\' Boundaries',
    description: 'I will respect others\' stated boundaries and limits, and I will not pressure, coerce, or manipulate anyone into sexual activity.',
    icon: <Users className="w-5 h-5" />,
    required: true
  },
  {
    id: 'no-pressure',
    title: 'No Pressure or Coercion',
    description: 'I will not use pressure, guilt, manipulation, threats, or any form of coercion to obtain sexual consent from another person.',
    icon: <Heart className="w-5 h-5" />,
    required: true
  },
  {
    id: 'consensual-adults',
    title: 'Consensual Adult Activities',
    description: 'I understand this app is exclusively for consensual sexual activities between adults, and I will only engage with verified adults.',
    icon: <FileText className="w-5 h-5" />,
    required: true
  },
  {
    id: 'communication',
    title: 'Clear Communication',
    description: 'I will communicate clearly about my intentions, boundaries, and comfort levels, and encourage others to do the same.',
    icon: <Shield className="w-5 h-5" />,
    required: true
  }
];

export default function ConsentAgreement({ onComplete, progress }: ConsentAgreementProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleItemCheck = (itemId: string, checked: boolean) => {
    if (checked) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      setCheckedItems(checkedItems.filter(id => id !== itemId));
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollTop > 100) {
      setHasScrolled(true);
    }
  };

  const allRequiredChecked = agreementItems
    .filter(item => item.required)
    .every(item => checkedItems.includes(item.id));

  const canProceed = allRequiredChecked && hasScrolled;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Consent Education Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Consent Agreement</h1>
          <p className="text-muted-foreground">
            Please read and agree to these principles for safe, consensual encounters
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Community Standards & Consent Principles</CardTitle>
            <p className="text-muted-foreground">
              By checking each box below, you agree to uphold these essential principles
              that ensure a safe, respectful environment for all users.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Scrollable Agreement Content */}
            <div 
              className="max-h-96 overflow-y-auto pr-4 space-y-6 border border-muted rounded-lg p-6"
              onScroll={handleScroll}
            >
              {/* Introduction */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Our Commitment to Safety</h3>
                <p className="text-muted-foreground mb-3">
                  ProxiMeet is built on the foundation that all sexual encounters must be 
                  consensual, safe, and respectful. These principles are non-negotiable 
                  and violations will result in immediate account suspension.
                </p>
                <p className="text-muted-foreground">
                  By agreeing to these terms, you're joining a community that prioritizes 
                  mutual respect, clear communication, and everyone's right to feel safe.
                </p>
              </div>

              {/* Agreement Items */}
              <div className="space-y-4">
                {agreementItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-card border rounded-lg">
                    <div className="mt-1">
                      <Checkbox
                        id={item.id}
                        checked={checkedItems.includes(item.id)}
                        onCheckedChange={(checked: boolean) => handleItemCheck(item.id, checked)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-primary">
                          {item.icon}
                        </div>
                        <h4 className="font-semibold text-foreground">
                          {item.title}
                          {item.required && <span className="text-red-500 ml-1">*</span>}
                        </h4>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Legal Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Legal Responsibilities</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You are legally responsible for your actions and must comply with all local laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Any form of sexual assault, harassment, or non-consensual activity will be reported to authorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You must be honest about your identity, age, and STI status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Violation of these principles may result in permanent ban and legal action</span>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <h3 className="font-semibold text-blue-400 mb-3">Support Resources</h3>
                <p className="text-blue-300 text-sm mb-3">
                  If you or someone you know needs help, these resources are available 24/7:
                </p>
                <ul className="space-y-1 text-sm text-blue-300">
                  <li>• National Sexual Assault Hotline: 1-800-656-4673</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                  <li>• National Domestic Violence Hotline: 1-800-799-7233</li>
                  <li>• LGBT National Hotline: 1-888-843-4564</li>
                </ul>
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-3">
              {!hasScrolled && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Please scroll through the entire agreement above</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                {allRequiredChecked ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
                )}
                <span className={allRequiredChecked ? 'text-green-500' : 'text-muted-foreground'}>
                  All required agreements checked ({checkedItems.length}/{agreementItems.length})
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={onComplete}
              disabled={!canProceed}
              className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
            >
              {canProceed ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Consent Education
                </>
              ) : (
                'Complete All Requirements Above'
              )}
            </Button>

            {!canProceed && (
              <p className="text-center text-sm text-muted-foreground">
                You must read the full agreement and check all required items to proceed
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
