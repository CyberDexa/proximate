'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Lock, Eye, EyeOff, Star, X, Shield, AlertTriangle } from 'lucide-react';

interface PhotoPrivacyProps {
  publicPhotos: string[];
  privatePhotos: string[];
  blurUntilMatch: boolean;
  onPublicPhotosChange: (photos: string[]) => void;
  onPrivatePhotosChange: (photos: string[]) => void;
  onBlurSettingChange: (blur: boolean) => void;
}

interface PhotoItem {
  id: string;
  url: string;
  isPrimary: boolean;
  isPrivate: boolean;
}

export default function PhotoPrivacy({
  publicPhotos,
  privatePhotos,
  blurUntilMatch,
  onPublicPhotosChange,
  onPrivatePhotosChange,
  onBlurSettingChange
}: PhotoPrivacyProps) {
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, isPrivate = false) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    try {
      const newPhotoUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create a preview URL (in production, upload to secure server)
        const url = URL.createObjectURL(file);
        newPhotoUrls.push(url);
      }
      
      if (isPrivate) {
        onPrivatePhotosChange([...privatePhotos, ...newPhotoUrls]);
      } else {
        onPublicPhotosChange([...publicPhotos, ...newPhotoUrls]);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (photoUrl: string, isPrivate: boolean) => {
    if (isPrivate) {
      onPrivatePhotosChange(privatePhotos.filter(url => url !== photoUrl));
    } else {
      onPublicPhotosChange(publicPhotos.filter(url => url !== photoUrl));
    }
  };

  const setPrimaryPhoto = (photoUrl: string) => {
    // Move selected photo to first position
    const otherPhotos = publicPhotos.filter(url => url !== photoUrl);
    onPublicPhotosChange([photoUrl, ...otherPhotos]);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Photo Privacy Settings</span>
          </CardTitle>
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
              onCheckedChange={onBlurSettingChange}
            />
          </div>

          {blurUntilMatch && (
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Eye className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium">How Photo Blurring Works:</p>
                  <ul className="text-xs text-gray-400 mt-1 space-y-1">
                    <li>• Your photos appear blurred in discovery</li>
                    <li>• Photos become clear when you both like each other</li>
                    <li>• Body and background are still visible</li>
                    <li>• Increases privacy and reduces superficial swiping</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Public Photos */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Public Photos</span>
            <Badge variant="secondary" className={publicPhotos.length < 2 ? 'bg-red-900/20 text-red-300' : ''}>
              {publicPhotos.length}/6 {publicPhotos.length < 2 ? '(Need 2 minimum)' : ''}
            </Badge>
          </CardTitle>
          <CardDescription>
            These photos will be visible in discovery {blurUntilMatch ? '(blurred until match)' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {publicPhotos.map((photoUrl, index) => (
              <div key={photoUrl} className="relative group">
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={photoUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
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
                        <span className="text-xs">Preview blurred</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Photo Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {index !== 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryPhoto(photoUrl)}
                      title="Set as primary"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(photoUrl, false)}
                    title="Remove photo"
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
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>You need at least 2 public photos to complete your profile</span>
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
          {privatePhotos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No private photos added yet</p>
              <p className="text-sm">These are only shared after matching with mutual consent</p>
            </div>
          ) : (
            /* Private Photo Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {privatePhotos.map((photoUrl, index) => (
                <div key={photoUrl} className="relative group">
                  <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden border-2 border-red-600">
                    <img
                      src={photoUrl}
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
                      onClick={() => removePhoto(photoUrl, true)}
                      title="Remove private photo"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload Button */}
          {privatePhotos.length < 10 && (
            <div className="aspect-square max-w-xs border-2 border-dashed border-red-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors">
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
                <span className="text-sm text-red-400">Add Private Photo</span>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Guidelines */}
      <Card className="bg-purple-900/20 border-purple-800">
        <CardHeader>
          <CardTitle className="text-purple-300">📸 Photo Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-400 mb-2">✓ Do</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use recent photos (within 6 months)</li>
                <li>• Show your face clearly in at least one photo</li>
                <li>• Use good lighting</li>
                <li>• Include full body shots</li>
                <li>• Be authentic and genuine</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-400 mb-2">✗ Don't</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use group photos as primary</li>
                <li>• Heavily filter or edit photos</li>
                <li>• Include other people's faces</li>
                <li>• Use old or misleading photos</li>
                <li>• Upload explicit content to public photos</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              <strong>Privacy Protection:</strong> All photos are watermarked to prevent misuse. 
              Private photos require explicit mutual consent before sharing.
            </p>
          </div>
        </CardContent>
      </Card>

      {uploading && (
        <div className="text-center text-purple-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
          Uploading photos...
        </div>
      )}
    </div>
  );
}
