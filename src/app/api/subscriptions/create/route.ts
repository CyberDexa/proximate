import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
})

const PLANS = {
  premium: {
    name: 'Premium',
    price: 1999, // $19.99 in cents
    features: [
      'Unlimited swipes',
      'Advanced filters',
      'See who liked you',
      'Video verification',
      'Priority support',
      'Incognito mode'
    ]
  },
  premiumPlus: {
    name: 'Premium+',
    price: 3999, // $39.99 in cents
    features: [
      'Everything in Premium',
      'Background check badge',
      'Unlimited boosts',
      'Travel mode',
      'Dedicated safety concierge',
      'Partner perks'
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { planType } = await request.json()

    if (!planType || !PLANS[planType as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    const plan = PLANS[planType as keyof typeof PLANS]

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ProxiMeet ${plan.name}`,
              description: plan.features.join(', '),
              images: ['https://proximeet.app/logo.png'], // Replace with actual logo
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userEmail: session.user.email,
        planType,
      },
      success_url: `${process.env.NEXTAUTH_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/premium`,
      subscription_data: {
        metadata: {
          userEmail: session.user.email,
          planType,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
