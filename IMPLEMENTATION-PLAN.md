# BuildCast — Implementation Plan

## Tech Stack
- Framework: Next.js 14 (App Router), TypeScript
- Styling: Tailwind CSS with custom theme tokens, DM Sans via Google Fonts
- Database: Supabase (PostgreSQL + Auth)
- Auth: Supabase Auth (email/password + Google OAuth)
- APIs: Open-Meteo forecast, Nominatim geocoding, ipapi.co geolocation (all proxied)
- Deployment: Vercel

## Project Setup
- Package manager: npm
- Key dependencies: `@supabase/supabase-js @supabase/ssr recharts lucide-react`
- Init: `npx create-next-app@latest buildcast --typescript --tailwind --app --src-dir`

### Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
No keys required for Open-Meteo, Nominatim, or ipapi.co.

### Tailwind Config (tailwind.config.ts)
```ts
theme: { extend: {
  colors: {
    primary: '#1D4ED8', bg: '#F8FAFC', surface: '#FFFFFF',
    border: '#E2E8F0', 'text-primary': '#0F172A', 'text-secondary': '#64748B',
    accent: '#D97706', success: '#10B981', error: '#EF4444', warning: '#F59E0B',
  },
  fontFamily: { sans: ['DM Sans', 'sans-serif'] },
  borderRadius: { sm: '6px', md: '10px', lg: '16px', full: '9999px' },
  transitionDuration: { fast: '120ms', normal: '200ms', slow: '350ms' },
}}
```
Add `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap')` in `globals.css`.

## Supabase Schema
```sql
-- Run in Supabase SQL editor
create table sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  selected_activities text[] not null default '{general}',
  share_token text unique not null default gen_random_uuid()::text,
  created_at timestamptz default now()
);

create table geocode_cache (
  query text primary key,
  lat double precision not null,
  lng double precision not null,
  display_name text not null,
  cached_at timestamptz default now()
);

alter table sites enable row level security;
create policy "Users manage own sites" on sites for all using (auth.uid() = user_id);
-- geocode_cache is public read, service_role write
alter table geocode_cache enable row level security;
create policy "Public read geocode" on geocode_cache for select using (true);
```

## File Structure
```
src/
├── app/
│   ├── layout.tsx               # Root layout: DM Sans font, bg color, Toast provider
│   ├── page.tsx                 # Landing page
│   ├── check/
│   │   └── page.tsx             # Quick Check (no auth)
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard (auth required)
│   ├── site/
│   │   └── [id]/
│   │       ├── page.tsx         # Site Detail (auth required, :id = site UUID)
│   │       └── share/
│   │           └── page.tsx     # Shared View (no auth, :id = share_token)
│   ├── settings/
│   │   └── page.tsx             # Settings (auth required)
│   ├── pricing/
│   │   └── page.tsx             # Pricing page (no auth)
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   ├── signup/page.tsx      # Signup page
│   │   └── callback/route.ts    # OAuth callback handler
│   └── api/
│       ├── weather/route.ts     # Proxy: Open-Meteo forecast (3h cache)
│       ├── geocode/route.ts     # Proxy: Nominatim + permanent cache
│       └── geolocate/route.ts  # Proxy: ipapi.co
├── components/
│   ├── ui/
│   │   ├── Button.tsx           # Primary/secondary/ghost variants, min 44px
│   │   ├── Badge.tsx            # green/yellow/red verdict badge
│   │   ├── Card.tsx             # Surface card with border
│   │   ├── Modal.tsx            # Portal modal with backdrop
│   │   ├── Toast.tsx            # Toast notification system
│   │   └── Spinner.tsx          # Loading spinner
│   └── features/
│       ├── Header.tsx           # Nav: logo, auth state, + Add Site button
│       ├── ActivityPicker.tsx   # 6-icon row (Concrete/Paint/Roof/Crane/Excavation/General)
│       ├── LocationInput.tsx    # Address search with Nominatim dropdown suggestions
│       ├── SiteCard.tsx         # Dashboard card: name, address, today's verdict
│       ├── VerdictCalendar.tsx  # 7-day strip of verdict badges with one-line reasons
│       ├── DayCard.tsx          # Expandable day: verdict + hourly charts
│       ├── HourlyCharts.tsx     # Recharts line charts: temp, wind, humidity, precip
│       ├── AddSiteModal.tsx     # Modal for adding new job site
│       └── ShareModal.tsx       # Share link modal with copy button
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # createBrowserClient()
│   │   ├── server.ts            # createServerClient() for API routes/server components
│   │   └── middleware.ts        # Session refresh logic
│   ├── api/
│   │   ├── weather.ts           # fetchForecast(lat, lng): calls /api/weather
│   │   ├── geocode.ts           # geocodeAddress(query), suggestions(partial)
│   │   └── geolocate.ts         # getIPLocation(): calls /api/geolocate, caches in localStorage
│   ├── rules/
│   │   ├── engine.ts            # runRules(hourlyData[], activity, day): returns Verdict
│   │   ├── concrete.ts          # Concrete Pour rules
│   │   ├── painting.ts          # Exterior Painting rules
│   │   ├── roofing.ts           # Roofing rules
│   │   ├── crane.ts             # Crane Operations rules
│   │   ├── excavation.ts        # Excavation rules
│   │   └── general.ts           # General Construction rules
│   └── utils/
│       ├── units.ts             # convertTemp(f, unit), convertWind(mph, unit)
│       ├── cache.ts             # localStorage helpers: getForecastCache, setForecastCache
│       └── format.ts            # formatDate, formatTemp, weatherCodeToLabel
├── types/
│   ├── weather.ts               # OpenMeteoResponse, HourlyData, DailyData
│   ├── site.ts                  # Site, SiteWithVerdicts
│   └── rules.ts                 # Verdict { status: 'green'|'yellow'|'red', reason: string }
└── middleware.ts                 # Protect /dashboard, /site/*/page (not /share), /settings
```

## Pages & Routes (build priority order)

1. **`/` Landing** — Hero: "Know before you go", "Check Your Job Site" CTA → `/check`. Three personas (Mike/Sandra/Carlos) pain points. Activity icons preview. Pricing summary. Footer.
2. **`/check` Quick Check** — Auto-detects location (ipapi.co → localStorage). LocationInput + ActivityPicker. On submit: geocode → fetch forecast → run rules → render VerdictCalendar. "Save This Site" button → if not logged in, redirect to `/auth/signup?redirect=/check` with pending site in sessionStorage.
3. **`/auth/login` + `/auth/signup`** — Supabase Auth forms. Email/password + "Continue with Google" button. After signup, save pending site if exists, redirect to `/dashboard`.
4. **`/dashboard`** — Grid of SiteCards (2-col mobile, 3-col desktop). "+ Add Site" button → AddSiteModal. On load: fetch all user sites from Supabase, fetch forecasts (with localStorage cache fallback), run rules client-side. Stale cache banner if data > 3h old.
5. **`/site/[id]`** — Full page for one site. ActivityPicker to switch activity (recalculates verdicts instantly, no new fetch). VerdictCalendar with expandable DayCards showing HourlyCharts. "Share" button → ShareModal. "Edit Site" to change name/address.
6. **`/site/[id]/share`** — Server-rendered. Fetches site by `share_token`. Shows read-only VerdictCalendar. BuildCast branding + "Get your own" CTA for free tier. No auth required.
7. **`/pricing`** — Three-column plan comparison: Free/$0, Pro/$14.99/mo, Business (coming soon). Upgrade CTA links to Supabase-based checkout (placeholder for v1 — "Contact us" or Stripe link).
8. **`/settings`** — Unit toggle (°F/°C, mph/km/h). Account email. Sign out. Saved to localStorage + Supabase user metadata.

## Components Inventory

**ActivityPicker** — Props: `selected: string, multi: boolean, onChange(activity)`. 6 icons with labels. Multi-select for Pro users. Single-select for Free/Quick Check.

**LocationInput** — Props: `defaultValue?: string, onSelect(lat, lng, displayName)`. Calls `/api/geocode?q=...` for suggestions dropdown (debounced 300ms). Shows spinner during lookup. Error state: "Address not found. Try a city name."

**SiteCard** — Props: `site: Site, verdict: Verdict`. Shows: site name, address snippet (truncated), verdict badge, primary concern string, "Last updated X min ago". Click → navigate to `/site/[id]`.

**VerdictCalendar** — Props: `days: DayVerdict[], activity: string`. 7 day strip. Each day: day name, date, Badge (green/yellow/red), one-line reason. Click to expand DayCard.

**DayCard** — Props: `day: DayVerdict, hourly: HourlyData[]`. Collapsed: shows Badge + reason. Expanded: shows HourlyCharts for temp, wind, humidity, precipitation. Transition: `slow` (350ms).

**HourlyCharts** — Props: `hourly: HourlyData[], thresholds: Record<string, number>`. Four Recharts `<LineChart>` panels. Reference lines for thresholds (e.g., 40°F for concrete temp). 24-hour window for selected day.

**AddSiteModal** — Modal with: site name input, LocationInput, ActivityPicker (single for Free, multi for Pro). Shows mini-preview of this week's verdicts after geocoding. "Save Site" → POST to Supabase. Plan limit check: if user at limit, show upgrade prompt instead.

**ShareModal** — Shows share URL (`${APP_URL}/site/${share_token}/share`). Copy button. Link preview description.

## API Integration Plan

### `/api/weather` (Open-Meteo proxy)
- Method: GET, params: `?lat=X&lng=Y&unit=fahrenheit`
- Upstream: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,windgusts_10m,relativehumidity_2m,dewpoint_2m,cloudcover,visibility,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`
- Cache: `next: { revalidate: 10800 }` (3h). Cache key: lat/lng rounded to 2 decimals.
- Error: return `{ error: 'unavailable', cached: true }` — client uses localStorage fallback.

### `/api/geocode` (Nominatim proxy)
- Method: GET, params: `?q=address+string`
- First: check `geocode_cache` table in Supabase. If hit → return cached.
- If miss: call `https://nominatim.openstreetmap.org/search?q={q}&format=json&limit=5` with header `User-Agent: BuildCast/1.0 (contact@buildcast.app)`.
- Rate limit: server-side `await sleep(1000)` before each upstream call (acceptable for one-time-per-site geocoding).
- Store result in `geocode_cache` table permanently.
- Error: return `{ error: 'geocoding_unavailable' }` — client shows manual lat/lng input.

### `/api/geolocate` (ipapi.co proxy)
- Method: GET, no params (uses request IP)
- Upstream: `https://ipapi.co/json/`
- No caching on server (stateless). Client caches in localStorage key `buildcast_location`.
- Error: return `{ error: 'unavailable' }` — client shows empty LocationInput.

## Activity Rule Engine (`lib/rules/engine.ts`)

Input: `hourlyData: HourlyData[]` (168 points), `activity: string`, `dayIndex: number` (0-6).
Each rule file exports `evaluate(dayHours: HourlyData[], allHours: HourlyData[], dayIndex: number): Verdict`.

Rules applied against work hours 8am–5pm for current day, plus lookahead windows where needed:

| Activity | Key Checks |
|----------|-----------|
| Concrete | temp > 40°F for 48h from pour time; no precip > 0.1in for 24h; wind < 25mph during work |
| Painting | humidity < 85%; no precip for 6h; temp 50-90°F; wind < 25mph |
| Roofing | no precip during work; wind < 25mph; temp > 35°F; no ice weathercodes |
| Crane | wind < 20mph; gusts < 30mph; no thunderstorm codes; visibility > 1000m |
| Excavation | no heavy precip in prior 24h; no active precip; temp > 32°F |
| General | no precip 8am-5pm; temp > 32°F; wind < 30mph; no severe weather codes |

Yellow zone: within 10% of any threshold (or in yellow ranges specified per activity).

Weather codes reference: `<3` = clear/cloudy, `45,48` = fog, `51-67` = rain, `71-77` = snow, `80-82` = showers, `95-99` = thunderstorm.

## Data Flow

1. **User adds site** → AddSiteModal → `/api/geocode` → Supabase `sites` table → trigger forecast fetch
2. **Forecast fetch** → client calls `lib/api/weather.ts` → `/api/weather` (proxied, cached) → JSON response
3. **Rule calculation** → client passes hourly data to `lib/rules/engine.ts` → array of 7 `Verdict` objects
4. **Dashboard render** → for each site: read localStorage cache, if stale trigger background refresh, display verdicts
5. **Activity switch** → no new fetch, recalculate verdicts from same hourly data, instant rerender
6. **Share flow** → site has `share_token` column → share URL uses token → `/site/[token]/share` server renders with `share_token` lookup (service_role bypasses RLS)

**State management:** React state + prop drilling (no global state library needed). useLocalStorage hook for unit preference and forecast cache.

**Free vs Pro enforcement:**
- Check `sites.length` on dashboard load. Free: max 1 site, 1 activity. Pro: max 10 sites, all activities.
- Plan tier stored in Supabase `auth.users` metadata (`plan: 'free' | 'pro'`). Set via service_role key.
- For v1: no payment integration — Pro upgrade shows "Contact us" or Stripe payment link placeholder. Users manually upgraded by admin.

## Build Order (step-by-step)

1. `npx create-next-app@latest buildcast --typescript --tailwind --app --src-dir`
2. `npm install @supabase/supabase-js @supabase/ssr recharts lucide-react`
3. Configure `tailwind.config.ts` with design tokens above
4. Add Google Fonts to `app/layout.tsx`; set `body bg-bg text-text-primary font-sans`
5. Run Supabase SQL schema (sites + geocode_cache tables + RLS)
6. Create `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`
7. Create `src/middleware.ts` — protect `/dashboard`, `/site/*/page (not share)`, `/settings`
8. Build UI primitives: `Button`, `Badge`, `Card`, `Modal`, `Toast`, `Spinner`
9. Build `Header.tsx` with logo, nav links, auth state (logged in/out)
10. Build API routes: `/api/weather`, `/api/geocode`, `/api/geolocate`
11. Define TypeScript types in `src/types/`
12. Build rule engine: `engine.ts` + all 6 activity rule files
13. Build `ActivityPicker.tsx` and `LocationInput.tsx` (reused across pages)
14. Build `/check` page — the full Quick Check flow with all components
15. Build `VerdictCalendar.tsx`, `DayCard.tsx`, `HourlyCharts.tsx` (tested on /check first)
16. Build `/auth/login` and `/auth/signup` pages + `/auth/callback/route.ts`
17. Build `SiteCard.tsx` and `AddSiteModal.tsx`
18. Build `/dashboard` page (requires auth, AddSiteModal, SiteCard grid)
19. Build `/site/[id]` page (ActivityPicker, VerdictCalendar, ShareModal)
20. Build `/site/[id]/share/page.tsx` — server component, share_token lookup
21. Build `/pricing` page (static, 3-column plan comparison)
22. Build `/settings` page (unit toggle, sign out)
23. Test full flow: landing → check → signup → dashboard → site detail → share
24. `npm run build` — fix all TypeScript and build errors

## Known Risks

- **Nominatim 1 req/sec**: Server-side `sleep(1000)` works on single instance but Vercel may fan out. For v1 volume (low), acceptable. Long-term: queue in Supabase or Redis.
- **Next.js `revalidate` caching on Vercel**: `next: { revalidate: 10800 }` works in App Router fetch calls. Verify caching behavior in production with Vercel cache headers.
- **Recharts SSR**: Recharts requires `'use client'`. HourlyCharts must be a client component. No SSR of charts.
- **Pro tier payment**: No Stripe integration in v1. Plan stored in user metadata, manually set. Document this gap clearly.
- **Share token collision**: `gen_random_uuid()` is collision-resistant. No risk in practice.
- **ipapi.co 1,000/day limit**: Only called once per new visitor (cached in localStorage). At scale, add server-side session cookie to prevent re-calls.
- **48h concrete lookahead**: Day 7 of forecast cannot fully check 48h cure window — only 16-24h of future data. Show yellow ("Cure window extends beyond forecast range") for day 6-7.

## Plugin Usage Notes
- Builder: Use `/feature-dev` for `/check` (complex API chain + rule engine), `/dashboard` (multi-site data orchestration), `/site/[id]` (activity switcher + charts)
- Builder: Use `/frontend-design` with **light-first, professional-minimal, high-contrast** aesthetic for landing page (`/`) and pricing page
- QA: Run `silent-failure-hunter` on `src/app/api/weather/route.ts`, `src/app/api/geocode/route.ts`, `src/lib/rules/engine.ts`
- QA: Run `code-reviewer` on `src/lib/rules/` (all rule files — logic errors here cause wrong verdicts)
- Designer: Aesthetic direction is **light-first, functional-minimal**. Amber accent for warnings/caution. Blue primary for CTAs. Large touch targets (min-h-[44px]). High contrast for outdoor sunlight readability.
