'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { X, Star, Shield, Eye, Zap, Crown, Heart, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EthicalPromptProps {
  feature: string
  description: string
  tier: 'premium' | 'premiumPlus'
  currentUsage?: number
  limit?: number
  onClose?: () => void
  onUpgrade?: (tier: 'premium' | 'premiumPlus') => void
  isOpen?: boolean
}

const featureIcons = {
  'unlimited-swipes': Heart,
  'advanced-filters': Eye,
  'see-likes': Heart,
  'video-calls': Star,
  'boosts': Zap,
  'incognito': Eye,
  'travel-mode': Crown,
  'background-check': Shield,
}

const tierColors = {
  premium: 'purple',
  premiumPlus: 'blue'
}

const tierPrices = {
  premium: '$19.99',
  premiumPlus: '$39.99'
}

export default function EthicalPrompt({
  feature,
  description,
  tier,
  currentUsage = 0,
  limit = 10,
  onClose,
  onUpgrade,
  isOpen = false
}: EthicalPromptProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const tierColor = tierColors[tier]
  const IconComponent = featureIcons[feature as keyof typeof featureIcons] || Star

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      if (onUpgrade) {
        await onUpgrade(tier)
      } else {
        // Default upgrade flow
        const response = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planType: tier }),
        })

        if (response.ok) {
          const { url } = await response.json()
          window.location.href = url
        }
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const premiumFeatures = [
    'Unlimited daily swipes',
    'Advanced filters & kink matching',
    'See who liked you',
    'Unlimited video verification',
    '5 profile boosts per week',
    'Incognito browsing mode',
    'Priority customer support'
  ]

  const premiumPlusFeatures = [
    ...premiumFeatures,
    'Travel mode for multiple cities',
    'Background check verification badge',
    'Unlimited profile boosts',
    'Dedicated safety concierge',
    'Partner perks (hotels, rides)',
    'Early access to new features'
  ]

  const features = tier === 'premium' ? premiumFeatures : premiumPlusFeatures

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <IconComponent className={cn(
                "h-5 w-5",
                tierColor === 'purple' ? "text-purple-400" : "text-blue-400"
              )} />
              Unlock This Feature
            </DialogTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="text-slate-300">
            {description}
          </DialogDescription>
        </DialogHeader>

        <CardContent className="p-0 space-y-6">
          {/* Usage Indicator (if applicable) */}
          {limit && (
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Daily Usage</span>
                <span className="text-sm text-slate-400">{currentUsage}/{limit}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all",
                    tierColor === 'purple' ? "bg-purple-500" : "bg-blue-500"
                  )}
                  style={{ width: `${Math.min((currentUsage / limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Plan Card */}
          <Card className={cn(
            "border-2",
            tierColor === 'purple' ? "border-purple-500 bg-purple-950/20" : "border-blue-500 bg-blue-950/20"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {tier === 'premiumPlus' && <Crown className="h-5 w-5 text-yellow-500" />}
                  {tier === 'premium' ? 'Premium' : 'Premium+'}
                </CardTitle>
                <Badge className={cn(
                  "text-white",
                  tierColor === 'purple' ? "bg-purple-600" : "bg-gradient-to-r from-purple-600 to-blue-600"
                )}>
                  {tier === 'premium' ? 'Most Popular' : 'Elite'}
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                {tierPrices[tier]}
                <span className="text-sm font-normal text-slate-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                {features.length > 4 && (
                  <div className="text-sm text-slate-400">
                    +{features.length - 4} more features
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ethical Notice */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Our Promise</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• All safety features remain completely free</li>
              <li>• Premium doesn't boost your position in matches</li>
              <li>• Cancel anytime with immediate effect</li>
              <li>• No hidden fees or automatic renewals without notice</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={onClose}
            >
              Maybe Later
            </Button>
            <Button 
              onClick={handleUpgrade}
              disabled={isLoading}
              className={cn(
                "flex-1 text-white",
                tierColor === 'purple' 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              )}
            >
              {isLoading ? 'Processing...' : `Upgrade Now`}
            </Button>
          </div>

          {/* Legal Fine Print */}
          <div className="text-xs text-slate-500 text-center">
            By upgrading, you agree to our Terms of Service and Privacy Policy. 
            Subscription auto-renews monthly. Cancel anytime in Account Settings.
          </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}

// Hook for triggering paywall
export function usePaywall() {
  const [paywallConfig, setPaywallConfig] = useState<EthicalPromptProps | null>(null)
  
  const showPaywall = (config: Omit<EthicalPromptProps, 'isOpen' | 'onClose'>) => {
    setPaywallConfig({
      ...config,
      isOpen: true,
      onClose: () => setPaywallConfig(null)
    })
  }

  const PaywallComponent = paywallConfig ? (
    <EthicalPrompt {...paywallConfig} />
  ) : null

  return {
    showPaywall,
    PaywallComponent,
    isOpen: paywallConfig?.isOpen || false
  }
}
