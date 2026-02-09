# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Barbearia do Moura is a complete online barbershop scheduling system with a subscription club. The application serves three user roles: **cliente** (customer), **barbeiro** (barber/professional), and **admin**.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Auth, PostgreSQL, Realtime)
- **Payments**: Mercado Pago integration
- **Forms**: react-hook-form + Zod validation
- **Date handling**: date-fns + date-fns-tz (timezone: America/Sao_Paulo)

## Architecture

### Route Groups (src/app/)
The app uses Next.js route groups to organize by user role:
- `(admin)/admin/*` - Admin panel (dashboard, agenda, professionals, services, commissions, subscriptions, financials, blocked slots)
- `(profissional)/profissional/*` - Professional panel (dashboard, commissions, blocked slots, profile)
- `(cliente)/*` - Customer area (dashboard, scheduling, appointments, subscription club, profile)
- `(auth)/*` - Authentication pages (login, register, forgot/reset password)
- `(public)/*` - Public pages (landing, payment result pages)
- `api/webhooks/mercadopago` - Mercado Pago webhook handler

### Server Actions Pattern
Business logic is implemented as React Server Actions in `src/lib/`:
- `lib/auth/actions.ts` - Authentication (login, register, logout, password reset, profile update)
- `lib/scheduling/actions.ts` - Scheduling logic (available slots, create/cancel appointments, pricing calculation)
- `lib/mercadopago/actions.ts` - Payment processing

### Database
Supabase PostgreSQL with Row Level Security (RLS). Key tables:
- `users` - Linked to auth.users, contains role (cliente/barbeiro/admin)
- `professionals` - Barber profiles linked to users
- `services` - Available services with price and duration
- `appointments` - Bookings with status, pricing, and subscription coverage
- `subscriptions` / `subscription_plans` - Subscription club management
- `commissions` / `commission_rates` - Professional commission tracking
- `business_hours` / `professional_hours` - Operating hours
- `blocked_slots` - Time blocks (per professional or whole shop)

Database types are in `src/types/database.ts`. Update with:
```bash
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```

### Authentication Flow
- Supabase Auth with email/password
- Middleware (`src/middleware.ts`) handles session refresh and route protection
- On login, users are redirected to their role-specific dashboard
- New users automatically get a `users` table entry via database trigger

### Key Business Rules
1. **Appointment Pricing**: Checks if customer has active subscription, if service is included in plan, and if the day is allowed by plan restrictions. If covered, price is 0; otherwise full price.
2. **Cancellation**: Only allowed up to 4 hours before scheduled time.
3. **Commissions**: Auto-calculated when appointment status changes to "concluido" (completed). Uses configured rate or 50% default.
4. **Timezone**: All dates use America/Sao_Paulo (GMT-3). Server actions use `date-fns-tz` for conversions.

### UI Components
- shadcn/ui components in `src/components/ui/`
- Layout components in `src/components/layout/` (navigation, sidebar, header for each role)
- Dark theme by default with gold accent color (#D4AF37)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_ACCESS_TOKEN=
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

## Database Migrations

SQL migrations are in `supabase/migrations/`. Execute in order in Supabase SQL Editor.
