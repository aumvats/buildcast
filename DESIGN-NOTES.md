# Design Notes — BuildCast

## Design System Applied
- Color tokens: ✅ all match spec (`#1D4ED8` primary, `#F8FAFC` bg, `#FFFFFF` surface, `#E2E8F0` border, `#0F172A` text-primary, `#64748B` text-secondary, `#D97706` accent, `#10B981` success, `#EF4444` error, `#F59E0B` warning)
- Typography: ✅ DM Sans loaded from Google Fonts, h1=28px/700, h2=22px/600, h3=18px/600, body=15px/1.5
- Spacing: ✅ base 4px scale used throughout (4, 8, 12, 16, 24, 32, 48, 64)
- Border radii: ✅ sm=6px, md=10px, lg=16px, full=9999px via `@theme inline`
- Animations: ✅ fast=120ms, normal=200ms, slow=350ms via `@theme inline`; added `--color-primary-hover: #1E40AF` for consistent hover state

## Changes Made

1. **[src/app/globals.css]** — Added 5 keyframe animations (`fade-in`, `fade-in-up`, `slide-in-right`, `scale-in`, `slide-down`) as Tailwind v4 theme tokens. Added `--color-primary-hover` token. Added `::selection` styling for brand color.

2. **[src/components/ui/Button.tsx]** — Replaced `hover:bg-blue-800` with `hover:bg-primary-hover` for spec-correct hover. Added `active:scale-[0.98]` press feedback on all variants. Added `shadow-sm hover:shadow` on primary variant. Replaced `focus:ring` with `focus-visible:ring` for keyboard-only focus rings. Added `outline-none` and `pointer-events-none` when disabled.

3. **[src/components/ui/Card.tsx]** — Added `transition-[border-color,box-shadow] duration-fast` for smooth hover animations when used with hover classes on parent.

4. **[src/components/ui/Modal.tsx]** — Added `shadow-xl` and `animate-scale-in` entrance animation. Modal close button: `hover:bg-gray-100` → `hover:bg-bg`, added `active:scale-95`.

5. **[src/components/ui/Toast.tsx]** — Fixed broken `animate-[slideIn_200ms_ease-out]` (keyframes never defined) → replaced with working `animate-slide-in-right`. Dismiss button: added `transition-colors duration-fast`, `hover:bg-gray-100` → `hover:bg-bg`.

6. **[src/components/features/Header.tsx]** — Added `backdrop-blur-sm` and `bg-surface/95` for frosted glass sticky header. Added `transition-colors duration-fast` on all nav links. Mobile menu: added `animate-slide-down` entrance, changed items to use `rounded-md hover:bg-bg` for tappable hover areas. Hamburger button: added `rounded-md hover:bg-bg active:scale-95`.

7. **[src/components/features/SiteCard.tsx]** — Enhanced hover: `hover:border-gray-300` → `hover:border-primary/30 hover:shadow-md` with `duration-normal`. Added `group` class for child animation: site name gets `group-hover:text-primary` color shift.

8. **[src/components/features/DayCard.tsx]** — Fixed broken `animate-[fadeIn_350ms_ease-out]` → replaced with working `animate-fade-in`.

9. **[src/components/features/VerdictCalendar.tsx]** — Calendar rows: added `hover:border-primary/20` on cards. Row button: `hover:bg-gray-50/50` → `hover:bg-bg/50`, added `active:bg-bg` pressed state.

10. **[src/components/features/ActivityPicker.tsx]** — Added `active:scale-[0.97]` press feedback. Selected state: `bg-blue-50` → `bg-primary/5` with `shadow-sm`. Unselected hover: `hover:border-gray-300 hover:bg-gray-50` → `hover:border-primary/30 hover:bg-bg hover:text-text-primary`.

11. **[src/components/features/LocationInput.tsx]** — Dropdown: added `animate-slide-down` entrance. Items: `hover:bg-gray-50` → `hover:bg-bg`, added `transition-colors duration-fast`.

12. **[src/components/features/AddSiteModal.tsx]** — Site name input: added `transition-all duration-fast`.

13. **[src/app/page.tsx]** — Landing page: sticky header with `backdrop-blur-sm`. Hero: staggered `animate-fade-in-up` with 80ms delays on headline, body, CTA. Activity icons: `hover:border-primary/30 hover:shadow-sm` with icon `group-hover:scale-110`. Value props: icons wrapped in `bg-primary/10` rounded container. Pricing cards: hover states with `hover:shadow-sm`. CTA buttons: `hover:bg-blue-800` → `hover:bg-primary-hover` with `active:scale-[0.98]`. Footer links: added `transition-colors duration-fast`.

14. **[src/app/check/page.tsx]** — Verdict results area: added `animate-fade-in-up` for smooth entrance after weather check completes.

15. **[src/app/pricing/page.tsx]** — Header: frosted glass sticky. Plan cards: `hover:shadow-md` with `transition-all duration-normal`. Highlighted card: added `shadow-sm`. CTA buttons: `hover:bg-blue-800` → `hover:bg-primary-hover`, added `active:scale-[0.98]`. Coming Soon: `bg-gray-100` → `bg-bg`.

16. **[src/app/dashboard/page.tsx]** — Stale data banner: `bg-amber-50 border-amber-200` → `bg-warning/5 border-warning/20` for spec-correct token usage, added `animate-fade-in`.

17. **[src/app/site/[id]/page.tsx]** — Breadcrumb: added `transition-colors duration-fast`.

18. **[src/app/site/[id]/share/page.tsx]** — Header: added `backdrop-blur-sm bg-surface/95`. CTA card: added `hover:border-primary/20 transition-all`, button: `hover:bg-primary-hover` with press state.

19. **[src/app/auth/login/page.tsx]** — Form wrapper: added `animate-fade-in-up`. Logo link: added `hover:opacity-80 transition-opacity`. Inputs: added `transition-all duration-fast`.

20. **[src/app/auth/signup/page.tsx]** — Same as login. Email confirmation card: added `animate-scale-in`.

21. **[src/app/settings/page.tsx]** — Toggle buttons: `bg-blue-50` → `bg-primary/5`, `hover:bg-gray-50` → `hover:bg-bg hover:border-primary/30`. Added `flex-wrap` for mobile safety. Added `active:scale-[0.97]` press feedback.

## Responsive Status
| Page | Desktop | Mobile (390px) |
|------|---------|----------------|
| `/` | ✅ | ✅ |
| `/check` | ✅ | ✅ |
| `/auth/login` | ✅ | ✅ |
| `/auth/signup` | ✅ | ✅ |
| `/dashboard` | ✅ | ✅ |
| `/site/:id` | ✅ | ✅ |
| `/site/:id/share` | ✅ | ✅ |
| `/pricing` | ✅ | ✅ |
| `/settings` | ✅ | ✅ (flex-wrap on toggles) |

## Microinteractions Added
- **Hero staggered reveal**: h1, body text, and CTA enter sequentially (80ms delay between each) using `animate-fade-in-up`
- **Activity icons**: scale up on hover (`group-hover:scale-110`) with transition
- **Buttons**: `active:scale-[0.98]` press feedback on all primary/secondary/ghost variants
- **Activity picker**: `active:scale-[0.97]` on selection tap
- **Modal entrance**: `animate-scale-in` (scale 0.95→1 + fade)
- **Toast entrance**: `animate-slide-in-right` (slide from right + fade)
- **Mobile menu**: `animate-slide-down` for menu reveal
- **Location dropdown**: `animate-slide-down` for suggestions reveal
- **Verdict results**: `animate-fade-in-up` on check completion
- **Day detail expand**: `animate-fade-in` on hourly chart reveal
- **SiteCard hover**: name turns primary color, border shifts to `primary/30`, shadow lift
- **Auth pages**: `animate-fade-in-up` on form entrance, `animate-scale-in` on success state
- **Stale data banner**: `animate-fade-in` entrance
- **Header**: frosted glass (`backdrop-blur-sm bg-surface/95`) on all sticky headers

## Build Status
- After design pass: ✅ PASS
