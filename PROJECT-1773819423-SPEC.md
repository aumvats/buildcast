# BuildCast — Product Specification

> Know before you go. Construction-grade weather intelligence for job sites.

---

## 1. Product Overview

BuildCast is a weather decision engine for construction crews. Instead of checking a generic weather app and guessing "can we pour concrete today?", contractors add their job sites and get instant go/no-go verdicts for specific activities — concrete pours, exterior painting, roofing, crane operations, excavation. Each verdict comes with the exact reason ("NO — temps forecast to drop below 40°F within 48 hours, concrete won't cure") and a 7-day work calendar showing which days are safe. The alternative today is a $500+/month enterprise construction weather tool (Tomorrow.io, DTN WeatherSentry) or just winging it with a phone weather app — which costs the US construction industry $4B+ annually in weather delays. BuildCast sits in the gap: professional-grade weather intelligence at a price small contractors can actually afford.

---

## 2. Target Personas

### Persona 1: Mike — General Contractor (5-person crew)

- **Role:** Owner/operator of a small residential construction company
- **Core pain:** Lost $8,000 last month because he poured a driveway on a day that dropped below freezing overnight — the concrete cracked and had to be redone. He checked his phone weather app but it said "40°F" — it didn't show the overnight dip or the 48-hour cure window.
- **Price sensitivity:** Pays $49/mo for Buildertrend (project management), $0 for weather. Would pay $15-40/mo if it saved even one ruined pour per year (each costs $2,000-10,000+).
- **First "aha" moment:** Adds his current job site address, selects "Concrete Pour" — instantly sees a 7-day calendar with Thursday flagged red: "Overnight low 33°F at 2am Friday. Cure window violated." He realizes he would have poured Thursday without this tool.

### Persona 2: Sandra — Operations Manager at a Painting Company

- **Role:** Schedules 3-4 exterior painting crews across 8-12 active jobs
- **Core pain:** Sends crews to a job site and they sit idle for 2 hours waiting for dew to dry because humidity was 92% at 7am. She wastes $300+ in crew wages per idle morning. Happens 2-3 times per month.
- **Price sensitivity:** Company spends $200/mo on scheduling software. Weather tools budget: $0 currently. $39/mo is trivial against $600-900/mo in wasted crew wages.
- **First "aha" moment:** Sees all 8 job sites on one dashboard — 6 green, 2 yellow ("humidity above 80% until 10am — delay start to 10:30am"). She adjusts crew dispatch in 2 minutes instead of guessing.

### Persona 3: Carlos — Concrete Subcontractor

- **Role:** Runs a 3-person concrete crew, takes jobs from general contractors
- **Core pain:** Gets pressured by GCs to pour on marginal weather days. Needs hard data to push back: "I can't pour Thursday — here's the forecast showing freeze risk." Currently has no professional tool to back up his judgment.
- **Price sensitivity:** Solo operator, very cost-conscious. Free tier with 1 job site would hook him. Would upgrade to $14.99/mo when managing 3-4 simultaneous jobs.
- **First "aha" moment:** Shares a BuildCast link with his GC showing the 48-hour freeze forecast. GC agrees to reschedule. Carlos saves a $5,000 redo.

---

## 3. API Integrations

### Open-Meteo (Primary Weather Data)

- **Base URL:** `https://api.open-meteo.com/v1`
- **Auth:** None — no API key, no signup
- **Rate limits:** Unlimited (fair use policy)
- **Data provided:** Hourly and daily weather forecasts — temperature, precipitation probability, precipitation amount, wind speed, wind gusts, humidity, dew point, soil temperature (multiple depths), soil moisture, UV index, cloud cover, visibility, weather codes. 7-day forecast with hourly resolution.
- **How BuildCast uses it:** For each saved job site, BuildCast fetches the 7-day hourly forecast and runs it through activity-specific rule engines. The concrete rule checks if temperature stays above 40°F for 48 hours post-pour AND no precipitation within 24 hours. The painting rule checks humidity < 85%, no rain for 6 hours, and temp between 50-90°F. Each activity has a distinct rule set applied against the hourly data.
- **Failure mode:** If Open-Meteo is unreachable, show the last cached forecast with a banner: "Weather data last updated [X hours ago]. Refresh when connection returns." Cache the most recent forecast in localStorage per site (valid for 3 hours).

### Open-Meteo Historical (Year-Over-Year Comparison)

- **Base URL:** `https://archive-api.open-meteo.com/v1`
- **Auth:** None
- **Rate limits:** Unlimited (fair use)
- **Data provided:** Historical weather data back to 1940 — same variables as the forecast API.
- **How BuildCast uses it:** Powers the "Historical Context" widget on each job site page. Shows "This week last year" comparison — e.g., "Last March 18, this location saw 0.8 inches of rain and a low of 28°F." Helps contractors spot seasonal patterns. Also used to calculate "average workable days this month" for planning.
- **Failure mode:** Historical context widget shows "Historical data temporarily unavailable" and hides itself. Core go/no-go verdicts are unaffected since they use only forecast data.

### Nominatim (OpenStreetMap Geocoding)

- **Base URL:** `https://nominatim.openstreetmap.org`
- **Auth:** None
- **Rate limits:** 1 request per second (absolute limit, enforced by OpenStreetMap)
- **Data provided:** Forward geocoding (address string → latitude/longitude) and reverse geocoding.
- **How BuildCast uses it:** When a user adds a new job site, they type an address or city name. Nominatim converts this to lat/lng coordinates, which are stored and used for all subsequent Open-Meteo calls. Geocoding only happens once per site (on creation or address edit), not on every forecast fetch.
- **Failure mode:** If Nominatim is down during site creation, show inline error: "Address lookup temporarily unavailable. Try again in a moment, or enter coordinates directly." Offer manual lat/lng input as fallback. Since geocoding is a one-time operation, this doesn't affect existing sites.

### ipapi.co (Auto-Location Detection)

- **Base URL:** `https://ipapi.co`
- **Auth:** None
- **Rate limits:** 1,000 requests per day
- **Data provided:** IP-based geolocation — city, region, country, latitude, longitude, timezone.
- **How BuildCast uses it:** Called once on first visit to auto-suggest the user's location when adding their first job site. Pre-fills the location field so onboarding is faster. Also used to set default units (°F/mph for US, °C/km/h for others).
- **Failure mode:** If ipapi.co is unreachable, skip auto-detection and show an empty location field. The user manually types their address. No degradation of core functionality.

### API Cost Per User (Rule: free-api-economics-check)

| Tier | Sites | Open-Meteo Calls/Month | Nominatim Calls/Month | ipapi Calls/Month | Total API Cost |
|------|-------|------------------------|----------------------|-------------------|---------------|
| Free ($0) | 1 | ~30 (1/day) | 1 (on setup) | 1 (first visit) | $0 |
| Pro ($14.99) | 10 | ~300 (10×1/day) | ~10 | 1 | $0 |
| Business ($39) | Unlimited (typical: 30) | ~900 (30×1/day) | ~30 | 1 | $0 |

All APIs are completely free with no rate limit concerns. Open-Meteo returns a full 7-day hourly forecast in a single request. Even at 10,000 users, total daily API volume is ~10,000 Open-Meteo calls — well within fair use for a free, keyless API.

---

## 4. Core User Flows

### Onboarding Flow (3 steps to value)

1. **User lands on homepage** → clicks "Check Your Job Site" (no signup required)
   - System auto-detects location via ipapi.co and pre-fills a location suggestion
2. **User confirms or edits the location** → selects an activity type from a row of 6 icons (Concrete, Painting, Roofing, Crane, Excavation, General)
   - System geocodes the address via Nominatim, fetches 7-day forecast from Open-Meteo, runs the activity rule engine
3. **User sees the 7-day work calendar** — each day shows a green/yellow/red badge with a one-line reason
   - System renders verdict cards for each day with hourly detail expandable below

Total time: ~15 seconds. No signup. No API key configuration. No settings.

### Flow 2: Multi-Site Dashboard (Returning User)

1. User opens BuildCast → sees dashboard grid of all saved job sites
   - System has refreshed forecasts in background (cached 3 hours)
2. User scans the grid — each site card shows today's verdict badge (green/yellow/red) and the primary concern if yellow/red
3. User taps a yellow site card → sees the full 7-day calendar and identifies that Wednesday has rain risk
4. User taps "Share" on the Wednesday forecast → copies a public link
   - System generates a read-only public URL for that site's forecast (no login needed to view)
5. User sends the link to crew lead via text message: "Heads up, Wednesday looks risky"

---

## 5. Design System

```
Colors:
  primary:       #1D4ED8
  bg:            #F8FAFC
  surface:       #FFFFFF
  border:        #E2E8F0
  text-primary:  #0F172A
  text-secondary:#64748B
  accent:        #D97706
  success:       #10B981
  error:         #EF4444
  warning:       #F59E0B

Typography:
  heading-font:  DM Sans
  body-font:     DM Sans
  h1: 28px, weight 700
  h2: 22px, weight 600
  h3: 18px, weight 600
  body: 15px, line-height 1.5

Spacing:
  base-unit: 4px
  scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

Border Radius:
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px

Animation:
  fast:   120ms ease-out
  normal: 200ms ease-out
  slow:   350ms ease-out

Mode: light
```

**Design rationale:** Light mode is the default and only mode for v1. Construction workers use this outdoors on phones in direct sunlight — dark mode is unreadable in bright conditions. The blue primary (#1D4ED8) evokes sky/weather and signals reliability. The amber accent (#D97706) echoes construction safety colors (hardhats, caution tape) and draws attention to warnings. DM Sans is clean and highly readable at all sizes, with a slightly warmer personality than geometric fonts like Inter — approachable for a non-technical audience. Large touch targets (minimum 44px) and high-contrast text ensure usability with gloved hands and squinting eyes.

---

## 6. Routes

| Path | Page Name | Auth Required | Description |
|------|-----------|--------------|-------------|
| `/` | Landing Page | No | Product pitch, "Check Your Job Site" CTA, pricing |
| `/check` | Quick Check | No | One-shot location + activity → 7-day verdict (no account needed) |
| `/dashboard` | Dashboard | Yes | Grid of saved job sites with today's verdict per site |
| `/site/:id` | Site Detail | Yes | 7-day calendar, hourly breakdown, historical context, activity selector |
| `/site/:id/share` | Shared View | No | Read-only public view of a site's forecast (accessible via share link) |
| `/settings` | Settings | Yes | Account, units (°F/°C), default activities, notification preferences |
| `/pricing` | Pricing | No | Plan comparison and upgrade flow |

---

## 7. Pricing

### Free — $0/month

- 1 job site
- 1 activity type per site
- 7-day forecast with daily verdicts
- Hourly detail view
- Share link (with BuildCast branding)
- **Who it's for:** Solo contractors testing the tool on their current job
- **Upgrade trigger:** When they take on a second simultaneous job and need a second site

### Pro — $14.99/month

- Up to 10 job sites
- All 6 activity types per site
- 7-day forecast with daily + hourly verdicts
- Historical weather context ("this week last year")
- Custom threshold editing (adjust rule temperatures, humidity, wind limits)
- Share links (clean, no branding)
- **Who it's for:** Small contractors and crew leads managing multiple active jobs

### Business — $39/month

- Unlimited job sites
- Everything in Pro
- Team members (up to 10 accounts)
- Crew scheduling view (see all sites + all activities on one calendar)
- CSV export of forecast data
- Priority data refresh (every 1 hour vs 3 hours)
- **Who it's for:** Operations managers at painting, roofing, or concrete companies with multiple crews

Annual billing: 2 months free ($12.49/mo Pro, $32.50/mo Business).

---

## 8. Key User Flows (Detailed)

### Flow 1: First-Time Quick Check (No Signup)

1. User lands on `/` → clicks "Check Your Job Site"
2. System redirects to `/check`, calls ipapi.co, pre-fills city name
3. User adjusts address if needed → selects "Concrete Pour" from activity icons
4. System calls Nominatim to geocode → calls Open-Meteo for 7-day hourly forecast → runs concrete rule engine
5. Page renders 7-day calendar strip: each day shows verdict badge (green checkmark, yellow caution, red X) with one-line reason
6. User clicks a red day → expands to show hourly temperature chart with the 40°F threshold line and the exact hour it crosses
7. User clicks "Save This Site" → prompted to create account (email + password or Google OAuth)
8. After signup, site is saved to their dashboard. Toast: "Site saved. You'll see updated forecasts every time you open BuildCast."
9. **Error state:** If Nominatim can't geocode the address → inline error below the input: "We couldn't find that address. Try a nearby city name or enter coordinates." Offer a "Use current location" button as alternative.

### Flow 2: Morning Dashboard Review

1. User opens `/dashboard` at 6am before dispatching crews
2. System shows grid of saved sites. Each card: site name, address snippet, today's primary verdict badge, and the single most important weather concern (e.g., "Rain starts at 2pm")
3. Forecasts were cached overnight; system triggers background refresh on page load
4. User sees 2 green sites, 1 yellow ("Humidity 88% until 9am — delay start"), 1 red ("Thunderstorms 11am-4pm")
5. User taps the yellow site → Site Detail page opens with full 7-day view
6. User changes activity from "Painting" to "General" using the activity selector → verdicts recalculate instantly (client-side, same weather data, different rules)
7. User taps "Share" → copies URL → texts it to crew lead: "Start at 10am today, humidity clears by then"
8. **Error state:** If Open-Meteo is unreachable during refresh → banner at top: "Using cached forecast from [time]. Live data temporarily unavailable." Cached verdicts still display normally.

### Flow 3: Adding a New Job Site

1. User clicks "+ Add Site" on dashboard
2. Modal appears with: site name field (e.g., "Johnson Residence"), address search field, activity type selector (multi-select for Pro/Business)
3. User types "1425 Oak St, Denver" → Nominatim returns suggestions in a dropdown → user selects the correct one
4. System geocodes, fetches forecast, renders a mini-preview of this week's verdicts in the modal
5. User clicks "Save Site" → modal closes, new site card appears on dashboard with full verdicts
6. **Error state:** If the user has hit their plan's site limit → modal shows: "You've used all [N] sites on your [plan] plan. Upgrade to add more." with upgrade button. Site is not created.
7. **Error state:** If geocoding returns no results → "Address not found. Try searching for a nearby landmark or city." Input stays editable.

### Flow 4: Sharing a Forecast with a Client or GC

1. User is on Site Detail page for "Maple Ave Foundation"
2. User clicks "Share" button in the top-right
3. System generates a unique public URL (e.g., `/site/abc123/share`)
4. Modal shows the URL with a "Copy Link" button and a preview of what the recipient will see
5. User copies the link, sends it via text/email to their general contractor
6. Recipient opens the link — no login needed. Sees a clean, read-only view: site name, 7-day verdicts for the selected activity, hourly charts. BuildCast branding + "Get your own BuildCast" CTA at bottom (free tier) or clean view (Pro+)
7. **Error state:** If the shared link's site has been deleted by the owner → "This forecast is no longer available." page with CTA to sign up.

---

## 9. Technical Constraints

### Performance Targets

- Landing page loads in under 1.5 seconds on 4G mobile
- Quick Check: from "Submit address" to "See verdicts" in under 2 seconds (geocoding + forecast fetch + rule calculation)
- Dashboard with 10 site cards renders in under 1 second (cached data)
- Activity rule engine processes 168 hourly data points (7 days × 24 hours) in under 50ms client-side

### Client-Side vs Server-Side

- **Client-side:** Activity rule engine (all threshold comparisons run in the browser), chart rendering, cached forecast display, unit conversion (°F/°C, mph/km/h)
- **Server-side (Next.js API routes):** Open-Meteo API proxy (to avoid CORS and enable caching), Nominatim proxy (to enforce 1 req/sec rate limit server-side rather than trusting clients), ipapi.co call, user auth, site storage
- **Reasoning:** Proxying weather APIs server-side allows response caching across users in the same region and protects against client-side abuse of Nominatim's rate limit

### Rate Limit Strategy

- **Open-Meteo:** No hard limit, but implement server-side caching. Cache forecast responses for 3 hours (1 hour for Business tier). Multiple users with sites in the same city share the same cached response (round lat/lng to 2 decimal places for cache key).
- **Nominatim:** Enforce 1 request per second at the server level using a simple queue. Geocoding is a one-time operation per site, so volume is inherently low. Cache all geocoding results permanently (addresses don't move).
- **ipapi.co:** Called once per new visitor session. At 1,000/day limit, this supports ~1,000 new unique visitors per day. Cache the result in the user's session/localStorage so it's never called twice for the same user.

### Persistence

- **Supabase:** User accounts, saved job sites (name, address, lat/lng, selected activities, custom thresholds), sharing tokens
- **localStorage:** Last fetched forecast per site (offline fallback), unit preferences for non-logged-in users, ipapi.co result
- **No persistence:** Generated weather data and verdicts are computed fresh from API data. Never stored long-term.

---

## 10. v1 vs v2 Scope

### v1: Build This

- Landing page with product pitch and "Check Your Job Site" CTA
- Quick Check page: location input + activity picker → 7-day verdict calendar (no signup required)
- 6 pre-configured activity rule sets: Concrete Pour, Exterior Painting, Roofing, Crane Operations, Excavation, General Construction
- 7-day forecast with daily go/no-go badge (green/yellow/red) and one-line reason per day
- Expandable hourly detail per day showing temperature, wind, humidity, and precipitation charts
- User accounts (email/password + Google OAuth) via Supabase Auth
- Dashboard showing all saved sites with today's verdict
- Site Detail page with activity switcher and 7-day calendar
- Shareable read-only forecast link per site
- Free tier (1 site, 1 activity) and Pro tier ($14.99/mo, 10 sites, all activities)
- Mobile-responsive layout (most users will check on their phone at the job site)

### v2: Deferred

- Business tier ($39/mo) with team accounts and crew scheduling view
- Custom threshold editing (adjust temperature, humidity, wind limits per activity)
- Historical weather context widget ("this week last year")
- Push notifications / SMS alerts for weather changes on saved sites
- Multi-day activity planning ("I need 3 consecutive dry days for this job — when's the next window?")
- Calendar integration (export verdicts to Google Calendar / iCal)
- Dark mode (for office-based operations managers)
- CSV export of forecast data
- Embeddable widget for contractor websites ("Live job site weather")

**v1 ships when:** A user can add a job site, see accurate go/no-go verdicts for 6 activity types across 7 days, and share a forecast link — all within 30 seconds of landing on the site.

**v2 begins when:** 50+ active free users confirm that the activity rules match their real-world decision-making, and at least 10 users have converted to Pro.
