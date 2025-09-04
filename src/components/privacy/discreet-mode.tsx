"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  MapPin, 
  Users, 
  Phone,
  Facebook,
  Building,
  Home,
  Info,
  AlertTriangle
} from 'lucide-react'

interface DiscreetModeSettings {
  hiddenMode: boolean
  invisibleBrowsing: boolean
  noReadReceipts: boolean
  hideFromContacts: boolean
  hideFromFacebook: boolean
  workLocationRadius: number
  homeLocationRadius: number
  workLocation?: { lat: number; lng: number; address: string }
  homeLocation?: { lat: number; lng: number; address: string }
  blockList: string[]
}

interface DiscreetModeProps {
  userId: string
  onSettingsChange: (settings: DiscreetModeSettings) => void
}

export default function DiscreetMode({ userId, onSettingsChange }: DiscreetModeProps) {
  const [settings, setSettings] = useState<DiscreetModeSettings>({
    hiddenMode: false,
    invisibleBrowsing: false,
    noReadReceipts: false,
    hideFromContacts: false,
    hideFromFacebook: false,
    workLocationRadius: 2, // miles
    homeLocationRadius: 1, // miles
    blockList: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [newBlockNumber, setNewBlockNumber] = useState('')

  useEffect(() => {
    loadSettings()
  }, [userId])

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/privacy/discreet-settings?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load discreet settings:', error)
    }
  }

  const updateSetting = async (key: keyof DiscreetModeSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    try {
      setIsLoading(true)
      await fetch('/api/privacy/discreet-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, settings: newSettings })
      })
      onSettingsChange(newSettings)
    } catch (error) {
      console.error('Failed to update settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setLocationRestriction = async (type: 'work' | 'home') => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Reverse geocode to get address (simplified)
        const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        
        const locationKey = type === 'work' ? 'workLocation' : 'homeLocation'
        await updateSetting(locationKey, {
          lat: latitude,
          lng: longitude,
          address
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get location. Please enable location services.')
      }
    )
  }

  const addToBlockList = async () => {
    if (!newBlockNumber.trim()) return
    
    const updatedBlockList = [...settings.blockList, newBlockNumber.trim()]
    await updateSetting('blockList', updatedBlockList)
    setNewBlockNumber('')
  }

  const removeFromBlockList = async (number: string) => {
    const updatedBlockList = settings.blockList.filter(n => n !== number)
    await updateSetting('blockList', updatedBlockList)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Discreet Mode Toggle */}
      <Card className="border-purple-900/20 bg-gradient-to-br from-slate-900 to-purple-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-400" />
            <div>
              <CardTitle className="text-purple-100">Discreet Mode</CardTitle>
              <CardDescription className="text-purple-300">
                Maximum privacy protection for your ProxiMeet activity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Switch */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-purple-950/30 border border-purple-800/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${settings.hiddenMode ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
                {settings.hiddenMode ? (
                  <EyeOff className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-purple-100">
                  {settings.hiddenMode ? 'Discreet Mode Active' : 'Standard Mode'}
                </h3>
                <p className="text-sm text-purple-300">
                  {settings.hiddenMode 
                    ? 'Your activity is hidden and protected' 
                    : 'Enable maximum privacy protection'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={settings.hiddenMode}
              onCheckedChange={(checked) => updateSetting('hiddenMode', checked)}
              disabled={isLoading}
            />
          </div>

          {settings.hiddenMode && (
            <div className="space-y-4 pl-6 border-l-2 border-purple-600/30">
              {/* Invisible Browsing */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <div>
                    <Label className="text-purple-100">Invisible Browsing</Label>
                    <p className="text-xs text-purple-300">Don't appear in other users' "viewed me" list</p>
                  </div>
                </div>
                <Switch
                  checked={settings.invisibleBrowsing}
                  onCheckedChange={(checked) => updateSetting('invisibleBrowsing', checked)}
                  disabled={isLoading}
                />
              </div>

              {/* No Read Receipts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 text-purple-400" />
                  <div>
                    <Label className="text-purple-100">No Read Receipts</Label>
                    <p className="text-xs text-purple-300">Don't show when you've read messages</p>
                  </div>
                </div>
                <Switch
                  checked={settings.noReadReceipts}
                  onCheckedChange={(checked) => updateSetting('noReadReceipts', checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact & Social Hiding */}
      <Card className="border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <Users className="h-5 w-5 text-purple-400" />
            Hide From Contacts & Social
          </CardTitle>
          <CardDescription className="text-purple-300">
            Prevent discovery by people you know
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">Hide from Phone Contacts</Label>
                <p className="text-xs text-purple-300">Won't appear to people in your contacts</p>
              </div>
            </div>
            <Switch
              checked={settings.hideFromContacts}
              onCheckedChange={(checked) => updateSetting('hideFromContacts', checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Facebook className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">Hide from Facebook Friends</Label>
                <p className="text-xs text-purple-300">Won't appear to Facebook connections</p>
              </div>
            </div>
            <Switch
              checked={settings.hideFromFacebook}
              onCheckedChange={(checked) => updateSetting('hideFromFacebook', checked)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Privacy */}
      <Card className="border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <MapPin className="h-5 w-5 text-purple-400" />
            Location Privacy
          </CardTitle>
          <CardDescription className="text-purple-300">
            Set exclusion zones around sensitive locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Work Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-400" />
              <Label className="text-purple-100">Work Location</Label>
            </div>
            
            {settings.workLocation ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/30">
                <p className="text-sm text-emerald-300">
                  Work location set: {settings.workLocation.address}
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  Hidden within {settings.workLocationRadius} miles
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-slate-300">No work location set</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocationRestriction('work')}
                className="border-purple-600/30 text-purple-300 hover:bg-purple-950/30"
              >
                Set Current Location as Work
              </Button>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm text-purple-300">Radius:</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={settings.workLocationRadius}
                  onChange={(e) => updateSetting('workLocationRadius', parseFloat(e.target.value))}
                  className="w-20 bg-slate-800/50 border-purple-600/30 text-purple-100"
                />
                <span className="text-sm text-purple-300">miles</span>
              </div>
            </div>
          </div>

          {/* Home Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-purple-400" />
              <Label className="text-purple-100">Home Location</Label>
            </div>
            
            {settings.homeLocation ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/30">
                <p className="text-sm text-emerald-300">
                  Home location set: {settings.homeLocation.address}
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  Hidden within {settings.homeLocationRadius} miles
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-slate-300">No home location set</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocationRestriction('home')}
                className="border-purple-600/30 text-purple-300 hover:bg-purple-950/30"
              >
                Set Current Location as Home
              </Button>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm text-purple-300">Radius:</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={settings.homeLocationRadius}
                  onChange={(e) => updateSetting('homeLocationRadius', parseFloat(e.target.value))}
                  className="w-20 bg-slate-800/50 border-purple-600/30 text-purple-100"
                />
                <span className="text-sm text-purple-300">miles</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Block List */}
      <Card className="border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Manual Block List
          </CardTitle>
          <CardDescription className="text-purple-300">
            Block specific phone numbers from seeing your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter phone number (e.g., +1234567890)"
              value={newBlockNumber}
              onChange={(e) => setNewBlockNumber(e.target.value)}
              className="bg-slate-800/50 border-purple-600/30 text-purple-100"
            />
            <Button 
              onClick={addToBlockList}
              className="bg-red-600 hover:bg-red-700"
            >
              Block
            </Button>
          </div>

          {settings.blockList.length > 0 && (
            <div className="space-y-2">
              <Label className="text-purple-300">Blocked Numbers:</Label>
              <div className="space-y-2">
                {settings.blockList.map((number, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-red-950/30 border border-red-800/30"
                  >
                    <span className="text-red-300">{number}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromBlockList(number)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Status Summary */}
      {settings.hiddenMode && (
        <Card className="border-emerald-900/20 bg-gradient-to-br from-emerald-950/30 to-emerald-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold text-emerald-100">Privacy Protection Active</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
                Invisible Browsing {settings.invisibleBrowsing ? '✓' : '✗'}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
                No Read Receipts {settings.noReadReceipts ? '✓' : '✗'}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
                Hide from Contacts {settings.hideFromContacts ? '✓' : '✗'}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
                Location Protected {(settings.workLocation || settings.homeLocation) ? '✓' : '✗'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
