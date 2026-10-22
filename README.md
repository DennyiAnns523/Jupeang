# Üli

Florist shop and garden journal: Next.js 16, Sanity CMS for content, Postgres + Prisma for customer data, Auth.js for accounts, and Stripe for payments.

## What lives where

| Concern | Where |
| --- | --- |
| Products, garden posts, images | Sanity (`/studio`) |
| Users, orders, subscriptions, rate limits | Postgres (`prisma/schema.prisma`) |
| Sign-in (email + password, optional Google) | Auth.js, `src/lib/auth.ts` |
| Payments and subscriptions | Stripe Checkout + webhook (`src/app/api/webhooks/stripe`) |
| Order emails | Resend (`src/lib/email.ts`); logs to the console when not configured |

## Local setup

```bash
npm install
cp .env.example .env.local      # then fill in AUTH_SECRET (npx auth secret) and Sanity
npm run db:up                   # Postgres in Docker on :5432
npm run db:migrate              # create tables
npm run dev
```

Create an account at `/auth/signup`, then make yourself an admin:

```bash
npm run make-admin -- you@example.com
```

The admin dashboard is at `/admin` (orders, statuses, subscriptions).

### Stripe locally

1. Put your **test** secret key in `STRIPE_SECRET_KEY` and set `NEXT_PUBLIC_PAYMENTS_ENABLED=true`.
2. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.
3. Pay with card `4242 4242 4242 4242`.

Without Stripe keys, checkout still works: orders are saved as **Requested** and emailed to the shop for offline payment.

## Deploying (Vercel)

1. Create a Postgres database (Neon, Supabase or Vercel Postgres) and set `DATABASE_URL`.
2. Set every variable from `.env.example` in the Vercel project (`NEXT_PUBLIC_SITE_URL` = your domain).
3. Apply migrations against production: `DATABASE_URL=… npm run db:deploy`.
4. In Stripe → Developers → Webhooks, add `https://<domain>/api/webhooks/stripe` with events:
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`.
5. Turn on the Stripe customer portal (Settings → Billing → Customer portal) so subscribers can pause and cancel.

## Security notes

- Prices are recomputed on the server from Sanity and `src/lib/pricing.ts`; the browser's prices are ignored.
- Passwords are hashed with bcrypt (cost 12). Login, signup, checkout and password changes are rate-limited in Postgres.
- Admin access is checked against the database on every request; non-admins get a 404.
- Stripe webhooks are signature-verified and processed once per event.
- JSON API routes reject cross-origin requests; server actions get Next.js's built-in origin check.
- Security headers and a Content Security Policy are set in `next.config.ts` (Studio is exempt from the CSP).
