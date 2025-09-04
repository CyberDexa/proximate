'use client'

import { Badge } from '@/components/ui/badge'
import { Crown, Star, Shield, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface PremiumBadgeProps {
  tier: 'premium' | 'premiumPlus' | 'verified' | null
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  className?: string
}

const badgeConfig = {
  premium: {
    icon: Star,
    text: 'Premium',
    color: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    description: 'Premium member with enhanced features'
  },
  premiumPlus: {
    icon: Crown,
    text: 'Elite',
    color: 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-transparent bg-clip-text border border-gradient-to-r from-purple-500/30 to-blue-500/30',
    description: 'Elite member with exclusive perks and priority support'
  },
  verified: {
    icon: Shield,
    text: 'Verified',
    color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    description: 'Identity and background verified for safety'
  }
}

const sizeConfig = {
  sm: {
    badge: 'h-5 px-2 text-xs',
    icon: 'h-3 w-3'
  },
  md: {
    badge: 'h-6 px-3 text-sm',
    icon: 'h-4 w-4'
  },
  lg: {
    badge: 'h-8 px-4 text-base',
    icon: 'h-5 w-5'
  }
}

export default function PremiumBadge({ 
  tier, 
  size = 'md', 
  showTooltip = true,
  className 
}: PremiumBadgeProps) {
  if (!tier) return null

  const config = badgeConfig[tier]
  const sizes = sizeConfig[size]
  const IconComponent = config.icon

  const badge = (
    <Badge 
      variant="outline"
      className={cn(
        sizes.badge,
        config.color,
        'inline-flex items-center gap-1 font-medium transition-all hover:opacity-80',
        tier === 'premiumPlus' && 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-gradient',
        className
      )}
    >
      <IconComponent className={sizes.icon} />
      <span className={tier === 'premiumPlus' ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' : ''}>
        {config.text}
      </span>
    </Badge>
  )

  if (!showTooltip) return badge

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Component for showing subscription benefits
interface SubscriptionBenefitsProps {
  currentTier: 'free' | 'premium' | 'premiumPlus'
  className?: string
}

export function SubscriptionBenefits({ currentTier, className }: SubscriptionBenefitsProps) {
  const benefits = {
    free: [
      '10 swipes per day',
      'Basic filters',
      'Standard messaging',
      'Core safety features'
    ],
    premium: [
      'Unlimited swipes',
      'Advanced filters',
      'See who liked you',
      'Video verification',
      'Priority support',
      'Incognito mode'
    ],
    premiumPlus: [
      'Everything in Premium',
      'Background check badge',
      'Unlimited boosts',
      'Travel mode',
      'Dedicated safety concierge',
      'Partner perks'
    ]
  }

  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="font-medium text-slate-200">Your Benefits</h4>
      <div className="space-y-1">
        {benefits[currentTier].map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Hook for checking subscription status
export function useSubscription() {
  // This would integrate with your auth/user context
  // For now, returning mock data
  return {
    tier: 'free' as 'free' | 'premium' | 'premiumPlus',
    isActive: false,
    canCancel: false,
    nextBilling: null,
    features: {
      unlimitedSwipes: false,
      advancedFilters: false,
      seeWhoLiked: false,
      videoVerification: false,
      incognitoMode: false,
      travelMode: false,
      backgroundCheck: false,
      prioritySupport: false
    }
  }
}
