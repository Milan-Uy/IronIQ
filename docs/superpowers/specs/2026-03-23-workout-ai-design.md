# Workout AI — Product Spec

## Overview

An AI-powered fitness tracker app with an integrated coaching chatbot. The AI coach helps users create, modify, and analyze workout programs through natural conversation while producing fully structured data. The app features built-in workout templates, exercise substitution, workout comparison, and AI-generated insights.

**Platform:** Web-first (Next.js), mobile later
**Stack:** Next.js 14+ (App Router), Tailwind CSS + shadcn/ui, Supabase (Postgres + Auth), flexible AI provider (default: free/cheap models — Gemini Flash, GPT-4o-mini, Claude Haiku)

---

## Architecture

### Hybrid Tab Layout

Bottom tab navigation with 5 tabs:

| Tab | Purpose | Key Features |
|-----|---------|--------------|
| **Coach** | AI chat interface | Create/modify plans, ask biomechanics questions, get exercise alternatives, step-by-step plan builder |
| **Program** | Structured program view | View current plan, browse templates (PPL, Upper/Lower, Full Body), weekly schedule, direct exercise editing, body part specialization |
| **Track** | Workout logging | Log sets/reps/weight, swap exercises with AI alternatives, compare with previous session, workout history |
| **Insights** | AI analytics | AI-generated analysis, volume & intensity trends, muscle group balance, progress summaries, recommendations |
| **Profile** | User settings | Profile info, preferences, fitness goals, app settings |

### Tech Stack

- **Frontend:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password + social logins)
- **AI:** Abstracted provider layer — defaults to free/cheapest models:
  - Google Gemini 2.0 Flash (free tier, generous limits) — primary
  - OpenAI GPT-4o-mini ($0.15/$0.60 per 1M tokens) — fallback
  - Claude Haiku ($0.25/$1.25 per 1M tokens) — optional
  - Swappable via `AI_PROVIDER` env var
- **State:** React Context or Zustand for client state; Supabase realtime for data sync

---

## Data Model

### profiles
Extends Supabase Auth user.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK → auth.users) | |
| display_name | text | |
| fitness_goal | text | "hypertrophy", "strength", "general" |
| experience_level | text | "beginner", "intermediate", "advanced" |
| preferred_split | text | "ppl", "upper_lower", "full_body" |
| workouts_per_week | int | |
| body_specialization | text[] | e.g. ["chest", "back"] |
| weight_unit | text | "lbs" or "kg" (default: "lbs") |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### workout_programs
A full training program (e.g. "My PPL Program").

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles) | |
| name | text | |
| split_type | text | "ppl", "upper_lower", "full_body" |
| days_per_week | int | |
| is_template | bool | true for built-in templates |
| is_active | bool | user's current program |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### workout_days
Individual days within a program (e.g. "Push Day").

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| program_id | uuid (FK → workout_programs) | |
| name | text | "Push", "Pull", "Legs", etc. |
| day_order | int | position in weekly rotation |
| target_muscles | text[] | ["chest", "shoulders", "triceps"] |
| created_at | timestamptz | |

### workout_exercises
Prescribed exercises for a workout day.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| day_id | uuid (FK → workout_days) | |
| exercise_name | text | |
| target_sets | int | |
| target_reps | text | "8-12" or "5" (supports ranges) |
| rest_seconds | int | |
| exercise_order | int | |
| notes | text | AI coaching cues |
| alternatives | jsonb | [{name, reason}] AI-suggested swaps |
| created_at | timestamptz | |

### workout_sessions
A completed or in-progress workout.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles) | |
| day_id | uuid (FK → workout_days) | |
| started_at | timestamptz | |
| completed_at | timestamptz | |
| notes | text | |
| status | text | "in_progress", "completed" |

### session_sets
Individual set logs within a session.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| session_id | uuid (FK → workout_sessions) | |
| exercise_name | text | |
| set_number | int | |
| reps | int | |
| weight | decimal | |
| rpe | decimal | Rate of Perceived Exertion (optional) |
| is_warmup | bool | |
| was_substituted | bool | true if user swapped exercise |
| original_exercise | text | what was prescribed |
| created_at | timestamptz | |

### chat_messages
Conversation history with the AI coach.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles) | |
| role | text | "user" or "assistant" |
| content | text | |
| structured_data | jsonb | parsed workout modifications, if any |
| created_at | timestamptz | |

### Relationships

```
profile → has many → workout_programs
workout_program → has many → workout_days
workout_day → has many → workout_exercises
profile → has many → workout_sessions
workout_session → has many → session_sets
profile → has many → chat_messages
```

---

## AI System

### Provider Abstraction Layer

A unified interface wrapping both Claude and OpenAI:

```typescript
interface AIProvider {
  chat(messages: Message[], systemPrompt: string, tools?: Tool[]): Promise<AIResponse>
  structuredOutput(messages: Message[], schema: JSONSchema): Promise<object>
}

// Implementations (cheapest first):
// GeminiProvider  — uses @google/generative-ai (gemini-2.0-flash, free tier)
// OpenAIProvider  — uses openai SDK (gpt-4o-mini, very cheap)
// ClaudeProvider  — uses @anthropic-ai/sdk (claude-haiku, cheap)
// Switch via env var: AI_PROVIDER=gemini|openai|claude (default: gemini)
```

### AI Coach Persona

The system prompt configures the AI as a knowledgeable fitness coach with expertise in:
- Exercise programming & periodization
- Biomechanics & movement patterns
- Exercise alternatives based on equipment, injury, or preference
- Progressive overload strategies

**Context injection:** Each request includes the user's profile, current program, and recent workout history so the AI can give personalized advice.

### AI Tool Functions

The AI uses structured tool calling to perform actions:

| Tool | Description |
|------|-------------|
| `create_program` | Generate a full workout program from preferences |
| `modify_exercise` | Change an exercise's sets, reps, or swap it |
| `suggest_alternative` | Provide alternative exercises with reasoning |
| `compare_workouts` | Compare two sessions with volume/intensity metrics |
| `generate_insight` | Analyze workout data for trends and recommendations |
| `create_plan_step_by_step` | Walk user through plan creation interactively |

All tool outputs are structured JSON that directly maps to database operations.

---

## Core User Flows

### 1. Step-by-Step Plan Creation (Coach Tab)

1. User opens Coach tab and says "Create a workout plan"
2. AI asks for split type preference (PPL, Upper/Lower, Full Body)
3. AI asks for days per week
4. AI asks for body part specialization (optional)
5. AI generates the full program as structured JSON
6. Program is saved and appears in the Program tab
7. User can ask follow-ups: "add more chest volume", "swap barbell for dumbbell"

### 2. Exercise Substitution (Track Tab)

1. User is logging a workout
2. Taps "Swap" on an exercise they can't or don't want to do
3. AI generates 2-3 alternatives based on:
   - Same target muscle group
   - Available equipment
   - Biomechanical similarity
   - Each alternative includes a reason
4. User picks one
5. Set is logged with `was_substituted = true` and `original_exercise` preserved

### 3. Workout Comparison (Track Tab)

1. User opens workout history
2. Selects two sessions of the same workout day
3. Side-by-side comparison showing:
   - Total volume (sets × reps × weight) per exercise
   - Weight progression per exercise
   - Sets completed vs prescribed
   - Overall tonnage change

### 4. AI Insights (Insights Tab)

1. User opens Insights tab
2. AI analyzes recent workout data and generates:
   - Weekly/monthly volume summaries
   - Muscle group volume balance assessment
   - Progressive overload tracking (are weights going up?)
   - Plateau detection and suggestions
   - Recovery and frequency recommendations

### 5. Browse & Adopt Templates (Program Tab)

1. User opens Program tab → Templates section
2. Browses built-in templates: PPL, Upper/Lower, Full Body
3. Previews template details (days, exercises, sets/reps)
4. Adopts a template (copies it as their own program)
5. Can customize via direct editing or Coach chat
6. Sets as active program

---

## Built-in Templates

### Push/Pull/Legs (PPL)
- 6 days/week (or 3 days rotating)
- Push: chest, shoulders, triceps
- Pull: back, biceps, rear delts
- Legs: quads, hamstrings, glutes, calves

### Upper/Lower
- 4 days/week
- Upper: chest, back, shoulders, arms
- Lower: quads, hamstrings, glutes, calves

### Full Body
- 3 days/week
- Each session hits all major muscle groups
- Alternating exercise selection across days

Each template includes specific exercises, sets, reps, rest times, and AI coaching notes.

---

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth pages (login, signup)
│   ├── (app)/                # Main app (protected)
│   │   ├── coach/            # Coach tab (AI chat)
│   │   ├── program/          # Program tab
│   │   ├── track/            # Track tab
│   │   ├── insights/         # Insights tab
│   │   └── profile/          # Profile tab
│   ├── api/                  # API routes
│   │   ├── chat/             # AI chat endpoint
│   │   ├── programs/         # Program CRUD
│   │   ├── sessions/         # Session CRUD
│   │   └── insights/         # Insight generation
│   └── layout.tsx
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── chat/                 # Chat UI components
│   ├── workout/              # Workout-related components
│   ├── tracking/             # Tracking components
│   └── navigation/           # Tab bar, headers
├── lib/
│   ├── ai/                   # AI provider abstraction
│   │   ├── provider.ts       # AIProvider interface
│   │   ├── claude.ts         # Claude implementation
│   │   ├── openai.ts         # OpenAI implementation
│   │   ├── tools.ts          # Tool function definitions
│   │   └── prompts.ts        # System prompts
│   ├── supabase/             # Supabase client & helpers
│   ├── templates/            # Built-in workout templates
│   └── utils/                # Shared utilities
├── types/                    # TypeScript type definitions
└── hooks/                    # Custom React hooks
```

---

## Non-Functional Requirements

- **Auth:** Supabase Auth with email/password and Google/Apple social login
- **Security:** Row-level security (RLS) on all Supabase tables; users can only access their own data
- **Performance:** AI responses should stream to the UI for perceived speed
- **Responsive:** Mobile-first design that works well on desktop too
- **Offline:** Not required for v1; all features require connectivity
- **Data export:** Not required for v1
