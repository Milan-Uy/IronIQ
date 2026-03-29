# Track Tab — Workout Logging

## Context

IronIQ has a fully functional program management system (create/edit programs, days, exercises) but no way to actually log workouts. The Track tab is the next critical feature — it enables users to start a workout session from their active program, log sets/reps/weight in real-time, and auto-save progress to the database. Without tracked sessions, the Coach and Insights tabs have no data to work with.

## User Flow

1. **Track landing** (`/track`) — displays the active program's workout days as selectable cards. If an in-progress session exists, a "Resume Workout" banner appears instead. If no active program exists, show an empty state with a link to `/program` to create or activate one.
2. **Start session** — user taps a day card → creates a `workout_sessions` row with `status: "in_progress"` → redirects to the session page.
3. **Active session** (`/track/session/[sessionId]`) — the workout logging screen:
   - Pre-loaded with the day's planned exercises (from `workout_exercises`)
   - Each exercise shows input rows for each target set
   - Tap a set row to enter weight + reps (previous session's values shown as placeholders)
   - Sets auto-save to `session_sets` on input blur
   - Users can add exercises (via `ExercisePicker`) or remove exercises during the session
   - "Finish Workout" button sets `completed_at` and `status: "completed"`, redirects to `/track`
4. **Session resumption** — if the user navigates away mid-workout, the Track landing shows a banner to resume the in-progress session.

## Data Model

Uses the existing `workout_sessions` and `session_sets` tables.

### workout_sessions

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| day_id | uuid | FK → workout_days |
| started_at | timestamptz | Auto-set on creation |
| completed_at | timestamptz | Null while in progress |
| notes | text | Optional session notes |
| status | text | "in_progress" or "completed" |

### session_sets

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| session_id | uuid | FK → workout_sessions |
| exercise_name | text | Exercise identifier |
| set_number | int | 1-indexed |
| reps | int | Actual reps performed |
| weight | numeric | Weight used |
| rpe | int | Optional (1-10 scale) |
| is_warmup | boolean | Default false |
| was_substituted | boolean | Default false |
| original_exercise | text | If substituted, the original exercise name |
| created_at | timestamptz | Auto-set |

## Architecture

### Server Actions (`src/app/(app)/track/actions.ts`)

- `startSession(dayId: string)` — creates session, redirects to session page
- `logSet(sessionId: string, exerciseName: string, setNumber: number, weight: number, reps: number)` — upserts a set (keyed by session_id + exercise_name + set_number)
- `deleteSet(setId: string, sessionId: string)` — removes a logged set
- `removeSessionExercise(sessionId: string, exerciseName: string)` — deletes all sets for that exercise in this session
- `finishSession(sessionId: string)` — sets completed_at and status, redirects to /track

### DB Query Functions (`src/lib/supabase/sessions.ts`)

- `getActiveSession(userId: string)` — returns in-progress session or null
- `getSessionWithSets(sessionId: string)` — session + all session_sets, sorted
- `getLastSessionForDay(userId: string, dayId: string)` — most recent completed session for this day (for placeholder values)
- `upsertSet(...)` — insert or update a set row
- `deleteSet(setId: string)` — delete a set
- `deleteExerciseSets(sessionId: string, exerciseName: string)` — delete all sets for an exercise
- `completeSession(sessionId: string)` — update status + completed_at

### Pages

| Route | File | Type | Purpose |
|-------|------|------|---------|
| `/track` | `src/app/(app)/track/page.tsx` | RSC | Landing — day picker or resume banner |
| `/track/session/[sessionId]` | `src/app/(app)/track/session/[sessionId]/page.tsx` | RSC shell | Loads session data |
| (client) | `src/app/(app)/track/session/[sessionId]/session-client.tsx` | Client | Interactive workout logging |

### Components (`src/components/workout/`)

| Component | Purpose |
|-----------|---------|
| `DayPicker` | Grid of day cards from active program, tap to start session |
| `ActiveSessionBanner` | "Resume Workout" banner when in-progress session exists |
| `SessionHeader` | Elapsed timer, day name, "Finish Workout" button |
| `SessionExerciseCard` | Card per exercise containing set rows, with remove button |
| `SetRow` | Single set: weight input, reps input, completion state |

### Auto-save Behavior

- Each `SetRow` saves on input blur (not on every keystroke)
- Server action `logSet` uses upsert logic: if a row for (session_id, exercise_name, set_number) exists, update it; otherwise insert
- Optimistic UI: mark the set as saved immediately, revert on error with a toast

### Previous Session Placeholders

- When loading the session page, query the last completed session for this day
- For each exercise + set_number combo, show the previous weight/reps as input placeholder text
- This gives users a "repeat what you did last time" experience without requiring extra taps

### Adding/Removing Exercises During Session

- **Add**: Reuse the existing `ExercisePicker` component. When an exercise is added, it appears at the bottom of the exercise list with empty set rows (default 3 sets). Added exercises are session-only — they do not modify the program's day plan.
- **Remove**: Each `SessionExerciseCard` has a remove button. Removing deletes all `session_sets` rows for that exercise in this session.

## Verification

1. Start dev server (`npm run dev`)
2. Log in, ensure an active program exists with at least one day containing exercises
3. Navigate to `/track` — verify day cards appear for the active program
4. Tap a day → verify session starts and redirects to session page with pre-loaded exercises
5. Log weight/reps for a set, blur the input → verify it auto-saves (check DB or refresh page)
6. Add an exercise mid-session → verify it appears with empty set rows
7. Remove an exercise → verify it disappears and sets are deleted
8. Navigate away and return to `/track` → verify "Resume Workout" banner appears
9. Tap resume → verify session state is preserved
10. Tap "Finish Workout" → verify redirect to `/track`, session marked completed
11. Start the same day again → verify previous session's values appear as placeholders
