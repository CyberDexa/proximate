'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, RotateCcw, Check, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import Webcam from 'react-webcam';

interface PhotoVerificationProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface VerificationStep {
  id: string;
  instruction: string;
  description: string;
  completed: boolean;
}

const verificationSteps: VerificationStep[] = [
  {
    id: 'front_face',
    instruction: 'Look directly at the camera',
    description: 'Face the camera with a neutral expression',
    completed: false
  },
  {
    id: 'turn_left',
    instruction: 'Turn your head left',
    description: 'Slowly turn your head to the left side',
    completed: false
  },
  {
    id: 'turn_right',
    instruction: 'Turn your head right',
    description: 'Slowly turn your head to the right side',
    completed: false
  },
  {
    id: 'smile',
    instruction: 'Smile naturally',
    description: 'Give a natural, genuine smile',
    completed: false
  }
];

export default function PhotoVerification({ onComplete, onCancel }: PhotoVerificationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'in_progress' | 'processing' | 'success' | 'failed'>('in_progress');
  const [showCamera, setShowCamera] = useState(true);
  const webcamRef = useRef<Webcam>(null);

  const currentStep = verificationSteps[currentStepIndex];
  const isLastStep = currentStepIndex === verificationSteps.length - 1;

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsCapturing(true);
      setCapturedPhotos(prev => [...prev, imageSrc]);
      
      // Simulate AI processing
      setTimeout(() => {
        setIsCapturing(false);
        if (isLastStep) {
          processVerification();
        } else {
          setCurrentStepIndex(prev => prev + 1);
        }
      }, 1500);
    }
  };

  const processVerification = () => {
    setVerificationStatus('processing');
    setShowCamera(false);
    
    // Simulate AI verification process
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() > 0.1;
      setVerificationStatus(success ? 'success' : 'failed');
      
      if (success) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 3000);
  };

  const retryVerification = () => {
    setCurrentStepIndex(0);
    setCapturedPhotos([]);
    setVerificationStatus('in_progress');
    setShowCamera(true);
  };

  const videoConstraints = {
    width: 480,
    height: 640,
    facingMode: "user"
  };

  if (verificationStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Processing Verification</h3>
            <p className="text-gray-400">
              Our AI is analyzing your photos to ensure authenticity...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-green-400">Verification Successful!</h3>
            <p className="text-gray-400 mb-4">
              Your photo has been verified. You'll now receive a blue verification badge.
            </p>
            <Badge className="bg-blue-600">
              <Check className="w-3 h-3 mr-1" />
              Photo Verified
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-400">Verification Failed</h3>
            <p className="text-gray-400 mb-6">
              We couldn't verify your photos. This might be due to poor lighting or image quality.
            </p>
            <div className="space-y-3">
              <Button onClick={retryVerification} className="w-full bg-purple-600 hover:bg-purple-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={onCancel} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button onClick={onCancel} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Photo Verification</h1>
            <p className="text-gray-400">Step {currentStepIndex + 1} of {verificationSteps.length}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex space-x-2 mb-3">
            {verificationSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full ${
                  index < currentStepIndex
                    ? 'bg-green-600'
                    : index === currentStepIndex
                    ? 'bg-purple-600'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Step Instructions */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-purple-400" />
              <span>{currentStep.instruction}</span>
            </CardTitle>
            <CardDescription>
              {currentStep.description}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Camera Section */}
        {showCamera && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay guides */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-purple-600/50 rounded-lg"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-48 h-64 border-2 border-purple-400 rounded-full border-dashed"></div>
                    </div>
                  </div>
                </div>
                
                {/* Capture Button */}
                <div className="text-center mt-6">
                  <Button
                    onClick={capturePhoto}
                    disabled={isCapturing}
                    className="bg-purple-600 hover:bg-purple-700 w-16 h-16 rounded-full"
                  >
                    {isCapturing ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="w-6 h-6" />
                    )}
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    {isCapturing ? 'Processing...' : 'Tap to capture'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-purple-900/20 border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-300">Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Ensure good lighting on your face</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Remove sunglasses, hats, or masks</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Look directly at the camera</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Keep your phone steady while capturing</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Captured Photos Preview */}
        {capturedPhotos.length > 0 && (
          <Card className="bg-gray-900 border-gray-800 mt-6">
            <CardHeader>
              <CardTitle>Captured Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {capturedPhotos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <img src={photo} alt={`Verification ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
