// Stripe configuration and helpers
// All Stripe operations happen server-side

export const STRIPE_PRICES = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
  annual: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || ''
}

export function isStripeConfigured(): boolean {
  // Check if at least one price is configured
  return Boolean(STRIPE_PRICES.monthly || STRIPE_PRICES.annual)
}

export function getAvailablePlans(): { monthly: boolean; annual: boolean } {
  return {
    monthly: Boolean(STRIPE_PRICES.monthly),
    annual: Boolean(STRIPE_PRICES.annual)
  }
}
