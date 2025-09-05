'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchSubscriptionDetails(sessionId)
    }
  }, [sessionId])

  const fetchSubscriptionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/success?session_id=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSubscriptionDetails(data)
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Confirming your subscription...</p>
        </div>
      </div>
    )
  }

  const tierConfig = {
    premium: {
      name: 'Premium',
      icon: Star,
      color: 'purple',
      price: '$19.99'
    },
    premiumPlus: {
      name: 'Premium+',
      icon: Crown,
      color: 'blue',
      price: '$39.99'
    }
  }

  const tier = subscriptionDetails?.tier || 'premium'
  const config = tierConfig[tier as keyof typeof tierConfig]
  const IconComponent = config.icon

  const benefits = {
    premium: [
      'Unlimited daily swipes',
      'Advanced filters & kink matching',
      'See who liked you',
      'Unlimited video verification calls',
      '5 profile boosts per week',
      'Incognito browsing mode',
      'Priority customer support'
    ],
    premiumPlus: [
      'Everything in Premium',
      'Background check verification badge',
      'Unlimited profile boosts',
      'Travel mode for multiple cities',
      'Dedicated safety concierge',
      'Partner perks (hotels, rides)',
      'Early access to new features'
    ]
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Header */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to {config.name}!
            </h1>
            <p className="text-xl text-slate-300">
              Your subscription is now active. Start exploring premium features!
            </p>
          </div>

          {/* Subscription Details Card */}
          <Card className="mb-8 bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <IconComponent className={`h-6 w-6 ${config.color === 'purple' ? 'text-purple-400' : 'text-blue-400'}`} />
                ProxiMeet {config.name}
                <Badge className={`${config.color === 'purple' ? 'bg-purple-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'} text-white`}>
                  Active
                </Badge>
              </CardTitle>
              <CardDescription>
                {config.price}/month • Billed monthly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {benefits[tier as keyof typeof benefits].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8 bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Here's what you can do now with your premium subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/discover">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Swiping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/premium/manage">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                    Manage Subscription
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-emerald-400">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-2 text-left">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Your subscription will automatically renew monthly</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>You can cancel anytime in your account settings</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>All safety features remain free regardless of subscription status</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Premium features are active immediately</span>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Information */}
          {subscriptionDetails && (
            <div className="mt-8 text-center text-sm text-slate-400">
              <p>
                A receipt has been sent to your email address. 
                If you have any questions, contact our support team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionSuccessContent />
    </Suspense>
  )
}
