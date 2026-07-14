# Altara Automotive

A production used-car dealership website — a dark, monochrome-luxury public storefront backed by Supabase, with an auth-gated admin panel for managing inventory, photos and enquiries.

**Stack:** Next.js 16 (App Router, Turbopack, React 19 + React Compiler) · TypeScript (strict) · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage, RLS) · Framer Motion · GSAP · zod + react-hook-form · lucide-react.

> This business does **not** offer financing — there is deliberately no finance page, form, calculator or FCA disclosure anywhere in the site.

---

## 1. Prerequisites

- Node.js 20+
- A **Supabase** project (this build was set up to use a fresh, dedicated Supabase account — see below).

## 2. Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values (see §3)
npm run dev                  # http://localhost:3000
```

The site runs before the database is configured — inventory pages simply show empty states until you complete §4.

## 3. Environment variables (`.env.local`)

| Variable | Where to find it | Exposed to browser? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon / publishable key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → **service_role** secret | **No — server only** |
| `SUPABASE_DB_URL` | Project Settings → Database → Connection string → **URI** | No (scripts only) |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL (e.g. `https://altara-automotive.co.uk`) | Yes |

## 4. Database setup (one command)

The full schema, row-level security, storage bucket and 12 seed vehicles are applied in one step. With `SUPABASE_DB_URL` set in `.env.local`:

```bash
npm run db:setup          # schema + RLS + storage + seed inventory
# or, schema only (no seed):
npm run db:setup -- --no-seed
```

This runs [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) then [`supabase/seed.sql`](supabase/seed.sql). It is idempotent — safe to re-run.

> Prefer the dashboard? Paste those two SQL files into the Supabase **SQL Editor** instead.

Seed vehicles start with **no photos** and show on-brand branded placeholders. Uploading a real photo in the admin supersedes the placeholder automatically.

## 5. Create the first admin

1. In Supabase → **Authentication → Users → Add user**, create your login (email + password, mark email confirmed).
2. Promote it to an Altara admin:

```bash
npm run db:add-admin -- you@altara-automotive.co.uk
```

3. Sign in at **`/admin/login`**.

Admin routes are gated two ways: an optimistic redirect in [`src/proxy.ts`](src/proxy.ts) (Next.js 16's renamed middleware) and an authoritative `is_admin()` check in the admin Data Access Layer ([`src/lib/dal.ts`](src/lib/dal.ts)) and **every** server action.

## 6. Admin panel (`/admin`)

- **Dashboard** — stock + enquiry stats, recent activity.
- **Vehicles** — searchable/filterable table; add/edit, change status, feature toggle, delete.
- **Vehicle editor** — full spec form (zod-validated, slug auto-generated) + **image manager** (multi-upload → auto-converted to WebP via `sharp`, reorder, delete, first image = primary).
- **Enquiries** — every lead (enquiry, viewing, test-drive, sell, newsletter) with a "mark handled" toggle.

## 7. Deploy to Vercel

1. Push the repo to GitHub and import it into Vercel (framework auto-detected as Next.js).
2. Add all five environment variables from §3 to the Vercel project (Production + Preview). Keep `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_DB_URL` as un-exposed server env.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Deploy. Add your Supabase project URL to the `next.config.ts` image `remotePatterns` if you use a custom storage domain (the default `*.supabase.co` covers standard projects).

## 8. Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (runs type-check) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:setup` | Apply schema + RLS + storage + seed |
| `npm run db:add-admin -- <email>` | Promote an existing auth user to admin |

## 9. Project structure

```
src/
  app/(marketing)/     Public site (home, inventory, detail, about, sell, contact, faq, legal)
  app/admin/           Login + auth-gated dashboard (vehicles CRUD, image manager, enquiries)
  components/          ui / layout / home / inventory / vehicle / forms / motion / admin / brand
  lib/                 supabase clients, queries, server actions, validators, seo, utils, constants
  types/               hand-authored Supabase types
  proxy.ts             admin auth gate (Next 16 proxy = middleware)
supabase/              migration + seed SQL
scripts/               db-setup + add-admin (run over SUPABASE_DB_URL)
```

---

## 10. Handover — items for the client to confirm

Everything below is a **clearly-labelled placeholder** in the code (search `CLIENT-CONFIRM`) or rendered as "coming soon". Nothing false ships.

- **Email address** — currently "coming soon" (`src/lib/constants.ts` → `BUSINESS.email`).
- **Showroom address & Google Map** — the map is a styled placeholder; supply the exact address to embed a real map (`BUSINESS.address`, `src/components/contact/map-placeholder.tsx`).
- **Facebook & Instagram** — "coming soon"; add the URLs to `BUSINESS.socials`.
- **Legal entity name** — `BUSINESS.legalName` (currently "Altara Automotive Ltd").
- **Opening hours** — placeholder times in `OPENING_HOURS`.
- **Homepage stats** — "cars delivered / review score / years established" in `STATS` are placeholder figures; replace with real numbers (or remove the section).
- **Testimonials** — sample reviews in `src/components/home/testimonials.tsx`; replace with real customer reviews.
- **Privacy Policy & Terms** — DRAFT boilerplate; must be reviewed by the client's solicitor before publication.
- **Real vehicle photography** — seed cars use branded placeholders; upload real photos in the admin.
- **Deposit & warranty terms** — noted as "client to confirm" in the FAQ / Terms.

Confirmed and already wired: the two phone numbers (`07831 213807`, `07848 689405`) and WhatsApp on the same numbers.
