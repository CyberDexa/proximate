"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Eye, 
  Camera, 
  Smartphone, 
  FileText, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Download,
  Trash2
} from 'lucide-react'
import DiscreetMode from '@/components/privacy/discreet-mode'
import PhotoProtection from '@/components/privacy/photo-protection'
import AppDisguise from '@/components/privacy/app-disguise'

interface PrivacySettings {
  discreet: Record<string, unknown>
  photo: Record<string, unknown>
  disguise: Record<string, unknown>
}

export default function PrivacyDashboard() {
  const [settings, setSettings] = useState<PrivacySettings>({
    discreet: {},
    photo: {},
    disguise: {}
  })
  const [activeTab, setActiveTab] = useState('overview')

  // Mock user ID - in real app, get from session
  const userId = 'user_123'

  const handleSettingsChange = (type: keyof PrivacySettings, newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      [type]: newSettings
    }))
  }

  const exportData = async () => {
    try {
      const response = await fetch('/api/privacy/data-request?type=export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `proximeet_data_export_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const requestDeletion = async () => {
    if (!confirm('Are you sure you want to request account deletion? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/privacy/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'requestDeletion' })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Deletion request initiated. Confirmation code: ${data.confirmationCode}`)
      }
    } catch (error) {
      console.error('Deletion request failed:', error)
      alert('Deletion request failed. Please try again.')
    }
  }

  const getPrivacyScore = (): number => {
    let score = 0
    let maxScore = 0

    // Discreet mode scoring
    maxScore += 20
    if (settings.discreet.hiddenMode) score += 5
    if (settings.discreet.invisibleBrowsing) score += 5
    if (settings.discreet.hideFromContacts) score += 5
    if (settings.discreet.workLocation || settings.discreet.homeLocation) score += 5

    // Photo protection scoring
    maxScore += 20
    if (settings.photo.autoBlurEnabled) score += 5
    if (settings.photo.watermarkEnabled) score += 5
    if (settings.photo.screenshotDetection) score += 5
    if (settings.photo.exifRemoval) score += 5

    // App disguise scoring
    maxScore += 10
    if (settings.disguise.disguiseEnabled) score += 5
    if (settings.disguise.lockEnabled) score += 3
    if (settings.disguise.biometricEnabled) score += 2

    return Math.round((score / maxScore) * 100) || 0
  }

  const privacyScore = getPrivacyScore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-purple-100">Privacy & Discretion Center</h1>
          </div>
          <p className="text-purple-300 max-w-2xl mx-auto">
            Comprehensive privacy controls for maximum discretion and safety on ProxiMeet
          </p>
        </div>

        {/* Privacy Score Overview */}
        <Card className="border-purple-900/20 bg-gradient-to-br from-purple-950/30 to-purple-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-100">{privacyScore}%</span>
                </div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-purple-400 border-t-transparent transform transition-transform duration-1000"
                  style={{ 
                    transform: `rotate(${privacyScore * 3.6}deg)`,
                    background: `conic-gradient(#a855f7 0deg, #a855f7 ${privacyScore * 3.6}deg, transparent ${privacyScore * 3.6}deg)`
                  }}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-100">Privacy Protection Score</h3>
                <p className="text-purple-300">
                  {privacyScore >= 80 ? 'Excellent' : 
                   privacyScore >= 60 ? 'Good' : 
                   privacyScore >= 40 ? 'Fair' : 'Needs Improvement'} privacy protection
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <Badge variant="secondary" className="bg-purple-950/50 text-purple-300 border-purple-800/30">
                    <Eye className="h-3 w-3 mr-1" />
                    Discreet Mode
                  </Badge>
                  <p className="text-xs text-purple-400 mt-1">
                    {settings.discreet.hiddenMode ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-purple-950/50 text-purple-300 border-purple-800/30">
                    <Camera className="h-3 w-3 mr-1" />
                    Photo Shield
                  </Badge>
                  <p className="text-xs text-purple-400 mt-1">
                    {settings.photo.autoBlurEnabled ? 'Protected' : 'Unprotected'}
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-purple-950/50 text-purple-300 border-purple-800/30">
                    <Smartphone className="h-3 w-3 mr-1" />
                    App Disguise
                  </Badge>
                  <p className="text-xs text-purple-400 mt-1">
                    {settings.disguise.disguiseEnabled ? 'Disguised' : 'Normal'}
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-purple-950/50 text-purple-300 border-purple-800/30">
                    <FileText className="h-3 w-3 mr-1" />
                    Data Control
                  </Badge>
                  <p className="text-xs text-purple-400 mt-1">Ready</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Privacy Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 bg-slate-800/50 border border-purple-900/20">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="discreet"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Discreet Mode
            </TabsTrigger>
            <TabsTrigger 
              value="photos"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Photo Protection
            </TabsTrigger>
            <TabsTrigger 
              value="disguise"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              App Disguise
            </TabsTrigger>
            <TabsTrigger 
              value="data"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Data Rights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="border-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-100">Quick Privacy Actions</CardTitle>
                  <CardDescription className="text-purple-300">
                    Common privacy controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-600/30 text-purple-300 hover:bg-purple-950/30"
                    onClick={() => setActiveTab('discreet')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Enable Discreet Mode
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-600/30 text-purple-300 hover:bg-purple-950/30"
                    onClick={() => setActiveTab('photos')}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Protect Photos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-600/30 text-purple-300 hover:bg-purple-950/30"
                    onClick={() => setActiveTab('disguise')}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Disguise App
                  </Button>
                </CardContent>
              </Card>

              {/* Privacy Tips */}
              <Card className="border-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-100">Privacy Tips</CardTitle>
                  <CardDescription className="text-purple-300">
                    Maximize your privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-purple-300">Enable auto-blur for photos</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-purple-300">Set location exclusion zones</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-purple-300">Use app disguise features</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-purple-300">Regular data exports recommended</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-100">Recent Activity</CardTitle>
                  <CardDescription className="text-purple-300">
                    Privacy-related events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm text-purple-300">
                      <span className="text-emerald-400">✓</span> Privacy settings loaded
                    </div>
                    <div className="text-sm text-purple-300">
                      <span className="text-blue-400">ℹ</span> EXIF data removed from 3 photos
                    </div>
                    <div className="text-sm text-purple-300">
                      <span className="text-amber-400">⚠</span> Screenshot attempt detected
                    </div>
                    <div className="text-sm text-purple-300">
                      <span className="text-emerald-400">✓</span> Location data encrypted
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discreet">
            <DiscreetMode 
              userId={userId}
              onSettingsChange={(settings) => handleSettingsChange('discreet', settings)}
            />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoProtection 
              userId={userId}
              onSettingsChange={(settings) => handleSettingsChange('photo', settings)}
            />
          </TabsContent>

          <TabsContent value="disguise">
            <AppDisguise 
              userId={userId}
              onSettingsChange={(settings) => handleSettingsChange('disguise', settings)}
            />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data Export */}
              <Card className="border-purple-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Download className="h-5 w-5 text-purple-400" />
                    Export Your Data
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    Download all your ProxiMeet data (GDPR/CCPA compliant)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-purple-300">
                    Get a complete export of your profile, messages, matches, and preferences.
                  </p>
                  <Button 
                    onClick={exportData}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>

              {/* Account Deletion */}
              <Card className="border-red-900/20 bg-gradient-to-br from-red-950/30 to-red-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-100">
                    <Trash2 className="h-5 w-5 text-red-400" />
                    Delete Account
                  </CardTitle>
                  <CardDescription className="text-red-300">
                    Permanently delete your ProxiMeet account and all data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/30">
                    <p className="text-sm text-red-200">
                      <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                  <Button 
                    onClick={requestDeletion}
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Request Account Deletion
                  </Button>
                </CardContent>
              </Card>

              {/* Data Retention Policy */}
              <Card className="border-purple-900/20 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-purple-100">Data Retention Policy</CardTitle>
                  <CardDescription className="text-purple-300">
                    How long we keep your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-100 mb-2">Automatic Deletion</h4>
                      <ul className="space-y-1 text-sm text-purple-300">
                        <li>• Messages: 90 days after last activity</li>
                        <li>• Location data: 24 hours after encounter</li>
                        <li>• Temporary photos: 7 days</li>
                        <li>• Chat history: 30 days inactive</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-100 mb-2">Manual Control</h4>
                      <ul className="space-y-1 text-sm text-purple-300">
                        <li>• Profile data: Until you delete</li>
                        <li>• Photos: Until manually removed</li>
                        <li>• Preferences: Until account deletion</li>
                        <li>• Safety reports: 1 year for safety</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
