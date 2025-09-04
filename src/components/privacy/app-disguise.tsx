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
  Calculator, 
  Calendar, 
  Cloud, 
  Settings, 
  Lock, 
  Fingerprint,
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  Smartphone
} from 'lucide-react'

interface AppDisguiseSettings {
  disguiseEnabled: boolean
  selectedIcon: 'calculator' | 'calendar' | 'weather'
  appName: string
  lockEnabled: boolean
  biometricEnabled: boolean
  panicWipeEnabled: boolean
  lockAfterMinutes: number
  fakePassword: string
  emergencyCode: string
}

interface AppDisguiseProps {
  userId: string
  onSettingsChange: (settings: AppDisguiseSettings) => void
}

const DISGUISE_OPTIONS = [
  {
    id: 'calculator' as const,
    name: 'Calculator',
    icon: Calculator,
    description: 'Looks like a simple calculator app',
    backgroundColor: '#1f2937',
    textColor: '#ffffff'
  },
  {
    id: 'calendar' as const,
    name: 'Calendar',
    icon: Calendar,
    description: 'Appears as a calendar application',
    backgroundColor: '#dc2626',
    textColor: '#ffffff'
  },
  {
    id: 'weather' as const,
    name: 'Weather',
    icon: Cloud,
    description: 'Disguised as a weather app',
    backgroundColor: '#2563eb',
    textColor: '#ffffff'
  }
]

export default function AppDisguise({ userId, onSettingsChange }: AppDisguiseProps) {
  const [settings, setSettings] = useState<AppDisguiseSettings>({
    disguiseEnabled: false,
    selectedIcon: 'calculator',
    appName: 'Calculator',
    lockEnabled: true,
    biometricEnabled: false,
    panicWipeEnabled: false,
    lockAfterMinutes: 5,
    fakePassword: '',
    emergencyCode: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [panicConfirm, setPanicConfirm] = useState('')
  const [biometricSupported, setBiometricSupported] = useState(false)

  useEffect(() => {
    loadSettings()
    checkBiometricSupport()
  }, [userId])

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/privacy/disguise-settings?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load disguise settings:', error)
    }
  }

  const checkBiometricSupport = async () => {
    // Check if biometric authentication is available
    if ('credentials' in navigator) {
      try {
        const available = await (navigator.credentials as any).get({
          publicKey: {
            challenge: new TextEncoder().encode('test'),
            allowCredentials: [],
            timeout: 5000
          }
        }).catch(() => null)
        setBiometricSupported(!!available || 'webkitRequestFileSystem' in window) // Fallback for iOS
      } catch {
        setBiometricSupported(false)
      }
    }
  }

  const updateSetting = async (key: keyof AppDisguiseSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    try {
      setIsLoading(true)
      await fetch('/api/privacy/disguise-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, settings: newSettings })
      })
      onSettingsChange(newSettings)
      
      // Apply disguise if enabled
      if (key === 'disguiseEnabled' && value) {
        applyDisguise(newSettings)
      } else if (key === 'disguiseEnabled' && !value) {
        removeDisguise()
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyDisguise = (config: AppDisguiseSettings) => {
    try {
      const selectedOption = DISGUISE_OPTIONS.find(opt => opt.id === config.selectedIcon)
      if (!selectedOption) return

      // Update favicon
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        // Create a canvas to generate a simple icon
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          ctx.fillStyle = selectedOption.backgroundColor
          ctx.fillRect(0, 0, 32, 32)
          ctx.fillStyle = selectedOption.textColor
          ctx.font = '16px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(config.selectedIcon === 'calculator' ? '=' : 
                      config.selectedIcon === 'calendar' ? '📅' : '☁️', 16, 20)
          
          favicon.href = canvas.toDataURL()
        }
      }

      // Update page title
      document.title = config.appName

      // Update theme color for mobile browsers
      let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta')
        themeColorMeta.name = 'theme-color'
        document.head.appendChild(themeColorMeta)
      }
      themeColorMeta.content = selectedOption.backgroundColor

      // Store disguise state
      localStorage.setItem('proximeet_disguise', JSON.stringify(config))
      
    } catch (error) {
      console.error('Failed to apply disguise:', error)
    }
  }

  const removeDisguise = () => {
    try {
      // Reset to original ProxiMeet branding
      document.title = 'ProxiMeet'
      
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = '/favicon.ico'
      }

      const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
      if (themeColorMeta) {
        themeColorMeta.content = '#6B46C1' // Original purple
      }

      localStorage.removeItem('proximeet_disguise')
    } catch (error) {
      console.error('Failed to remove disguise:', error)
    }
  }

  const generateSecureCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const setupPanicWipe = async () => {
    if (panicConfirm !== 'DELETE ALL DATA') {
      alert('Please type "DELETE ALL DATA" to confirm')
      return
    }

    const emergencyCode = generateSecureCode()
    await updateSetting('emergencyCode', emergencyCode)
    await updateSetting('panicWipeEnabled', true)
    
    alert(`Emergency code: ${emergencyCode}\n\nSave this code! Entering it will permanently delete all app data.`)
    setPanicConfirm('')
  }

  const testBiometric = async () => {
    if (!biometricSupported) return

    try {
      // Simplified biometric test
      if ('credentials' in navigator) {
        alert('Biometric authentication would be triggered here')
      }
    } catch (error) {
      console.error('Biometric test failed:', error)
      alert('Biometric authentication not available')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Disguise Settings */}
      <Card className="border-purple-900/20 bg-gradient-to-br from-slate-900 to-purple-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-400" />
            <div>
              <CardTitle className="text-purple-100">App Disguise</CardTitle>
              <CardDescription className="text-purple-300">
                Hide ProxiMeet as a different app for maximum discretion
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-purple-950/30 border border-purple-800/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${settings.disguiseEnabled ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
                <Smartphone className={`h-5 w-5 ${settings.disguiseEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-purple-100">
                  {settings.disguiseEnabled ? 'Disguise Active' : 'Disguise Disabled'}
                </h3>
                <p className="text-sm text-purple-300">
                  {settings.disguiseEnabled 
                    ? `App appears as: ${settings.appName}` 
                    : 'Enable app disguise for maximum privacy'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={settings.disguiseEnabled}
              onCheckedChange={(checked) => updateSetting('disguiseEnabled', checked)}
              disabled={isLoading}
            />
          </div>

          {/* Disguise Options */}
          {settings.disguiseEnabled && (
            <div className="space-y-4 pl-6 border-l-2 border-purple-600/30">
              <Label className="text-purple-100">Choose Disguise</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DISGUISE_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      settings.selectedIcon === option.id
                        ? 'border-purple-400 bg-purple-950/50'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    onClick={() => {
                      updateSetting('selectedIcon', option.id)
                      updateSetting('appName', option.name)
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="p-2 rounded"
                        style={{ backgroundColor: option.backgroundColor }}
                      >
                        <option.icon className="h-4 w-4" style={{ color: option.textColor }} />
                      </div>
                      <span className="font-medium text-purple-100">{option.name}</span>
                    </div>
                    <p className="text-xs text-purple-300">{option.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-purple-100">Custom App Name</Label>
                <Input
                  value={settings.appName}
                  onChange={(e) => updateSetting('appName', e.target.value)}
                  placeholder="Enter custom app name"
                  className="bg-slate-800/50 border-purple-600/30 text-purple-100"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Lock */}
      <Card className="border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <Lock className="h-5 w-5 text-purple-400" />
            App Security Lock
          </CardTitle>
          <CardDescription className="text-purple-300">
            Additional protection with password and biometric locks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* App Lock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-purple-400" />
              <div>
                <Label className="text-purple-100">App Lock</Label>
                <p className="text-xs text-purple-300">Require authentication to open app</p>
              </div>
            </div>
            <Switch
              checked={settings.lockEnabled}
              onCheckedChange={(checked) => updateSetting('lockEnabled', checked)}
            />
          </div>

          {settings.lockEnabled && (
            <div className="space-y-4 pl-7">
              {/* Lock Timeout */}
              <div className="space-y-2">
                <Label className="text-purple-300">Auto-lock after inactivity</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.lockAfterMinutes}
                    onChange={(e) => updateSetting('lockAfterMinutes', parseInt(e.target.value))}
                    className="w-20 bg-slate-800/50 border-purple-600/30 text-purple-100"
                  />
                  <span className="text-sm text-purple-300">minutes</span>
                </div>
              </div>

              {/* Fake Password */}
              <div className="space-y-2">
                <Label className="text-purple-300">Fake Password (shows fake content)</Label>
                <div className="flex gap-2">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.fakePassword}
                    onChange={(e) => updateSetting('fakePassword', e.target.value)}
                    placeholder="Enter fake password"
                    className="bg-slate-800/50 border-purple-600/30 text-purple-100"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-purple-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-purple-400">
                  When this password is entered, app shows fake calculator/calendar content
                </p>
              </div>

              {/* Biometric */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-4 w-4 text-purple-400" />
                  <div>
                    <Label className="text-purple-100">Biometric Lock</Label>
                    <p className="text-xs text-purple-300">
                      {biometricSupported ? 'Use fingerprint/face ID' : 'Not supported on this device'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {biometricSupported && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={testBiometric}
                      className="text-purple-400"
                    >
                      Test
                    </Button>
                  )}
                  <Switch
                    checked={settings.biometricEnabled}
                    onCheckedChange={(checked) => updateSetting('biometricEnabled', checked)}
                    disabled={!biometricSupported}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panic Wipe */}
      <Card className="border-red-900/20 bg-gradient-to-br from-red-950/30 to-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-100">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Emergency Data Wipe
          </CardTitle>
          <CardDescription className="text-red-300">
            Instantly delete all app data in emergency situations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className="h-4 w-4 text-red-400" />
              <div>
                <Label className="text-red-100">Panic Wipe</Label>
                <p className="text-xs text-red-300">Enable emergency data deletion</p>
              </div>
            </div>
            <Switch
              checked={settings.panicWipeEnabled}
              onCheckedChange={(checked) => updateSetting('panicWipeEnabled', checked)}
            />
          </div>

          {!settings.panicWipeEnabled && (
            <div className="space-y-4 p-4 rounded-lg border border-red-800/30 bg-red-950/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <p className="text-sm text-red-200">
                    <strong>Warning:</strong> This will permanently delete ALL ProxiMeet data if emergency code is entered.
                  </p>
                  
                  <div className="space-y-2">
                    <Label className="text-red-200">Type "DELETE ALL DATA" to confirm setup:</Label>
                    <Input
                      value={panicConfirm}
                      onChange={(e) => setPanicConfirm(e.target.value)}
                      placeholder="DELETE ALL DATA"
                      className="bg-red-950/50 border-red-700/50 text-red-100"
                    />
                  </div>
                  
                  <Button
                    onClick={setupPanicWipe}
                    disabled={panicConfirm !== 'DELETE ALL DATA'}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Setup Emergency Wipe
                  </Button>
                </div>
              </div>
            </div>
          )}

          {settings.panicWipeEnabled && settings.emergencyCode && (
            <div className="p-4 rounded-lg border border-red-800/30 bg-red-950/30">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-red-400" />
                <span className="font-medium text-red-100">Emergency Wipe Active</span>
              </div>
              <p className="text-sm text-red-300 mb-3">
                Your emergency code is set. Keep it secure and only use in genuine emergencies.
              </p>
              <p className="text-xs text-red-400">
                To trigger: Enter your emergency code when prompted for password
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="border-emerald-900/20 bg-gradient-to-br from-emerald-950/30 to-emerald-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-emerald-100">Privacy Status</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.disguiseEnabled ? '✓' : '✗'} App Disguised
            </Badge>
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.lockEnabled ? '✓' : '✗'} Security Lock
            </Badge>
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.biometricEnabled ? '✓' : '✗'} Biometric Auth
            </Badge>
            <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800/30">
              {settings.panicWipeEnabled ? '✓' : '✗'} Emergency Wipe
            </Badge>
          </div>

          {settings.disguiseEnabled && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/30">
              <p className="text-sm text-emerald-300">
                Active Disguise: <strong>{settings.appName}</strong>
              </p>
              <p className="text-xs text-emerald-400 mt-1">
                App appears as {settings.selectedIcon} to other users and in recent apps
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
