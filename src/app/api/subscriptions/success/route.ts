import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })

    if (!checkoutSession) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 404 }
      )
    }

    // Verify the session belongs to the current user
    if (checkoutSession.customer_email !== session.user.email) {
      return NextResponse.json(
        { error: 'Session does not belong to current user' },
        { status: 403 }
      )
    }

    // Get user's subscription from database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    })

    if (!user?.subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Get Stripe subscription details
    let stripeSubscription = null
    if (user.subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          user.subscription.stripeSubscriptionId
        )
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
      }
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: user.subscription.id,
        tier: user.subscription.tier,
        status: user.subscription.status,
        currentPeriodStart: user.subscription.currentPeriodStart,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
      },
      stripeSession: {
        id: checkoutSession.id,
        paymentStatus: checkoutSession.payment_status,
        customerEmail: checkoutSession.customer_email,
      },
      nextBilling: stripeSubscription && 'current_period_end' in stripeSubscription
        ? new Date((stripeSubscription.current_period_end as number) * 1000)
        : null,
    })
  } catch (error) {
    console.error('Subscription success error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve subscription details' },
      { status: 500 }
    )
  }
}
