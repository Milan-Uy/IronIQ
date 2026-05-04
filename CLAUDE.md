# CLAUDE.md

**IronIQ** — AI-powered fitness tracker and coaching assistant.

## Tech Stack

Next.js 16.2.1 (App Router) · React 19.2.4 · TypeScript · Tailwind CSS 4 · shadcn/ui (base-nova) · Supabase (auth + DB) · Vercel AI SDK 6 (`ai`, `@ai-sdk/react`) · Groq (`@ai-sdk/groq`, llama-3.3-70b-versatile) · Recharts · Zod · Lucide icons · Sonner toasts

## Commands

```bash
npm run dev             # Dev server on localhost:3000
npm run build           # Production build
npm run lint            # ESLint
npx shadcn@latest add [component]  # Add shadcn/ui component
```

## Environment

`.env.local` requires:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY` (AI coach)

## Architecture

```
src/
├── app/
│   ├── (app)/                    # Authenticated routes (middleware-protected)
│   │   ├── coach/                # AI coaching interface + chat
│   │   │   ├── page.tsx
│   │   │   ├── coach-client.tsx  # useChat() hook integration
│   │   │   └── actions.ts        # clearHistory server action
│   │   ├── program/              # Program management
│   │   │   ├── page.tsx          # Program list
│   │   │   ├── new/              # Create from template
│   │   │   ├── templates/        # Template browser
│   │   │   ├── [id]/             # Program detail
│   │   │   │   └── day/[dayId]/  # Day detail
│   │   │   └── actions.ts        # Program/day/exercise mutations
│   │   ├── track/                # Workout tracking
│   │   │   ├── page.tsx
│   │   │   ├── session/[sessionId]/  # Active session tracker
│   │   │   └── actions.ts        # Log set, finish session
│   │   ├── insights/             # Analytics & progression
│   │   │   ├── page.tsx
│   │   │   ├── session/[sessionId]/  # Detailed session view
│   │   │   └── actions.ts
│   │   └── profile/              # User profile + upgrade
│   ├── (auth)/                   # Public auth routes (login, signup)
│   ├── auth/callback/route.ts    # Supabase OAuth callback
│   ├── api/chat/route.ts         # Streaming AI chat endpoint (streamText + tools)
│   └── page.tsx                  # Root redirect
├── components/
│   ├── ui/                       # shadcn/ui primitives (base-nova)
│   ├── coach/                    # AI chat UI
│   │   ├── chat-message.tsx      # Message rendering with tool result parts
│   │   ├── chat-message-list.tsx
│   │   ├── chat-input.tsx
│   │   ├── tool-result-card.tsx  # Renders dynamic-tool parts from AI SDK
│   │   └── typing-indicator.tsx
│   ├── workout/                  # Domain components
│   │   ├── program-card.tsx / template-card.tsx / day-card.tsx
│   │   ├── exercise-row.tsx / exercise-picker.tsx
│   │   ├── session-header.tsx / session-exercise-card.tsx / set-row.tsx
│   │   ├── muscle-group-badge.tsx / active-session-banner.tsx
│   │   └── day-picker.tsx
│   ├── insights/                 # Analytics components
│   │   ├── overview-section.tsx / session-history-list.tsx
│   │   ├── session-detail-view.tsx / progression-card.tsx
│   │   ├── volume-chart.tsx      # Recharts weekly volume
│   │   └── muscle-balance-chart.tsx
│   ├── navigation/tab-bar.tsx    # Bottom nav
│   └── logo.tsx
├── lib/
│   ├── ai/                       # AI coach subsystem
│   │   ├── provider.ts           # Groq model factory
│   │   ├── system-prompt.ts      # Dynamic prompt builder (profile + program + sessions)
│   │   ├── context.ts            # buildUserContext() — parallel Supabase fetches
│   │   ├── types.ts              # UserContext interface
│   │   └── tools.ts              # Tool definitions: create_program, modify_exercise, add_exercise_to_day
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client (RSC/actions)
│   │   ├── middleware.ts         # updateSession()
│   │   ├── programs.ts           # CRUD for programs, days, exercises
│   │   ├── sessions.ts           # CRUD for workout sessions & sets
│   │   ├── insights.ts           # Aggregations (volume, progression, muscle balance)
│   │   └── chat.ts               # getChatHistory, saveChatMessage, clearChatHistory
│   ├── validation/actions.ts     # Zod schemas shared by client + server mutations
│   ├── templates/                # Starter programs (PPL, Upper/Lower, Full Body)
│   ├── exercises.ts              # Static exercise DB (not in Supabase)
│   ├── rate-limit.ts             # In-memory limiter: 15 req/min per user
│   └── utils.ts                  # cn() helper
├── types/database.ts             # Supabase auto-generated types
└── middleware.ts                 # Auth guard + session refresh
```

## Key Patterns

- **Auth flow:** Middleware redirects unauthed → `/login`, authed → `/coach`. Root `/` redirects accordingly.
- **Supabase clients:** `client.ts` for browser, `server.ts` for RSC/actions. Cookie-based sessions.
- **Server actions:** Each feature folder has `actions.ts`. Validates with Zod (`lib/validation/actions.ts`) then `revalidatePath` + `redirect`.
- **AI chat:** `/api/chat/route.ts` streams with `streamText()`. Client uses `useChat()` from `@ai-sdk/react`. Last 10 messages sent to model; all messages persisted to `chat_messages` table via `lib/supabase/chat.ts`.
- **AI tools:** Defined in `lib/ai/tools.ts` with Zod schemas. Tool results returned as `dynamic-tool` parts in UIMessage. Users must confirm before tool execution.
- **Exercise DB:** Static data in `lib/exercises.ts` — not in Supabase. Templates reference exercises by ID.
- **Rate limiting:** `lib/rate-limit.ts` blocks >15 AI requests/min per user (in-memory).

## Design

- Dark theme (forced) · Outfit font · OKLch color space · CSS variables in `globals.css`
- Primary: `oklch(0.58 0.24 275)` (blue/purple)
- Shadow tokens: `--shadow-stripe-standard`, `--shadow-stripe-elevated`, `--shadow-stripe-deep`
- Gradient tokens: `--gradient-hero` (radial), `--gradient-accent` (linear blue→cyan)
- Track page uses a custom `track-surface` theme with golden/cream tones and lavender glow
- Chart colors: 5 variants via `--chart-1` through `--chart-5`

## Gotchas

- Bottom tab bar requires `pb-20` on main content to avoid overlap
- Main content height: `h-[calc(100vh-5rem)]` (accounts for header)
- `components.json` is shadcn/ui config, not Supabase
- Path aliases: `@/components`, `@/lib`, `@/types`
- AI context built with `Promise.all()` in `lib/ai/context.ts` — keep Supabase queries parallelized there
