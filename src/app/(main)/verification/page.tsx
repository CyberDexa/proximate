'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Camera, CreditCard, Check, AlertTriangle, Crown } from 'lucide-react';

// Import verification components
import PhotoVerification from '@/components/verification/photo-verify';
import IdVerification from '@/components/verification/id-verify';

interface VerificationStatus {
  basic: boolean;
  photo: boolean;
  premium: boolean;
}

const verificationTiers = [
  {
    id: 'basic',
    title: 'Basic Verification',
    description: 'Email and phone verification',
    icon: Shield,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20 border-blue-800',
    features: [
      'Email verification',
      'Phone number verification', 
      'Basic profile badge'
    ],
    required: true,
    price: 'Free'
  },
  {
    id: 'photo',
    title: 'Photo Verification',
    description: 'Real-time selfie verification',
    icon: Camera,
    color: 'text-green-400',
    bgColor: 'bg-green-900/20 border-green-800',
    features: [
      'Live selfie verification',
      'AI photo comparison',
      'Anti-catfish protection',
      'Blue verification badge'
    ],
    required: false,
    price: 'Free'
  },
  {
    id: 'premium',
    title: 'Premium Verification',
    description: 'Background check and identity verification',
    icon: Crown,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20 border-purple-800',
    features: [
      'Background check',
      'Criminal record screening',
      'Identity document verification',
      'Gold verification badge',
      'Priority in discovery',
      'Enhanced safety features'
    ],
    required: false,
    price: '$19.99'
  }
];

export default function VerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    basic: false,
    photo: false,
    premium: false
  });
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [showPhotoVerification, setShowPhotoVerification] = useState(false);
  const [showIdVerification, setShowIdVerification] = useState(false);

  const handleTierStart = (tierId: string) => {
    setCurrentTier(tierId);
    
    if (tierId === 'photo') {
      setShowPhotoVerification(true);
    } else if (tierId === 'premium') {
      setShowIdVerification(true);
    }
  };

  const handleVerificationComplete = (tierId: string) => {
    setVerificationStatus(prev => ({
      ...prev,
      [tierId]: true
    }));
    setCurrentTier(null);
    setShowPhotoVerification(false);
    setShowIdVerification(false);
  };

  const getVerificationProgress = () => {
    const completed = Object.values(verificationStatus).filter(Boolean).length;
    return (completed / verificationTiers.length) * 100;
  };

  const getTrustScore = () => {
    let score = 0;
    if (verificationStatus.basic) score += 3;
    if (verificationStatus.photo) score += 4;
    if (verificationStatus.premium) score += 3;
    return score;
  };

  // Show verification flow if in progress
  if (showPhotoVerification) {
    return (
      <PhotoVerification
        onComplete={() => handleVerificationComplete('photo')}
        onCancel={() => setShowPhotoVerification(false)}
      />
    );
  }

  if (showIdVerification) {
    return (
      <IdVerification
        onComplete={() => handleVerificationComplete('premium')}
        onCancel={() => setShowIdVerification(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verification Center</h1>
          <p className="text-gray-400">
            Build trust and safety in the ProxiMeet community
          </p>
        </div>

        {/* Trust Score */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Trust Score</span>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-purple-400">
                  {getTrustScore()}/10
                </div>
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </CardTitle>
            <CardDescription>
              Higher trust scores increase your visibility and matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(getVerificationProgress())}% Complete</span>
              </div>
              <Progress value={getVerificationProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Verification Tiers */}
        <div className="space-y-6">
          {verificationTiers.map((tier) => {
            const Icon = tier.icon;
            const isCompleted = verificationStatus[tier.id as keyof VerificationStatus];
            const isInProgress = currentTier === tier.id;
            
            return (
              <Card
                key={tier.id}
                className={`border-2 transition-all ${
                  isCompleted 
                    ? tier.bgColor
                    : isInProgress
                    ? 'border-purple-600 bg-purple-900/10'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${isCompleted ? tier.color : 'text-gray-400'}`} />
                      <div>
                        <span className={isCompleted ? 'text-white' : 'text-gray-300'}>
                          {tier.title}
                        </span>
                        {tier.required && (
                          <Badge variant="secondary" className="ml-2 bg-red-900/20 text-red-300">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold text-green-400">{tier.price}</div>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription className={isCompleted ? 'text-gray-300' : 'text-gray-400'}>
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className={`w-4 h-4 ${isCompleted ? tier.color : 'text-gray-500'}`} />
                          <span className={`text-sm ${isCompleted ? 'text-gray-300' : 'text-gray-400'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {isCompleted ? (
                        <div className="flex items-center space-x-2 text-green-400">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Verification Complete</span>
                        </div>
                      ) : isInProgress ? (
                        <div className="flex items-center space-x-2 text-purple-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                          <span>Verification in progress...</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleTierStart(tier.id)}
                          className={`w-full ${
                            tier.id === 'premium'
                              ? 'bg-purple-600 hover:bg-purple-700'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          disabled={tier.id === 'photo' && !verificationStatus.basic}
                        >
                          {tier.id === 'basic' ? 'Start Basic Verification' :
                           tier.id === 'photo' ? 'Start Photo Verification' :
                           'Start Premium Verification'}
                        </Button>
                      )}
                    </div>

                    {/* Prerequisites */}
                    {tier.id === 'photo' && !verificationStatus.basic && (
                      <div className="flex items-start space-x-2 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                          <div className="text-yellow-300 font-medium">Prerequisite Required</div>
                          <div className="text-sm text-gray-400">
                            Complete Basic Verification first
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="bg-gray-900 border-gray-800 mt-8">
          <CardHeader>
            <CardTitle>Why Verify Your Profile?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">For You</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Higher match rates with verified users</li>
                  <li>• Increased visibility in discovery</li>
                  <li>• Access to exclusive verified-only features</li>
                  <li>• Enhanced safety and trust</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">For Community</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Reduces fake profiles and catfishing</li>
                  <li>• Creates safer meetup environment</li>
                  <li>• Builds trust between members</li>
                  <li>• Improves overall experience for everyone</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-300">Your Privacy is Protected</h3>
              <p className="text-sm text-gray-400 mt-1">
                All verification data is encrypted and stored securely. Personal information is
                automatically deleted after verification. We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
