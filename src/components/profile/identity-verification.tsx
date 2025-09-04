'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Check, AlertTriangle } from 'lucide-react';

interface IdentityVerificationProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export default function IdentityVerification({ data, onUpdate }: IdentityVerificationProps) {
  const [idPhotoUploaded, setIdPhotoUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'verified' | 'failed'>('pending');

  const handleIdUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload process
      setVerificationStatus('processing');
      
      // In real implementation, upload to secure server
      setTimeout(() => {
        setIdPhotoUploaded(true);
        onUpdate({ idPhotoUploaded: true });
      }, 2000);
    }
  };

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload and verification
      setTimeout(() => {
        setSelfieUploaded(true);
        setVerificationStatus('verified');
        onUpdate({ 
          identityVerified: true,
          verificationPhotos: ['selfie.jpg']
        });
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Overview */}
      <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
        <h3 className="font-semibold text-purple-300 mb-2">Why We Verify Identity</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Ensures all users are 18+ adults</li>
          <li>• Reduces fake profiles and catfishing</li>
          <li>• Creates a safer community for everyone</li>
          <li>• Your ID is automatically deleted after verification</li>
        </ul>
      </div>

      {/* Step 1: ID Upload */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Step 1: Upload Photo ID</span>
            {idPhotoUploaded && <Check className="w-5 h-5 text-green-400" />}
          </CardTitle>
          <CardDescription>
            Upload a clear photo of your government-issued ID (license, passport, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!idPhotoUploaded ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Only your age will be verified. All other information is automatically blurred.
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
                    Upload ID Photo
                  </label>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300">ID photo uploaded successfully</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Verification Selfie */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Step 2: Take Verification Selfie</span>
            {selfieUploaded && <Check className="w-5 h-5 text-green-400" />}
          </CardTitle>
          <CardDescription>
            Take a clear selfie to confirm you match your ID photo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!selfieUploaded ? (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Make sure your face is clearly visible and well-lit
                </p>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="hidden"
                  id="selfie-upload"
                />
                <Button 
                  asChild 
                  variant="outline"
                  disabled={!idPhotoUploaded}
                >
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    Take Selfie
                  </label>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300">Verification selfie uploaded</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      {verificationStatus !== 'pending' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {verificationStatus === 'processing' && (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                  <span className="text-yellow-400">Processing verification...</span>
                </>
              )}
              {verificationStatus === 'verified' && (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-300">Identity verified successfully!</span>
                  <Badge variant="secondary" className="bg-green-900/20 text-green-300">
                    Verified
                  </Badge>
                </>
              )}
              {verificationStatus === 'failed' && (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">Verification failed. Please try again.</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-300 mb-2">🔒 Privacy & Security</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Your ID photo is encrypted and automatically deleted after age verification</li>
          <li>• Only your age is extracted and verified (18+)</li>
          <li>• All other personal information is permanently removed</li>
          <li>• Verification selfie is used only for profile authentication</li>
        </ul>
      </div>
    </div>
  );
}
