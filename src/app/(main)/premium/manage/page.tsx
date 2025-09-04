'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Crown, Star, Calendar, CreditCard, AlertTriangle, Check, X } from 'lucide-react'
import { format } from 'date-fns'

interface SubscriptionData {
  subscription: {
    id: string
    tier: string
    status: string
    currentPeriodStart: string
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
    canceledAt?: string
    dailySwipesUsed: number
    weeklyBoostsUsed: number
    monthlyVideoCallsUsed: number
  }
  nextBilling: string | null
  canCancel: boolean
}

export default function ManageSubscriptionPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscriptions/manage')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(prev => prev ? {
          ...prev,
          subscription: {
            ...prev.subscription,
            cancelAtPeriodEnd: true,
            canceledAt: new Date().toISOString()
          }
        } : null)
        setShowCancelDialog(false)
        // Show success message
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reactivate' }),
      })
      
      if (response.ok) {
        setSubscriptionData(prev => prev ? {
          ...prev,
          subscription: {
            ...prev.subscription,
            cancelAtPeriodEnd: false,
            canceledAt: undefined
          }
        } : null)
        // Show success message
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading subscription details...</p>
        </div>
      </div>
    )
  }

  if (!subscriptionData?.subscription) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">No Active Subscription</h1>
            <p className="text-slate-300 mb-8">
              You don't have an active subscription. Upgrade to Premium to unlock advanced features.
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <a href="/premium">View Premium Plans</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { subscription } = subscriptionData
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

  const config = tierConfig[subscription.tier as keyof typeof tierConfig]
  const IconComponent = config.icon
  const nextBilling = subscriptionData.nextBilling ? new Date(subscriptionData.nextBilling) : null

  const usageLimits = {
    premium: {
      dailySwipes: null, // unlimited
      weeklyBoosts: 5,
      monthlyVideoCalls: null // unlimited
    },
    premiumPlus: {
      dailySwipes: null, // unlimited
      weeklyBoosts: null, // unlimited
      monthlyVideoCalls: null // unlimited
    }
  }

  const limits = usageLimits[subscription.tier as keyof typeof usageLimits]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Manage Subscription</h1>
            <p className="text-slate-300">
              View and manage your ProxiMeet subscription
            </p>
          </div>

          {/* Current Plan */}
          <Card className="mb-8 bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-6 w-6 ${config.color === 'purple' ? 'text-purple-400' : 'text-blue-400'}`} />
                  ProxiMeet {config.name}
                  <Badge className={`${config.color === 'purple' ? 'bg-purple-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'} text-white`}>
                    {subscription.cancelAtPeriodEnd ? 'Ending Soon' : 'Active'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{config.price}/month</div>
              </CardTitle>
              <CardDescription>
                {subscription.cancelAtPeriodEnd ? (
                  <span className="text-amber-400">
                    Your subscription will end on {nextBilling ? format(nextBilling, 'MMM dd, yyyy') : 'N/A'}
                  </span>
                ) : (
                  `Next billing: ${nextBilling ? format(nextBilling, 'MMM dd, yyyy') : 'N/A'}`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing Information */}
                <div>
                  <h4 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Billing Information
                  </h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{subscription.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Period:</span>
                      <span>
                        {format(new Date(subscription.currentPeriodStart), 'MMM dd')} - 
                        {format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-renewal:</span>
                      <span className={subscription.cancelAtPeriodEnd ? 'text-amber-400' : 'text-emerald-400'}>
                        {subscription.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div>
                  <h4 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    This Month's Usage
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Daily Swipes</span>
                        <span className="text-slate-400">
                          {limits.dailySwipes ? `${subscription.dailySwipesUsed}/${limits.dailySwipes}` : 'Unlimited'}
                        </span>
                      </div>
                      {limits.dailySwipes && (
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((subscription.dailySwipesUsed / limits.dailySwipes) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Weekly Boosts</span>
                        <span className="text-slate-400">
                          {limits.weeklyBoosts ? `${subscription.weeklyBoostsUsed}/${limits.weeklyBoosts}` : 'Unlimited'}
                        </span>
                      </div>
                      {limits.weeklyBoosts && (
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((subscription.weeklyBoostsUsed / limits.weeklyBoosts) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Video Calls</span>
                        <span className="text-slate-400">
                          {limits.monthlyVideoCalls ? `${subscription.monthlyVideoCallsUsed}/${limits.monthlyVideoCalls}` : 'Unlimited'}
                        </span>
                      </div>
                      {limits.monthlyVideoCalls && (
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((subscription.monthlyVideoCallsUsed / limits.monthlyVideoCalls) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription Actions */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Subscription Actions</CardTitle>
                <CardDescription>
                  Manage your subscription settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription.cancelAtPeriodEnd ? (
                  <Button 
                    onClick={handleReactivateSubscription}
                    disabled={actionLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {actionLoading ? 'Processing...' : 'Reactivate Subscription'}
                  </Button>
                ) : (
                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        Cancel Subscription
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-400">
                          <AlertTriangle className="h-5 w-5" />
                          Cancel Subscription
                        </DialogTitle>
                        <DialogDescription className="text-slate-300">
                          Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-slate-800 rounded-lg p-4">
                          <h4 className="font-medium text-slate-200 mb-2">What happens when you cancel:</h4>
                          <ul className="space-y-1 text-sm text-slate-300">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-emerald-400" />
                              You keep premium features until {nextBilling ? format(nextBilling, 'MMM dd, yyyy') : 'end of period'}
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-emerald-400" />
                              No more charges after current period
                            </li>
                            <li className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-400" />
                              Lose unlimited swipes and advanced features
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-emerald-400" />
                              Safety features remain free
                            </li>
                          </ul>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowCancelDialog(false)}
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                          >
                            Keep Subscription
                          </Button>
                          <Button 
                            onClick={handleCancelSubscription}
                            disabled={actionLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            {actionLoading ? 'Canceling...' : 'Cancel Subscription'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  Update Payment Method
                </Button>

                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                  Download Receipts
                </Button>
              </CardContent>
            </Card>

            {/* Upgrade Options */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Need More?</CardTitle>
                <CardDescription>
                  Upgrade to get even more features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription.tier === 'premium' && (
                  <div className="border border-blue-500/20 rounded-lg p-4 bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-blue-400" />
                      <h4 className="font-medium text-blue-400">Premium+ Available</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      Get unlimited boosts, background verification, and exclusive partner perks.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Upgrade to Premium+
                    </Button>
                  </div>
                )}

                <div className="text-center text-sm text-slate-400">
                  <p>
                    Questions? Contact our support team at{' '}
                    <a href="mailto:support@proximeet.app" className="text-purple-400 hover:underline">
                      support@proximeet.app
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
