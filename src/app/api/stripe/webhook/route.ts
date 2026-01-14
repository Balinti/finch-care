import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Helper to get subscription period end
function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): string {
  // Handle different API versions
  const periodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end
  if (periodEnd) {
    return new Date(periodEnd * 1000).toISOString()
  }
  // Fallback: use created date + 30 days
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
}

export async function POST(request: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  const stripe = new Stripe(stripeSecretKey)

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    // Verify signature if webhook secret is configured
    if (stripeWebhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
    } else {
      // Parse without verification if no secret (development mode)
      event = JSON.parse(body) as Stripe.Event
      console.warn('Webhook signature verification skipped - no STRIPE_WEBHOOK_SECRET configured')
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (userId && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_end: getSubscriptionPeriodEnd(subscription),
            price_id: subscription.items.data[0]?.price.id,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        if (userId) {
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_end: getSubscriptionPeriodEnd(subscription),
            price_id: subscription.items.data[0]?.price.id,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
        } else {
          // Try to find user by customer ID
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single()

          if (existingSub) {
            await supabase.from('subscriptions').update({
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              current_period_end: getSubscriptionPeriodEnd(subscription),
              price_id: subscription.items.data[0]?.price.id,
              updated_at: new Date().toISOString()
            }).eq('user_id', existingSub.user_id)
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const subscriptionId = (invoice as unknown as { subscription?: string }).subscription
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)

          // Find user by customer ID
          const customerId = (invoice as unknown as { customer?: string }).customer
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single()

          if (existingSub) {
            await supabase.from('subscriptions').update({
              status: subscription.status,
              current_period_end: getSubscriptionPeriodEnd(subscription),
              updated_at: new Date().toISOString()
            }).eq('user_id', existingSub.user_id)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = (invoice as unknown as { customer?: string }).customer

        // Find user by customer ID and mark as past_due
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (existingSub) {
          await supabase.from('subscriptions').update({
            status: 'past_due',
            updated_at: new Date().toISOString()
          }).eq('user_id', existingSub.user_id)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
