# BuildCast

Construction-grade weather intelligence for job sites. Get instant go/no-go verdicts for concrete pours, painting, roofing, crane operations, and more.

## Setup

1. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

2. Create the required Supabase tables by running the SQL schema from `IMPLEMENTATION-PLAN.md` in the Supabase SQL editor.

3. (Optional) Enable Google OAuth in Supabase Auth settings.

4. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (default: `http://localhost:3000`) |

## Spec

See [PROJECT-1773819423-SPEC.md](./PROJECT-1773819423-SPEC.md) for the full product specification.
