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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's subscription info from database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let stripeSubscription: Stripe.Subscription | null = null
    if (user.subscription?.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          user.subscription.stripeSubscriptionId
        )
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
      }
    }

    return NextResponse.json({
      subscription: user.subscription,
      stripeSubscription,
      canCancel: stripeSubscription?.status === 'active',
      nextBilling: stripeSubscription && 'current_period_end' in stripeSubscription
        ? new Date((stripeSubscription.current_period_end as number) * 1000)
        : null,
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    })

    if (!user?.subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel subscription at period end (not immediately)
    const canceledSubscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
        metadata: {
          canceledBy: 'user',
          canceledAt: new Date().toISOString(),
        }
      }
    ) as Stripe.Subscription

    // Update subscription in database
    await db.subscription.update({
      where: { id: user.subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      endsAt: 'current_period_end' in canceledSubscription
        ? new Date((canceledSubscription.current_period_end as number) * 1000)
        : null,
    })
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
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

    const { action } = await request.json()

    if (action !== 'reactivate') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    })

    if (!user?.subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    // Reactivate subscription (remove cancel_at_period_end)
    const reactivatedSubscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
        metadata: {
          reactivatedBy: 'user',
          reactivatedAt: new Date().toISOString(),
        }
      }
    )

    // Update subscription in database
    await db.subscription.update({
      where: { id: user.subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription reactivated successfully',
      subscription: reactivatedSubscription,
    })
  } catch (error) {
    console.error('Subscription reactivation error:', error)
    return NextResponse.json(
      { error: 'Failed to reactivate subscription' },
      { status: 500 }
    )
  }
}
