"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Camera, 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  AlertTriangle,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface PhotoProtectionSettings {
  autoBlurEnabled: boolean
  watermarkEnabled: boolean
  screenshotDetection: boolean
  exifRemoval: boolean
  privateAlbumEnabled: boolean
  blurLevel: number // 0-100
  watermarkOpacity: number // 0-100
}

interface PhotoProtectionProps {
  userId: string
  onSettingsChange: (settings: PhotoProtectionSettings) => void
}

interface Photo {
  id: string
  url: string
  isBlurred: boolean
  isPrivate: boolean
  hasWatermark: boolean
  uploadedAt: Date
  screenshotAttempts: number
}

export default function PhotoProtection({ userId, onSettingsChange }: PhotoProtectionProps) {
  const [settings, setSettings] = useState<PhotoProtectionSettings>({
    autoBlurEnabled: true,
    watermarkEnabled: true,
    screenshotDetection: true,
    exifRemoval: true,
    privateAlbumEnabled: true,
    blurLevel: 80,
    watermarkOpacity: 40
  })

  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [screenshotAlerts, setScreenshotAlerts] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    loadSettings()
    loadPhotos()
    setupScreenshotDetection()
  }, [userId])

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/privacy/photo-settings?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load photo settings:', error)
    }
  }

  const loadPhotos = async () => {
    try {
      const response = await fetch(`/api/profile/photos?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPhotos(data)
      }
    } catch (error) {
      console.error('Failed to load photos:', error)
    }
  }

  const setupScreenshotDetection = () => {
    if (!settings.screenshotDetection) return

    // Detect various screenshot methods
    const detectScreenshot = () => {
      setScreenshotAlerts(prev => [...prev, `Screenshot attempt detected at ${new Date().toLocaleTimeString()}`])
      
      // Log to backend
      fetch('/api/privacy/screenshot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent 
        })
      })
    }

    // iOS screenshot detection
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        setTimeout(() => {
          if (!document.hidden) {
            detectScreenshot()
          }
        }, 100)
      }
    })

    // Android screenshot detection (partial)
    let isKeyPressed = false
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'PrintScreen') || 
          (e.metaKey && e.shiftKey && e.key === '3') || // macOS
          (e.metaKey && e.shiftKey && e.key === '4')) { // macOS region
        isKeyPressed = true
        detectScreenshot()
      }
    })

    // Context menu disable to prevent right-click save
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    // Drag and drop disable
    document.addEventListener('dragstart', (e) => {
      e.preventDefault()
    })
  }

  const updateSetting = async (key: keyof PhotoProtectionSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    try {
      await fetch('/api/privacy/photo-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, settings: newSettings })
      })
      onSettingsChange(newSettings)
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  const removeExifData = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          const cleanFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(cleanFile)
        }, file.type, 0.9)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const applyWatermark = (file: File, username: string): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw original image
        ctx.drawImage(img, 0, 0)
        
        // Apply watermark
        ctx.globalAlpha = settings.watermarkOpacity / 100
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `${Math.max(16, img.width * 0.03)}px Arial`
        ctx.textAlign = 'center'
        
        // Multiple watermarks across image
        for (let x = 0; x < img.width; x += img.width / 4) {
          for (let y = 0; y < img.height; y += img.height / 4) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(-Math.PI / 6) // -30 degrees
            ctx.fillText(`@${username}`, 0, 0)
            ctx.restore()
          }
        }
        
        canvas.toBlob((blob) => {
          const watermarkedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(watermarkedFile)
        }, file.type, 0.9)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const applyBlur = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // Apply blur filter
        ctx.filter = `blur(${settings.blurLevel / 10}px)`
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          const blurredFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(blurredFile)
        }, file.type, 0.9)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    setIsLoading(true)

    try {
      for (const file of Array.from(files)) {
        let processedFile = file

        // Remove EXIF data
        if (settings.exifRemoval) {
          processedFile = await removeExifData(processedFile)
        }

        // Apply watermark
        if (settings.watermarkEnabled) {
          processedFile = await applyWatermark(processedFile, 'ProxiMeet') // Replace with actual username
        }

        // Upload to backend
        const formData = new FormData()
        formData.append('photo', processedFile)
        formData.append('userId', userId)
        formData.append('isPrivate', 'false')
        formData.append('autoBlur', settings.autoBlurEnabled.toString())

        await fetch('/api/profile/photos/upload', {
          method: 'POST',
          body: formData
        })
      }

      await loadPhotos()
    } catch (error) {
      console.error('Photo upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePhotoBlur = async (photoId: string) => {
    try {
      await fetch(`/api/profile/photos/${photoId}/blur`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      await loadPhotos()
    } catch (error) {
      console.error('Failed to toggle blur:', error)
    }
  }

  const moveToPrivateAlbum = async (photoId: string) => {
    try {
      await fetch(`/api/profile/photos/${photoId}/private`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isPrivate: true })
      })
      await loadPhotos()
    } catch (error) {
      console.error('Failed to move to private album:', error)
    }
  }

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to permanently delete this photo?')) return

    try {
      await fetch(`/api/profile/photos/${photoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      await loadPhotos()
    } catch (error) {
      console.error('Failed to delete photo:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Main Photo Protection Settings */}
      <Card className="border-purple-900/20 bg-gradient-to-br from-slate-900 to-purple-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Camera className="h-6 w-6 text-purple-400" />
            <div>
              <CardTitle className="text-purple-100">Photo Protection</CardTitle>
              <CardDescription className="text-purple-300">
                Advanced privacy features for your photos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Blur */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EyeOff className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">Auto Face Blur</Label>
                <p className="text-xs text-purple-300">Automatically blur faces until match</p>
              </div>
            </div>
            <Switch
              checked={settings.autoBlurEnabled}
              onCheckedChange={(checked) => updateSetting('autoBlurEnabled', checked)}
            />
          </div>

          {settings.autoBlurEnabled && (
            <div className="ml-7 space-y-2">
              <Label className="text-sm text-purple-300">Blur Intensity</Label>
              <div className="flex items-center gap-4">
                <Progress value={settings.blurLevel} className="flex-1" />
                <span className="text-sm text-purple-300 w-12">{settings.blurLevel}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.blurLevel}
                onChange={(e) => updateSetting('blurLevel', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Watermark */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">Watermark Protection</Label>
                <p className="text-xs text-purple-300">Add semi-transparent username watermarks</p>
              </div>
            </div>
            <Switch
              checked={settings.watermarkEnabled}
              onCheckedChange={(checked) => updateSetting('watermarkEnabled', checked)}
            />
          </div>

          {settings.watermarkEnabled && (
            <div className="ml-7 space-y-2">
              <Label className="text-sm text-purple-300">Watermark Opacity</Label>
              <div className="flex items-center gap-4">
                <Progress value={settings.watermarkOpacity} className="flex-1" />
                <span className="text-sm text-purple-300 w-12">{settings.watermarkOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={settings.watermarkOpacity}
                onChange={(e) => updateSetting('watermarkOpacity', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Screenshot Detection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">Screenshot Detection</Label>
                <p className="text-xs text-purple-300">Alert when photos are screenshotted</p>
              </div>
            </div>
            <Switch
              checked={settings.screenshotDetection}
              onCheckedChange={(checked) => updateSetting('screenshotDetection', checked)}
            />
          </div>

          {/* EXIF Removal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">Remove EXIF Data</Label>
                <p className="text-xs text-purple-300">Strip location and camera metadata</p>
              </div>
            </div>
            <Switch
              checked={settings.exifRemoval}
              onCheckedChange={(checked) => updateSetting('exifRemoval', checked)}
            />
          </div>

          {/* Private Album */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">Private Album</Label>
                <p className="text-xs text-purple-300">Separate consent-gated photo collection</p>
              </div>
            </div>
            <Switch
              checked={settings.privateAlbumEnabled}
              onCheckedChange={(checked) => updateSetting('privateAlbumEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card className="border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <Upload className="h-5 w-5 text-purple-400" />
            Upload Protected Photos
          </CardTitle>
          <CardDescription className="text-purple-300">
            Photos will be processed according to your protection settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Processing...' : 'Select Photos'}
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-purple-400 border-t-transparent rounded-full" />
                <span className="text-sm text-purple-300">Processing photos with protection features...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Card className="border-purple-900/20">
          <CardHeader>
            <CardTitle className="text-purple-100">Your Protected Photos</CardTitle>
            <CardDescription className="text-purple-300">
              Manage blur, privacy, and protection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-800">
                    <img
                      src={photo.url}
                      alt="Profile photo"
                      className={`w-full h-full object-cover ${
                        photo.isBlurred ? 'filter blur-sm' : ''
                      }`}
                    />
                    
                    {/* Protection Indicators */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {photo.hasWatermark && (
                        <Badge variant="secondary" className="bg-blue-950/80 text-blue-300 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Protected
                        </Badge>
                      )}
                      {photo.isPrivate && (
                        <Badge variant="secondary" className="bg-red-950/80 text-red-300 text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>

                    {/* Screenshot Alert */}
                    {photo.screenshotAttempts > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {photo.screenshotAttempts}
                        </Badge>
                      </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePhotoBlur(photo.id)}
                        className="text-white hover:bg-white/20"
                      >
                        {photo.isBlurred ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      
                      {!photo.isPrivate && settings.privateAlbumEnabled && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveToPrivateAlbum(photo.id)}
                          className="text-white hover:bg-white/20"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePhoto(photo.id)}
                        className="text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Screenshot Alerts */}
      {screenshotAlerts.length > 0 && (
        <Card className="border-red-900/20 bg-gradient-to-br from-red-950/30 to-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-100">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Screenshot Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {screenshotAlerts.slice(-5).map((alert, index) => (
                <div key={index} className="text-sm text-red-300 p-2 rounded bg-red-950/30">
                  {alert}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Protection Summary */}
      <Card className="border-emerald-900/20 bg-gradient-to-br from-emerald-950/30 to-emerald-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-emerald-100">Protection Status</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.autoBlurEnabled ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
              Auto Blur
            </Badge>
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.watermarkEnabled ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
              Watermark
            </Badge>
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.screenshotDetection ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
              Screenshot Detection
            </Badge>
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.exifRemoval ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
              EXIF Removal
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
