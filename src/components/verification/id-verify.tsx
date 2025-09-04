'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CreditCard, Upload, Shield, Check, X, AlertTriangle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface IdVerificationProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface UploadedDocument {
  type: 'front' | 'back';
  file: File;
  preview: string;
}

const acceptedDocuments = [
  'Driver\'s License',
  'State ID Card',
  'Passport',
  'Military ID'
];

export default function IdVerification({ onComplete, onCancel }: IdVerificationProps) {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'background_check' | 'payment' | 'success' | 'failed'>('upload');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToBackgroundCheck, setAgreeToBackgroundCheck] = useState(false);

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      const newDoc: UploadedDocument = { type, file, preview };
      
      setUploadedDocs(prev => {
        const filtered = prev.filter(doc => doc.type !== type);
        return [...filtered, newDoc];
      });
    }
  };

  const removeDocument = (type: 'front' | 'back') => {
    setUploadedDocs(prev => prev.filter(doc => doc.type !== type));
  };

  const proceedToBackgroundCheck = () => {
    if (uploadedDocs.length > 0 && selectedDocType && agreeToTerms) {
      setCurrentStep('processing');
      
      // Simulate ID processing
      setTimeout(() => {
        setCurrentStep('background_check');
      }, 3000);
    }
  };

  const proceedToPayment = () => {
    if (agreeToBackgroundCheck) {
      setCurrentStep('payment');
    }
  };

  const processPayment = () => {
    setCurrentStep('processing');
    
    // Simulate payment and background check
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate
      setCurrentStep(success ? 'success' : 'failed');
      
      if (success) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 4000);
  };

  const frontDoc = uploadedDocs.find(doc => doc.type === 'front');
  const backDoc = uploadedDocs.find(doc => doc.type === 'back');
  const canProceed = uploadedDocs.length > 0 && selectedDocType && agreeToTerms;

  // Processing State
  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Processing Verification</h3>
            <p className="text-gray-400">
              {currentStep === 'processing' && uploadedDocs.length > 0 
                ? 'Verifying your identity documents...'
                : 'Processing your background check...'
              }
            </p>
            <div className="mt-4 text-sm text-gray-500">
              This may take a few minutes
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success State
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-purple-400">Premium Verification Complete!</h3>
            <p className="text-gray-400 mb-4">
              Your identity has been verified and background check is complete. You now have access to premium features.
            </p>
            <Badge className="bg-purple-600">
              <Shield className="w-3 h-3 mr-1" />
              Premium Verified
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failed State
  if (currentStep === 'failed') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-400">Verification Failed</h3>
            <p className="text-gray-400 mb-6">
              We couldn't complete your verification. Please contact support for assistance.
            </p>
            <div className="space-y-3">
              <Button onClick={() => setCurrentStep('upload')} className="w-full bg-purple-600 hover:bg-purple-700">
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
            <h1 className="text-2xl font-bold">Premium Verification</h1>
            <p className="text-gray-400">Identity verification & background check</p>
          </div>
        </div>

        {currentStep === 'upload' && (
          <div className="space-y-6">
            {/* Document Type Selection */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Select Document Type</CardTitle>
                <CardDescription>
                  Choose the type of government-issued ID you'll be uploading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acceptedDocuments.map((docType) => (
                    <Button
                      key={docType}
                      variant={selectedDocType === docType ? "default" : "outline"}
                      className="justify-start h-auto p-4"
                      onClick={() => setSelectedDocType(docType)}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      {docType}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            {selectedDocType && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Upload {selectedDocType}</CardTitle>
                  <CardDescription>
                    Upload clear photos of both sides of your {selectedDocType.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Front Side */}
                  <div>
                    <h4 className="font-medium mb-3">Front Side</h4>
                    {!frontDoc ? (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">
                          Upload the front side of your {selectedDocType.toLowerCase()}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDocumentUpload(e, 'front')}
                          className="hidden"
                          id="front-upload"
                        />
                        <Button asChild variant="outline">
                          <label htmlFor="front-upload" className="cursor-pointer">
                            Choose File
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="aspect-[3/2] bg-gray-800 rounded-lg overflow-hidden border-2 border-green-600">
                          <img
                            src={frontDoc.preview}
                            alt="Front of ID"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center text-white">
                              <EyeOff className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-sm">Preview Blurred for Privacy</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeDocument('front')}
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Back Side (if not passport) */}
                  {selectedDocType !== 'Passport' && (
                    <div>
                      <h4 className="font-medium mb-3">Back Side</h4>
                      {!backDoc ? (
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">
                            Upload the back side of your {selectedDocType.toLowerCase()}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDocumentUpload(e, 'back')}
                            className="hidden"
                            id="back-upload"
                          />
                          <Button asChild variant="outline">
                            <label htmlFor="back-upload" className="cursor-pointer">
                              Choose File
                            </label>
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="aspect-[3/2] bg-gray-800 rounded-lg overflow-hidden border-2 border-green-600">
                            <img
                              src={backDoc.preview}
                              alt="Back of ID"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center text-white">
                                <EyeOff className="w-8 h-8 mx-auto mb-2" />
                                <span className="text-sm">Preview Blurred for Privacy</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeDocument('back')}
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Terms Agreement */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Terms & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the identity verification terms and understand that my documents
                      will be securely processed and automatically deleted after verification.
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button
              onClick={proceedToBackgroundCheck}
              disabled={!canProceed}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Proceed to Background Check
            </Button>
          </div>
        )}

        {currentStep === 'background_check' && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Background Check</CardTitle>
                <CardDescription>
                  Premium verification includes a comprehensive background check
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">What's Included:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Criminal record screening</li>
                    <li>• Sex offender registry check</li>
                    <li>• Identity verification</li>
                    <li>• Address verification</li>
                  </ul>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="background-terms"
                    checked={agreeToBackgroundCheck}
                    onChange={(e) => setAgreeToBackgroundCheck(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="background-terms" className="text-sm cursor-pointer">
                    I consent to a background check and understand this service costs $19.99.
                    Results are kept private and only used for safety verification.
                  </label>
                </div>

                <Button
                  onClick={proceedToPayment}
                  disabled={!agreeToBackgroundCheck}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Continue to Payment - $19.99
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>
                  Complete your premium verification purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>Premium Verification</span>
                    <span className="font-semibold">$19.99</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Identity verification + background check
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry</label>
                      <Input
                        placeholder="MM/YY"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVC</label>
                      <Input
                        placeholder="123"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={processPayment}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Complete Payment - $19.99
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-300">Security & Privacy</h3>
              <p className="text-sm text-gray-400 mt-1">
                All documents are encrypted during transmission and processing. Personal information
                is automatically deleted after verification. Background checks are conducted by
                certified third-party services and results are kept strictly confidential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
