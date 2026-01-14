# Finch Care

A safety-first anxiety companion for in-the-moment resets and gentle skill-building - no streaks, no shame.

## Features

- **Co-Regulation Mode** - Always-free, unlimited access to breathing exercises, grounding techniques, and cognitive tools
- **30-Day Anxiety Skills Path** - Evidence-based lessons and practices (Days 1-7 free, Days 8-30 Pro)
- **Gentle Progress Tracking** - Weekly GAD-2 check-ins and optional panic counter
- **Positive Rewards** - Earn points and unlock cosmetics with no streaks or penalties
- **Crisis Support** - Always-accessible crisis resources and safety information
- **Anonymous First** - Use immediately without an account; data stored locally

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel

## File Structure

```
finch-care/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout with header/footer
│   │   ├── globals.css        # Global styles
│   │   ├── regulate/          # Co-Regulation Mode
│   │   ├── path/              # 30-day Path overview
│   │   │   └── day/[day]/     # Individual day pages
│   │   ├── progress/          # GAD-2 + panic tracking
│   │   ├── rewards/           # Points + cosmetics
│   │   ├── account/           # Profile + subscription
│   │   ├── auth/
│   │   │   ├── sign-in/       # Sign in page
│   │   │   └── sign-up/       # Sign up page
│   │   ├── crisis/            # Crisis resources
│   │   ├── privacy/           # Privacy policy
│   │   └── api/
│   │       └── stripe/
│   │           ├── checkout/  # Create checkout session
│   │           ├── portal/    # Billing portal
│   │           └── webhook/   # Stripe webhooks
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SignupPrompt.tsx
│   │   ├── WorryTimeBanner.tsx
│   │   ├── BreathingTimer.tsx
│   │   ├── GroundingExercise.tsx
│   │   ├── DefusionExercise.tsx
│   │   ├── WorryPostponement.tsx
│   │   ├── RestProtocol.tsx
│   │   └── SessionComplete.tsx
│   └── lib/
│       ├── localStore.ts      # localStorage utilities
│       ├── migrate.ts         # Data migration to Supabase
│       ├── entitlements.ts    # Pro status checking
│       ├── protocols.ts       # Protocol definitions
│       ├── stripe.ts          # Stripe config
│       └── supabase/
│           ├── client.ts      # Browser client
│           └── server.ts      # Server client
├── supabase/
│   ├── schema.sql             # Database schema
│   ├── rls.sql                # Row-level security policies
│   └── seed.sql               # Seed data for path content
├── package.json
└── README.md
```

## Database Schema

### Tables

- `profiles` - User profile data (country_code, onboarding_done)
- `regulation_sessions` - Co-regulation session logs
- `path_days` - 30-day path content (day_number, title, free)
- `path_lessons` - Lesson content (content_md, est_minutes)
- `user_day_progress` - User progress through path
- `gad2_responses` - Weekly GAD-2 check-in responses
- `panic_counts` - Daily panic episode counts
- `wallet` - User points balance
- `transactions` - Points transaction log
- `cosmetics` - Available cosmetic items
- `user_cosmetics` - User unlocked cosmetics
- `subscriptions` - Stripe subscription data

See `supabase/schema.sql` for full schema.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/portal` | POST | Create Stripe billing portal session |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks |

## Environment Variables

### Required for full functionality

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Optional

```env
STRIPE_WEBHOOK_SECRET=your_webhook_secret  # For signature verification
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx  # Monthly Pro price
NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID=price_xxx   # Annual Pro price
NEXT_PUBLIC_APP_URL=https://finch-care.vercel.app
DATABASE_URL=your_database_url  # For migrations
```

### Graceful Degradation

The app degrades gracefully when environment variables are missing:
- **No Supabase**: App works in anonymous-only mode with localStorage
- **No Stripe**: Upgrade buttons hidden, "Pro coming soon" message shown
- **No webhook secret**: Webhooks process without signature verification (logged warning)

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Database Setup

1. Create a Supabase project
2. Run the SQL files in order:
   ```sql
   -- Run in Supabase SQL editor
   -- 1. Schema
   -- Copy contents of supabase/schema.sql

   -- 2. RLS Policies
   -- Copy contents of supabase/rls.sql

   -- 3. Seed Data
   -- Copy contents of supabase/seed.sql
   ```

## Deployment

The app is configured for deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Services Report

### Active Services (from available list)
- **Next.js** - Application framework
- **Tailwind CSS** - Styling
- **Supabase** - Database, auth, and storage (when configured)
- **Stripe** - Payment processing (when configured)
- **Vercel** - Hosting and deployment

### Inactive (needs setup)
- **Supabase** - Required for: user accounts, data sync, subscription management
- **Stripe** - Required for: Pro subscriptions, billing management

The app works without these services in anonymous/free mode with localStorage.

## Safety Notice

Finch Care is not a substitute for professional medical advice, diagnosis, or treatment. It is not intended for use in emergencies. If you are in crisis, please contact emergency services or a crisis helpline.
