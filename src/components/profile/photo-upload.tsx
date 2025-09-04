'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Lock, Eye, EyeOff, Star, X, Shield } from 'lucide-react';

interface PhotoUploadProps {
  data: any;
  onUpdate: (updates: any) => void;
}

interface Photo {
  id: string;
  url: string;
  blurredUrl?: string;
  isPrimary: boolean;
  isPrivate: boolean;
  isVerification: boolean;
}

export default function PhotoUpload({ data, onUpdate }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [blurUntilMatch, setBlurUntilMatch] = useState(data.blurUntilMatch || true);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, isPrivate = false) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create a preview URL
        const url = URL.createObjectURL(file);
        
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${i}`,
          url,
          isPrimary: photos.length === 0 && !isPrivate, // First public photo is primary
          isPrivate,
          isVerification: false
        };

        setPhotos(prev => [...prev, newPhoto]);
      }
      
      // Update parent component
      onUpdate({
        photos: photos.filter(p => !p.isPrivate).map(p => p.url),
        privatePhotos: photos.filter(p => p.isPrivate).map(p => p.url),
        blurUntilMatch
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleVerificationPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const url = URL.createObjectURL(file);
      
      const verificationPhoto: Photo = {
        id: `verification-${Date.now()}`,
        url,
        isPrimary: false,
        isPrivate: false,
        isVerification: true
      };

      setPhotos(prev => [...prev, verificationPhoto]);
      onUpdate({ verificationPhoto: url });
    } catch (error) {
      console.error('Error uploading verification photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryPhoto = (photoId: string) => {
    setPhotos(prev => prev.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId && !photo.isPrivate
    })));
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const toggleBlurSetting = (checked: boolean) => {
    setBlurUntilMatch(checked);
    onUpdate({ blurUntilMatch: checked });
  };

  const publicPhotos = photos.filter(p => !p.isPrivate && !p.isVerification);
  const privatePhotos = photos.filter(p => p.isPrivate);
  const verificationPhoto = photos.find(p => p.isVerification);

  return (
    <div className="space-y-6">
      {/* Photo Privacy Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Photo Privacy Settings</CardTitle>
          <CardDescription>
            Control how your photos are displayed to others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
            <div className="flex items-center space-x-3">
              {blurUntilMatch ? <EyeOff className="w-5 h-5 text-purple-400" /> : <Eye className="w-5 h-5 text-purple-400" />}
              <div>
                <h3 className="font-semibold text-purple-300">Blur Photos Until Match</h3>
                <p className="text-sm text-gray-400">
                  Hide your face until you both like each other
                </p>
              </div>
            </div>
            <Switch
              checked={blurUntilMatch}
              onCheckedChange={toggleBlurSetting}
            />
          </div>
        </CardContent>
      </Card>

      {/* Public Photos */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Public Photos (2-6 required)</span>
            <Badge variant="secondary">
              {publicPhotos.length}/6
            </Badge>
          </CardTitle>
          <CardDescription>
            These photos will be visible in discovery (may be blurred until match)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {publicPhotos.map((photo, index) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                  )}
                  {blurUntilMatch && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <EyeOff className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">Blurred until match</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Photo Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {!photo.isPrimary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryPhoto(photo.id)}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePhoto(photo.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Upload Button */}
            {publicPhotos.length < 6 && (
              <div className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, false)}
                  className="hidden"
                  id="public-photo-upload"
                  disabled={uploading}
                />
                <label htmlFor="public-photo-upload" className="cursor-pointer text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-400">Add Photo</span>
                </label>
              </div>
            )}
          </div>
          
          {publicPhotos.length < 2 && (
            <div className="text-center text-yellow-400 text-sm">
              You need at least 2 public photos to complete your profile
            </div>
          )}
        </CardContent>
      </Card>

      {/* Private Album */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-red-400" />
            <span>Private Album (Optional)</span>
            <Badge variant="secondary">
              {privatePhotos.length}/10
            </Badge>
          </CardTitle>
          <CardDescription>
            Share more intimate photos only after matching (mutual consent required)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Private Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {privatePhotos.map((photo, index) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden border-2 border-red-600">
                  <img
                    src={photo.url}
                    alt={`Private photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-red-400" />
                  </div>
                </div>
                
                {/* Delete Button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePhoto(photo.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Upload Button */}
            {privatePhotos.length < 10 && (
              <div className="aspect-square border-2 border-dashed border-red-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, true)}
                  className="hidden"
                  id="private-photo-upload"
                  disabled={uploading}
                />
                <label htmlFor="private-photo-upload" className="cursor-pointer text-center">
                  <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <span className="text-sm text-red-400">Add Private</span>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Photo */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Verification Photo (Required)</span>
          </CardTitle>
          <CardDescription>
            Take a real-time selfie for profile verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!verificationPhoto ? (
            <div className="border-2 border-dashed border-blue-600 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Take a clear selfie for verification. This helps prevent fake profiles.
              </p>
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleVerificationPhoto}
                className="hidden"
                id="verification-upload"
                disabled={uploading}
              />
              <Button asChild variant="outline" className="border-blue-600 text-blue-400">
                <label htmlFor="verification-upload" className="cursor-pointer">
                  Take Verification Selfie
                </label>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={verificationPhoto.url}
                  alt="Verification"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-300">Verification Photo Uploaded</h4>
                <p className="text-sm text-gray-400">
                  Your selfie will be reviewed for authenticity
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deletePhoto(verificationPhoto.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Guidelines */}
      <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
        <h4 className="font-medium text-purple-300 mb-2">📸 Photo Guidelines</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Use recent photos (within 6 months)</li>
          <li>• Show your face clearly in at least one photo</li>
          <li>• No group photos as your primary image</li>
          <li>• Nude photos should go in private album only</li>
          <li>• Verification photo must match your profile photos</li>
          <li>• All photos are watermarked to prevent misuse</li>
        </ul>
      </div>

      {uploading && (
        <div className="text-center text-purple-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
          Uploading photos...
        </div>
      )}
    </div>
  );
}
