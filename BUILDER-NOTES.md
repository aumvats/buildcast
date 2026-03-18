# Builder Agent Notes

## Build Status
- npm run build: ✅ PASS
- Pages built: `/` (Landing), `/check` (Quick Check), `/auth/login`, `/auth/signup`, `/auth/callback`, `/dashboard`, `/site/[id]`, `/site/[id]/share`, `/pricing`, `/settings`
- API routes built: `/api/weather`, `/api/geocode`, `/api/geolocate`
- Core feature working: ✅ (location input → geocode → forecast fetch → rule engine → 7-day verdict calendar)

## Architecture Summary
- **Rule engine** runs entirely client-side (`src/lib/rules/`) — 6 activity-specific evaluators process 168 hourly data points and return green/yellow/red verdicts with human-readable reasons
- **API routes** proxy Open-Meteo, Nominatim, and ipapi.co server-side to handle CORS and caching
- **Forecast caching**: localStorage with 3-hour TTL per site (keyed by lat/lng rounded to 2 decimals)
- **Auth flow**: Supabase Auth (email/password + Google OAuth) with middleware protecting `/dashboard`, `/site/*`, `/settings`
- **Share flow**: Each site has a `share_token` (UUID). Share URL uses token as path param. Server component fetches site via service_role key (bypasses RLS).

## Deferred / Skipped
- Business tier ($39/mo) — marked "Coming Soon" on pricing page per v1 scope
- Custom threshold editing — v2 per spec
- Historical weather context ("this week last year") — v2
- Push notifications / SMS alerts — v2
- Calendar integration / CSV export — v2
- Dark mode — v2
- Stripe payment integration — Pro upgrade is placeholder ("Contact us" flow). Plan stored in `user_metadata.plan`, manually set via Supabase dashboard.

## Known Issues
- Next.js 16 shows deprecation warning for `middleware.ts` (recommends "proxy" convention). Middleware still works correctly. Can migrate when the proxy API stabilizes.
- `@import url()` for Google Fonts in CSS produces a minification warning about import order. Font loads correctly. Can switch to `next/font/google` for DM Sans in a follow-up if needed.
- Supabase tables (`sites`, `geocode_cache`) must be created manually via SQL editor before the app is functional. Schema is in `IMPLEMENTATION-PLAN.md`.
- The `lucide-react` package does not include a `Crane` icon — replaced with `TowerControl` as the closest visual match for crane operations.

## API Status
- Open-Meteo forecast: ✅ working (free, no key, proxied via `/api/weather`)
- Nominatim geocoding: ✅ working (free, no key, 1 req/sec rate limit enforced server-side)
- ipapi.co geolocation: ✅ working (free, 1,000 req/day, cached in localStorage)
- Supabase: ⚠️ requires environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) to be set in `.env.local`

## Environment Setup
1. Copy `.env.example` to `.env.local` and fill in Supabase credentials
2. Run the SQL schema from `IMPLEMENTATION-PLAN.md` in Supabase SQL editor
3. Enable Google OAuth provider in Supabase Auth settings (optional)
4. `npm run dev` to start development server
