# Build Constraints — BuildCast

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL for user accounts and saved sites)

## Design System

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

Light mode only for v1. Target audience uses this outdoors on phones in sunlight. Blue primary evokes weather/sky + reliability. Amber accent echoes construction safety colors. DM Sans loaded via Google Fonts (weights 400, 500, 600, 700). Minimum touch target: 44px.

## API Integrations

### Open-Meteo (Weather Forecast)
- Base URL: `https://api.open-meteo.com/v1`
- Auth: None
- Returns hourly + daily forecast data. Proxy through Next.js API route. Cache responses for 3 hours (keyed by lat/lng rounded to 2 decimals).
- Endpoint pattern: `/forecast?latitude={lat}&longitude={lng}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,windgusts_10m,relativehumidity_2m,dewpoint_2m,cloudcover,visibility,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`

### Open-Meteo Historical (v2 — deferred)
- Base URL: `https://archive-api.open-meteo.com/v1`
- Auth: None
- Not needed for v1. Will power "this week last year" comparisons in v2.

### Nominatim (Geocoding)
- Base URL: `https://nominatim.openstreetmap.org`
- Auth: None
- Rate limit: 1 req/sec — enforce server-side with queue
- Proxy through Next.js API route. Cache all geocoding results permanently. Include `User-Agent: BuildCast/1.0` header as required by Nominatim usage policy.

### ipapi.co (IP Geolocation)
- Base URL: `https://ipapi.co`
- Auth: None
- Rate limit: 1,000 req/day
- Called once per new visitor to auto-detect location. Cache result in localStorage.

## Build Rules
- npm run build MUST pass before you consider any agent done
- No placeholder content (lorem ipsum, "coming soon", fake data)
- No external images unless from a free CDN — use SVG icons
- Error states must be visible in the UI, not just console.log
- Mobile-responsive by default
- All weather data fetches go through Next.js API routes (never call Open-Meteo or Nominatim directly from the client)
- Activity rule engine runs client-side for instant recalculation when switching activities
- Verdicts: green = all conditions met, yellow = marginal (within 10% of a threshold), red = at least one condition violated
- Each verdict card must show the specific reason (not just "Bad weather")
- Minimum touch target: 44px on all interactive elements

## Activity Rule Definitions

These are the 6 activity types and their go/no-go rules applied against hourly forecast data:

### Concrete Pour
- Temperature must stay above 40°F for 48 hours after pour
- No precipitation (> 0.1 inches) within 24 hours after pour
- Wind speed below 25 mph during pour
- Yellow zone: temp 40-45°F, or precipitation probability 30-50%

### Exterior Painting
- Relative humidity below 85%
- No precipitation for 6 hours after application
- Temperature between 50°F and 90°F
- Wind speed below 25 mph (affects spray painting)
- Yellow zone: humidity 75-85%, temp 50-55°F or 85-90°F

### Roofing
- No precipitation during work hours
- Wind speed below 25 mph (safety on pitched roofs)
- Temperature above 35°F (shingles become brittle below)
- No ice/frost conditions (weather code check)
- Yellow zone: wind 20-25 mph, temp 35-40°F

### Crane Operations
- Wind speed below 20 mph (standard safe limit)
- Wind gusts below 30 mph
- No thunderstorm weather codes
- Visibility above 1000 meters
- Yellow zone: wind 15-20 mph, gusts 25-30 mph

### Excavation / Grading
- No heavy precipitation (> 0.5 inches) in prior 24 hours
- No active precipitation during work
- Temperature above 32°F (frozen ground)
- Yellow zone: light rain in prior 24 hours, temp 32-36°F

### General Construction
- No active precipitation during work hours (8am-5pm)
- Temperature above 32°F
- Wind below 30 mph
- No severe weather codes (thunderstorm, ice storm, heavy snow)
- Yellow zone: precipitation probability 30-50%, wind 25-30 mph

## v1 Scope Boundary

Build these and nothing else:

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

Do NOT build: custom thresholds, historical weather context, notifications/SMS, multi-day window planning, calendar export, dark mode, CSV export, embeddable widgets, team/Business tier features.
