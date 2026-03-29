# CLAUDE.md

**IronIQ** — AI-powered fitness tracker and coaching assistant.

## Tech Stack

Next.js 16.2.1 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (base-nova) · Supabase (auth + DB) · Lucide icons · Sonner toasts

## Commands

```bash
npm run dev             # Dev server on localhost:3000
npm run build           # Production build
npm run lint            # ESLint
npx shadcn@latest add [component]  # Add shadcn/ui component
```

## Environment

`.env.local` requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. See `.env.local.example`.

## Architecture

```
src/
├── app/
│   ├── (app)/              # Authenticated routes (middleware-protected)
│   │   ├── coach/          # AI coaching interface
│   │   ├── program/        # Program management
│   │   │   ├── page.tsx        # Program list
│   │   │   ├── new/            # Create from template
│   │   │   ├── templates/      # Template browser
│   │   │   ├── [id]/           # Program detail
│   │   │   │   └── day/[dayId] # Day detail
│   │   │   └── actions.ts      # Server actions for program/day/exercise mutations
│   │   ├── track/          # Workout tracking
│   │   ├── insights/       # Analytics
│   │   └── profile/        # User profile
│   ├── (auth)/             # Public auth routes (login, signup)
│   └── auth/               # Supabase OAuth callback
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── workout/            # Domain components (ProgramCard, DayCard, ExerciseRow, ExercisePicker, TemplateCard, MuscleGroupBadge)
│   └── navigation/         # TabBar (bottom nav)
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client (use in "use client" components)
│   │   ├── server.ts       # Server client (use in RSC / actions)
│   │   ├── middleware.ts    # Session refresh logic
│   │   └── programs.ts     # DB queries for programs, days, exercises
│   ├── exercises.ts        # Static exercise database (name, muscle groups, equipment)
│   ├── templates/          # Workout templates (PPL, Upper/Lower, Full Body)
│   └── utils.ts            # cn() helper
├── types/
│   └── database.ts         # Supabase auto-generated types
└── middleware.ts            # Auth guard entry point
```

## Key Patterns

- **Auth flow:** Middleware redirects unauthed users to `/login`, authed users away from auth pages to `/coach`. Root `/` redirects accordingly.
- **Supabase clients:** `client.ts` for browser, `server.ts` for RSC/actions. Both use cookie-based sessions.
- **Server actions:** Mutations live in `program/actions.ts` — uses `revalidatePath` + `redirect` pattern.
- **Exercise DB:** Static data in `lib/exercises.ts` — not in Supabase. Templates reference exercises by ID.
- **Templates:** `lib/templates/` defines starter programs (PPL, Upper/Lower, Full Body) with `WorkoutTemplate` type. Used when creating new programs.

## Gotchas

- Bottom tab bar requires `pb-20` on main content to avoid overlap
- `components.json` is shadcn/ui config (not Supabase config)
- Path aliases: `@/components`, `@/lib`, `@/types`

## Design

Dark theme (forced) · Outfit font · Blue primary (#0070f3) · CSS variables in `globals.css`
