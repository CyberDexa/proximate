import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const userEmail = session.metadata?.userEmail
    const planType = session.metadata?.planType

    if (!userEmail || !planType) {
      console.error('Missing metadata in checkout session:', session.id)
      return
    }

    const user = await db.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      console.error('User not found for email:', userEmail)
      return
    }

    // Create or update subscription record
    await db.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        tier: planType,
        status: 'active',
      },
      update: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        tier: planType,
        status: 'active',
      }
    })

    console.log(`Subscription created for user ${user.id}, plan: ${planType}`)
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const userEmail = subscription.metadata?.userEmail

    if (!userEmail) {
      console.error('Missing userEmail in subscription metadata:', subscription.id)
      return
    }

    const user = await db.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      console.error('User not found for email:', userEmail)
      return
    }

    const currentPeriodStart = 'current_period_start' in subscription 
      ? new Date((subscription.current_period_start as number) * 1000)
      : new Date()
    
    const currentPeriodEnd = 'current_period_end' in subscription 
      ? new Date((subscription.current_period_end as number) * 1000)
      : new Date()

    await db.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id,
        tier: subscription.metadata?.planType || 'premium',
        status: subscription.status,
        currentPeriodStart,
        currentPeriodEnd,
      },
      update: {
        status: subscription.status,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: 'cancel_at_period_end' in subscription 
          ? subscription.cancel_at_period_end as boolean
          : false,
      }
    })
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const currentPeriodStart = 'current_period_start' in subscription 
      ? new Date((subscription.current_period_start as number) * 1000)
      : new Date()
    
    const currentPeriodEnd = 'current_period_end' in subscription 
      ? new Date((subscription.current_period_end as number) * 1000)
      : new Date()

    await db.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: 'cancel_at_period_end' in subscription 
          ? subscription.cancel_at_period_end as boolean
          : false,
      }
    })
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await db.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      }
    })
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Reset usage counters for the new billing period
    if ('subscription' in invoice && invoice.subscription) {
      await db.subscription.updateMany({
        where: { stripeSubscriptionId: invoice.subscription as string },
        data: {
          dailySwipesUsed: 0,
          weeklyBoostsUsed: 0,
          monthlyVideoCallsUsed: 0,
          lastResetDate: new Date(),
        }
      })
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if ('subscription' in invoice && invoice.subscription) {
      await db.subscription.updateMany({
        where: { stripeSubscriptionId: invoice.subscription as string },
        data: {
          status: 'past_due',
        }
      })
    }
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
