# Serene Spaces Admin Setup Guide

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeme-dev-secret

# Database (Vercel Postgres later - for local dev set this now, update after deploy)
DATABASE_URL=""

# Google OAuth (optional, for NextAuth)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # set after creating webhook endpoint

# Stripe tax rate (create in Stripe Dashboard and paste id)
STRIPE_TAX_RATE_ID="txr_..."        # Illinois 6.25% for example

# Resend (optional)
RESEND_API_KEY=""
```

## Setup Steps

1. **Stripe Setup**
   - Create a Stripe account and get your test API keys
   - Create an Illinois sales tax rate (6.25%) in Stripe Dashboard
   - Copy the tax rate ID to `STRIPE_TAX_RATE_ID`

2. **Google OAuth (Optional)**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

3. **Database Setup**
   - For local development: Use a local Postgres or Neon
   - For production: Use Vercel Postgres

4. **Webhook Setup**
   - In Stripe Dashboard, create webhook endpoint
   - URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events: `invoice.finalized`, `invoice.sent`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (if you have a DATABASE_URL)
npx prisma migrate dev --name init

# Start development server
npm run dev
```

## Production Deployment

1. Push to GitHub
2. Import in Vercel
3. Add Vercel Postgres integration
4. Set all environment variables in Vercel
5. Run `npx prisma migrate deploy` after first deploy
6. Update Stripe webhook URL to production domain
