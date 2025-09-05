'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Camera, Upload, Shield, CheckCircle, X, IdCard } from 'lucide-react';

export default function IdVerificationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState<string>('');
  const [idImage, setIdImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleDocumentTypeSelect = (type: string) => {
    setDocumentType(type);
    setStep(2);
  };

  const handleIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum 5MB allowed.');
        return;
      }
      setIdImage(file);
      setError('');
      setStep(3);
    }
  };

  const handleSelfieUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum 5MB allowed.');
        return;
      }
      setSelfieImage(file);
      setError('');
    }
  };

  const handleSubmitVerification = async () => {
    if (!idImage || !selfieImage || !documentType) {
      setError('Please complete all verification steps');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('idImage', idImage);
      formData.append('selfie', selfieImage);
      formData.append('documentType', documentType);

      const response = await fetch('/api/verify-id', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setVerificationResult(result);
        setStep(5); // Success step
        
        // Auto-redirect to profile setup after 3 seconds
        setTimeout(() => {
          router.push('/profile-setup');
        }, 3000);
      } else {
        setError(result.error || 'Verification failed');
        setStep(4); // Error step
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setStep(1);
    setDocumentType('');
    setIdImage(null);
    setSelfieImage(null);
    setError('');
    setVerificationResult(null);
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto border-orange-500/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
            <IdCard className="w-8 h-8 text-orange-500" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              Identity Verification Required
            </CardTitle>
            <p className="text-muted-foreground">
              For everyone's safety, we need to verify you're a real person over 18.
            </p>
            <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
              Mandatory for Platform Access
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Document Type Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Step 1: Choose Document Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2 border-purple-500/30 hover:border-purple-500/60"
                  onClick={() => handleDocumentTypeSelect('passport')}
                >
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <IdCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <span>Passport</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2 border-blue-500/30 hover:border-blue-500/60"
                  onClick={() => handleDocumentTypeSelect('driving_license')}
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <IdCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <span>Driving License</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex flex-col space-y-2 border-green-500/30 hover:border-green-500/60"
                  onClick={() => handleDocumentTypeSelect('national_id')}
                >
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <IdCard className="w-5 h-5 text-green-400" />
                  </div>
                  <span>National ID</span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: ID Upload */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Step 2: Upload {documentType.replace('_', ' ').toUpperCase()}
              </h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Take a clear photo of your {documentType.replace('_', ' ')}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  • Ensure all text is clearly visible
                  • Use good lighting
                  • Maximum file size: 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdUpload}
                  className="hidden"
                  id="id-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="id-upload" className="cursor-pointer">
                    Upload Document Photo
                  </label>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Selfie Upload */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-300">Document uploaded successfully</span>
              </div>
              
              <h3 className="text-lg font-semibold text-center">Step 3: Take Verification Selfie</h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Take a selfie to verify you match your ID
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  • Look directly at the camera
                  • Ensure your face is clearly visible
                  • Use good lighting
                </p>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="hidden"
                  id="selfie-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    Take Selfie
                  </label>
                </Button>
              </div>
              
              {selfieImage && (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-300">Selfie captured successfully</span>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? 'Verifying...' : 'Submit for Verification'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Error */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-400">Verification Failed</h3>
              <p className="text-muted-foreground">{error}</p>
              <div className="space-y-2">
                <Button onClick={handleRetry} variant="outline" className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleExit} variant="ghost" className="w-full">
                  Exit Platform
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-green-400">Verification Successful!</h3>
              <p className="text-muted-foreground">
                Your identity has been verified. Redirecting to profile setup...
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Confidence: {Math.round((verificationResult?.confidence || 0) * 100)}%
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && step < 4 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">{error}</div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-300 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Privacy & Security
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Your documents are encrypted and deleted after verification</li>
              <li>• Only age verification status is stored</li>
              <li>• No personal information is retained</li>
              <li>• Verification expires after 1 year for security</li>
            </ul>
          </div>

          {/* Exit option */}
          {step < 4 && (
            <div className="border-t border-border pt-4">
              <Button 
                variant="ghost" 
                onClick={handleExit}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Exit Platform
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
