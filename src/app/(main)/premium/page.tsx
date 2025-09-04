'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Shield, Eye, MessageCircle, Camera, MapPin, Zap, Crown, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanFeature {
  feature: string
  free: boolean | string
  premium: boolean | string
  premiumPlus: boolean | string
  icon?: React.ReactNode
}

const planFeatures: PlanFeature[] = [
  {
    feature: 'Daily Swipes',
    free: '10 per day',
    premium: 'Unlimited',
    premiumPlus: 'Unlimited',
    icon: <Heart className="h-4 w-4" />
  },
  {
    feature: 'Basic Filters',
    free: true,
    premium: true,
    premiumPlus: true,
    icon: <Eye className="h-4 w-4" />
  },
  {
    feature: 'Advanced Filters & Kink Matching',
    free: false,
    premium: true,
    premiumPlus: true,
    icon: <Eye className="h-4 w-4" />
  },
  {
    feature: 'See Who Liked You',
    free: false,
    premium: true,
    premiumPlus: true,
    icon: <Heart className="h-4 w-4" />
  },
  {
    feature: 'Standard Messaging',
    free: true,
    premium: true,
    premiumPlus: true,
    icon: <MessageCircle className="h-4 w-4" />
  },
  {
    feature: 'Video Verification Calls',
    free: '1 per week',
    premium: 'Unlimited',
    premiumPlus: 'Unlimited',
    icon: <Camera className="h-4 w-4" />
  },
  {
    feature: 'Profile Boosts',
    free: '1 per week',
    premium: '5 per week',
    premiumPlus: 'Unlimited',
    icon: <Zap className="h-4 w-4" />
  },
  {
    feature: 'Incognito Mode',
    free: false,
    premium: true,
    premiumPlus: true,
    icon: <Eye className="h-4 w-4" />
  },
  {
    feature: 'Travel Mode',
    free: false,
    premium: false,
    premiumPlus: true,
    icon: <MapPin className="h-4 w-4" />
  },
  {
    feature: 'Background Check Badge',
    free: false,
    premium: false,
    premiumPlus: true,
    icon: <Shield className="h-4 w-4" />
  },
  {
    feature: 'Priority Support',
    free: 'Standard',
    premium: 'Priority',
    premiumPlus: 'Dedicated',
    icon: <MessageCircle className="h-4 w-4" />
  },
  {
    feature: 'Partner Perks (Hotels, Rides)',
    free: false,
    premium: false,
    premiumPlus: true,
    icon: <Crown className="h-4 w-4" />
  }
]

// Safety features that are ALWAYS free
const safetyFeatures = [
  'Panic Button & Emergency Alerts',
  'Location Sharing with Trusted Friends',
  'Safety Check-in System',
  'Report & Block Functions',
  'Consent Education Resources',
  'Basic Verification (ID & Photo)',
  'Content Moderation',
  'Safety Concierge (Emergency Only)'
]

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'premiumPlus'>('premium')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (planType: 'premium' | 'premiumPlus') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error('Failed to create subscription')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      // Handle error - show toast or error message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Enhance your experience with premium features designed for serious connections
          </p>
        </div>

        {/* Safety Notice */}
        <Card className="mb-8 bg-slate-900 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <Shield className="h-5 w-5" />
              Safety Features Always Free
            </CardTitle>
            <CardDescription className="text-slate-300">
              Your safety is never for sale. All essential safety features remain completely free for everyone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Essential features to get started</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-slate-400">/month</span></div>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full mb-4" variant="outline">
                Current Plan
              </Button>
              <div className="space-y-3">
                {planFeatures.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.feature}</span>
                    </div>
                    <div className="text-slate-400">
                      {typeof item.free === 'boolean' ? (
                        item.free ? <Check className="h-4 w-4 text-emerald-400" /> : '—'
                      ) : (
                        item.free
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={cn(
            "bg-slate-900 border-2",
            selectedPlan === 'premium' ? "border-purple-500 ring-2 ring-purple-500/20" : "border-slate-700"
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Premium</CardTitle>
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
              <CardDescription>Enhanced features for serious connections</CardDescription>
              <div className="text-3xl font-bold">$19.99<span className="text-lg font-normal text-slate-400">/month</span></div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleSubscribe('premium')}
                disabled={isLoading}
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? 'Processing...' : 'Upgrade to Premium'}
              </Button>
              <div className="space-y-3">
                {planFeatures.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.feature}</span>
                    </div>
                    <div className="text-slate-400">
                      {typeof item.premium === 'boolean' ? (
                        item.premium ? <Check className="h-4 w-4 text-emerald-400" /> : '—'
                      ) : (
                        item.premium
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium+ Plan */}
          <Card className={cn(
            "bg-slate-900 border-2",
            selectedPlan === 'premiumPlus' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-700"
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Premium+
                </CardTitle>
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Elite</Badge>
              </div>
              <CardDescription>Ultimate experience with exclusive perks</CardDescription>
              <div className="text-3xl font-bold">$39.99<span className="text-lg font-normal text-slate-400">/month</span></div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleSubscribe('premiumPlus')}
                disabled={isLoading}
                className="w-full mb-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? 'Processing...' : 'Upgrade to Premium+'}
              </Button>
              <div className="space-y-3">
                {planFeatures.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.feature}</span>
                    </div>
                    <div className="text-slate-400">
                      {typeof item.premiumPlus === 'boolean' ? (
                        item.premiumPlus ? <Check className="h-4 w-4 text-emerald-400" /> : '—'
                      ) : (
                        item.premiumPlus
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Star className="h-5 w-5" />
                Quality Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Advanced filters and unlimited swipes help you find exactly what you're looking for faster.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Shield className="h-5 w-5" />
                Enhanced Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Incognito mode and background verification badges provide extra discretion and trust.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400">
                <Crown className="h-5 w-5" />
                Exclusive Perks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Partner discounts on hotels and rides make meetups more convenient and affordable.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ethical Promise */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-emerald-400">Our Ethical Promise</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">No Safety Paywalls</h4>
                <p className="text-slate-400">Essential safety features are always free for everyone</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Fair Matching</h4>
                <p className="text-slate-400">Premium doesn't boost your position in the algorithm</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Easy Cancellation</h4>
                <p className="text-slate-400">Cancel anytime with no questions asked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
