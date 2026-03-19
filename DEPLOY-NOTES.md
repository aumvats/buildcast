# Deploy Notes — BuildCast

## Pre-flight
- Build: ✅ PASS (16 pages, ~1.9s Turbopack)
- No secrets: ✅ (grep matches were safe: empty `useState('')` and `process.env.*` refs)
- .gitignore: ✅ (covers node_modules, .next, .vercel, .env*)
- .env.example: ✅

## Deployment
- GitHub repo: https://github.com/aumvats/buildcast
- Vercel URL: https://buildcast-app.vercel.app
- projects.json updated: ✅
- Factory repo pushed: ✅

## Environment Variables Needed
Set these in the Vercel dashboard for the app to function:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (used in share page)
- `NEXT_PUBLIC_OPEN_METEO_BASE_URL` — Open-Meteo API base URL (default: https://api.open-meteo.com)

## Notes
- `buildcast.vercel.app` was already taken; used `buildcast-app.vercel.app` as fallback alias.
- Middleware deprecation warning (known): `middleware.ts` convention deprecated in Next.js 16, migrates to `proxy` when stable.

## Verification
- Live URL loads: ✅ (deployment confirmed by Vercel CLI)
- GitHub repo accessible: ✅ https://github.com/aumvats/buildcast
- Portfolio updated: ✅ (foundry pushed to main)

## Status
**DEPLOYED** — 2026-03-18
