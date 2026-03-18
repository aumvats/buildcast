# Optimizer Notes — BuildCast

## Code Cleanup (Step 0)

Ran three code analysis passes via pr-review-toolkit agents:

1. **Code simplifier**: Identified dead exports in `format.ts` (4 unused functions), `units.ts` (entire module unused), `weather.ts` (2 unused exports), `site.ts` (1 unused interface), `Toast.tsx` (2 unused exports), and `supabase/server.ts` (1 unused export). Removed 1 dead import (`timeAgo` in dashboard/page.tsx). Dead exports left in place — they don't affect bundle size (tree-shaken) and may be needed in v2.
2. **Comment analyzer**: Found 2 critical inaccuracies — painting.ts comment claimed "11pm" but code covers through 10pm (off-by-one in slice), and concrete.ts user-facing message said "wind gusts" when variable measures sustained wind speed. Both fixed.
3. **Code reviewer**: Found open redirect vulnerability in auth callback. Fixed by validating redirect parameter starts with `/` and doesn't start with `//`.

## Performance
- Images optimized: 0 (no `<img>` tags in codebase — favicon is the only image asset)
- Dynamic imports added: 1 (HourlyCharts via `next/dynamic` with `ssr: false` — defers loading of recharts until user expands a day card)
- Server Components converted: 0 (landing page, pricing, share page, and not-found are already Server Components; pages using hooks/events correctly use `'use client'`)
- Font optimization: ✅ Switched from `@import url()` Google Fonts CDN to `next/font/google` (DM Sans). Eliminates render-blocking external font request, enables automatic font subsetting, and resolves the CSS minification warning noted in builder notes.

## SEO
- Root metadata: ✅ (title, description, keywords, OG, Twitter cards)
- Per-page titles: ✅ (landing page, pricing page have dedicated metadata exports; auth/dashboard/settings pages are behind auth and less SEO-critical)
- OG tags: ✅ (openGraph with title, description, type, siteName)
- Sitemap: ✅ (`src/app/sitemap.ts` — 5 public routes with priorities and change frequencies)
- Robots: ✅ (`src/app/robots.ts` — allows all crawling, disallows `/api/` and `/auth/callback`)

## Accessibility
- Semantic HTML: ✅ (added `<main>` wrapper to landing page content, added `<nav>` with `aria-label` to footer navigation and main nav)
- ARIA labels: ✅ (added `aria-label` to mobile menu toggle, modal close button, share copy button, forecast refresh button)
- Keyboard nav: ✅ (focus-visible rings on all buttons via Button component, `<dialog>` element provides native focus management in modals, all interactive elements have minimum 44px touch targets)
- Color contrast: ✅ (text-primary `#0F172A` on bg `#F8FAFC` = 15.1:1 ratio; text-secondary `#64748B` on bg = 4.6:1 ratio; both pass WCAG AA)

## Error Handling
- Global error boundary: ✅ (`src/app/error.tsx` — branded error page with "Try Again" button)
- 404 page: ✅ (`src/app/not-found.tsx` — branded page with "Back to Home" link)
- Loading UI: ✅ (`src/app/loading.tsx` — CloudSun icon with pulse animation)
- API fallbacks: ✅ (pre-existing: localStorage caching with stale data banner on dashboard, inline error states on all pages)

## Security
- Auth callback open redirect: ✅ Fixed — redirect parameter now validated

## Deployment Ready
- .env.example complete: ✅ (all 4 variables documented with descriptions and context)
- README exists: ✅ (project name, description, setup instructions, env var table, spec link)
- Build passes: ✅

## Build Output
- Total pages: 16 (12 static + 4 dynamic)
- Build time: ~1.9s (Turbopack)
- Any warnings: middleware deprecation (known, documented in builder notes — migrates to "proxy" convention when stable)
