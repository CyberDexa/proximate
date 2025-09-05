'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Shield, Camera, Heart, Settings, UserCheck } from 'lucide-react';

// Step components
import IdentityVerification from '@/components/profile/identity-verification';
import IntentionsAvailability from '@/components/profile/intentions-availability';
import PreferencesBoundaries from '@/components/profile/preferences-boundaries';
import PhotoUpload from '@/components/profile/photo-upload';
import SafetySetup from '@/components/profile/safety-setup';

interface ProfileData {
  identityVerified: boolean;
  verificationPhotos: string[];
  intentions: string[];
  availability: string[];
  preferredMeetupTime: string;
  interestedIn: string[];
  kinks: string[];
  boundaries: string[];
  dealBreakers: string[];
  photos: string[];
  privatePhotos: string[];
  blurUntilMatch: boolean;
  trustedContact: string;
  enableLocationSharing: boolean;
  safeWord: string;
  consentPreferences: string[];
}

const steps = [
  {
    id: 1,
    title: 'Identity Verification',
    description: 'Verify your identity for a safer community',
    icon: Shield,
    component: IdentityVerification
  },
  {
    id: 2,
    title: 'Intentions & Availability',
    description: 'What are you looking for and when?',
    icon: Heart,
    component: IntentionsAvailability
  },
  {
    id: 3,
    title: 'Preferences & Boundaries',
    description: 'Set your preferences and boundaries',
    icon: Settings,
    component: PreferencesBoundaries
  },
  {
    id: 4,
    title: 'Photos',
    description: 'Add your photos with privacy controls',
    icon: Camera,
    component: PhotoUpload
  },
  {
    id: 5,
    title: 'Safety Setup',
    description: 'Configure safety features for secure meetups',
    icon: UserCheck,
    component: SafetySetup
  }
];

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    identityVerified: false,
    verificationPhotos: [],
    intentions: [],
    availability: [],
    preferredMeetupTime: '',
    interestedIn: [],
    kinks: [],
    boundaries: [],
    dealBreakers: [],
    photos: [],
    privatePhotos: [],
    blurUntilMatch: false,
    trustedContact: '',
    enableLocationSharing: false,
    safeWord: '',
    consentPreferences: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Validate basic requirements before submission
      if (profileData.intentions.length === 0) {
        setSubmitError('Please select at least one intention before completing your profile.');
        return;
      }
      
      console.log('Starting profile submission...');
      console.log('Current profile data:', {
        intentions: profileData.intentions,
        interestedIn: profileData.interestedIn,
        photos: profileData.photos?.length || 0,
        hasBasicInfo: !!(profileData.intentions.length)
      });
      
      // Final submission
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log('Submitting profile data:', profileData);
      
      // Submit profile data
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        console.log('Profile created successfully!');
        // Redirect to profile page to show saved information
        window.location.href = '/profile';
      } else {
        setSubmitError(result.error || 'Failed to create profile');
        console.error('Failed to create profile:', result);
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfileData = (updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-400">
            Help us create a safe and authentic experience for everyone
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id === currentStep
                      ? 'text-purple-400'
                      : step.id < currentStep
                      ? 'text-green-400'
                      : 'text-gray-600'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                      step.id === currentStep
                        ? 'border-purple-400 bg-purple-400/10'
                        : step.id < currentStep
                        ? 'border-green-400 bg-green-400/10'
                        : 'border-gray-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center max-w-16">
                    {step.title.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {currentStepData && <currentStepData.icon className="w-6 h-6" />}
              <span>{currentStepData?.title}</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              {currentStepData?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={profileData}
                onUpdate={updateProfileData}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/discover'}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <span>
                {isSubmitting 
                  ? 'Saving...' 
                  : currentStep === steps.length 
                    ? 'Complete Profile' 
                    : 'Next'
                }
              </span>
              {currentStep < steps.length && !isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-red-400 mt-0.5">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-300">Error</h3>
                <p className="text-sm text-red-400 mt-1">{submitError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitError(null)}
                  className="mt-2 border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Safety Notice */}
        <div className="mt-8 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-300">Your Safety Matters</h3>
              <p className="text-sm text-gray-400 mt-1">
                All information is encrypted and protected. Only share what you're comfortable with,
                and remember that consent can be withdrawn at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
