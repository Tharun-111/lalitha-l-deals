# Lalitha L Deals

Lalitha L Deals is an online storefront for browsing products and offers, managing a shopping cart, and placing orders. It also includes a private admin dashboard for managing the store.

## Features

- Browse product sections, individual products, and current offers.
- Add products to a cart and submit an order.
- Contact the store about products through WhatsApp.
- Manage products, categories, offers, orders, and store settings in the admin dashboard.
- Update admin account credentials and profile details.
- Preview the dashboard with isolated, local-only demo data during development.

## Technology

- TanStack Start and TanStack Router
- React and TypeScript
- Tailwind CSS
- Supabase for authentication, database, and private image storage
- Drizzle ORM for database schema and migrations
- Vitest and Testing Library

## Getting started

Requirements: [Bun](https://bun.sh/) and access to a configured Supabase project.

1. Install dependencies:

   ```sh
   bun install
   ```

2. Copy `.env.example` to `.env.local` and fill in the values for your Supabase project. The app uses:

   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose this key in browser code)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

   `LOVABLE_DB_MIGRATION_URL` is also used by the Drizzle migration configuration when running database migrations.

3. Apply the database migrations in `drizzle/migrations` to the Supabase project.

4. Start the local development server:

   ```sh
   bun run dev
   ```

## Common commands

```sh
bun run dev       # Start the development server
bun run build     # Create a production build
bun run preview   # Preview the production build
bun run test      # Run tests
bun run lint      # Run ESLint
```

## Project structure

- `src/routes/` — storefront, admin, and API routes.
- `src/components/` — storefront and admin interface components.
- `src/lib/` — shop, pricing, cart, and admin logic.
- `src/integrations/supabase/` — Supabase clients and authentication helpers.
- `drizzle/` — database schema and migrations.
- `src/test/` — application tests.

## Important implementation notes

- Cart prices, offers, and order totals are calculated on the server. The browser submits product IDs and quantities, not trusted prices.
- Product and offer images are stored privately and served through the public image API route.
- Public sign-up is disabled. Admin access is reserved for the provisioned owner account.
- The dashboard demo is for local development only; it uses temporary local state and is not a production admin account.
