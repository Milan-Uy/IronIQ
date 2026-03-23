# Program Tab — Design Spec

## Overview

The Program tab lets users view, create, edit, and manage workout programs. Users can adopt built-in templates or build programs from scratch with full CRUD on programs, days, and exercises.

This is the first tab built in Phase 2. It establishes the data layer that Coach, Track, and Insights tabs depend on.

---

## Decisions

- **Architecture:** Nested route pages (drill-down: list → detail → day)
- **Templates:** Hardcoded in TypeScript, not in the database. Users adopt by copying into their own programs.
- **Exercise input:** Hybrid — searchable curated list (~100 exercises) with "add custom exercise" escape hatch.
- **Editing:** Full CRUD — users can add/remove/reorder exercises, edit sets/reps/rest, rename programs and days.
- **State management:** No Zustand/Redux. Server components + server actions + `useTransition`.
- **Accent color:** Blue (`#3b82f6` / Tailwind `blue-500`), slate backgrounds (`#111827`, `#1e293b`)
- **Font:** Outfit (replaces Geist)

---

## Route Structure

| Route | Purpose | Rendering |
|-------|---------|-----------|
| `/program` | Program list + empty state with template showcase | Server component |
| `/program/templates` | Browse all templates with full previews | Server component |
| `/program/new` | Create blank program form | Client component |
| `/program/[id]` | Program detail — day list, edit name, set active, delete | Server component |
| `/program/[id]/day/[dayId]` | Exercise list — full CRUD, reorder, search | Client component |

---

## Data Layer

### Exercise Database

File: `src/lib/exercises.ts`

Static TypeScript array of ~100 common exercises:

```ts
type Exercise = {
  id: string
  name: string
  muscleGroup: "chest" | "back" | "shoulders" | "biceps" | "triceps" | "quads" | "hamstrings" | "glutes" | "calves" | "core"
  equipment: "barbell" | "dumbbell" | "cable" | "machine" | "bodyweight"
}
```

No database table — static reference data shipped with the code.

### Templates

Directory: `src/lib/templates/`

Files:
- `types.ts` — shared template type definitions
- `ppl.ts` — Push/Pull/Legs (6 days/week)
- `upper-lower.ts` — Upper/Lower (4 days/week)
- `full-body.ts` — Full Body (3 days/week)
- `index.ts` — re-exports `getAllTemplates()` helper

Each template exports a full program structure: name, split type, days per week, and nested days with exercises referencing the exercise database.

### Supabase Query Module

File: `src/lib/supabase/programs.ts`

Typed functions using the Supabase server client:

- `getUserPrograms(userId)` — fetch all user programs
- `getProgram(programId)` — fetch program with days and exercises (joined)
- `createProgram(...)` / `updateProgram(...)` / `deleteProgram(...)`
- `createDay(...)` / `updateDay(...)` / `deleteDay(...)` / `reorderDays(...)`
- `createExercise(...)` / `updateExercise(...)` / `deleteExercise(...)` / `reorderExercises(...)`
- `adoptTemplate(userId, template)` — inserts full program + days + exercises from a template
- `setActiveProgram(userId, programId)` — deactivates all others, activates this one

All queries go through the server client. No separate API routes — Next.js server actions handle mutations.

---

## Page Behaviors

### `/program` — Program List

**With programs:** Cards showing program name, split type badge, days/week badge, active indicator (blue border). Floating "+" button to create new. "Browse Templates" link.

**Empty state (no programs):** Motivational message + 3 template cards (PPL, Upper/Lower, Full Body) with "Use Template" buttons. "Create from scratch" link at bottom.

### `/program/templates` — Template Browser

Grid of 3 template cards. Each shows: name, days/week, short description, day breakdown. "Use Template" button triggers `adoptTemplate()` and redirects to the new program.

### `/program/new` — Create Program

Simple form: name (text input), split type (select), days per week (select). Creates an empty program with no days, redirects to `/program/[id]`.

### `/program/[id]` — Program Detail

Header: back link, program name (editable), split type + days/week badges, "Active Program" toggle (green), Edit/Delete actions.

Body: ordered list of day cards. Each card shows: day name, colored muscle group badges, exercise count, chevron. Tap navigates to day detail. "Add Day" dashed button at bottom.

### `/program/[id]/day/[dayId]` — Day Detail

Header: back link to program, day name (editable), muscle group badges, Edit action.

Body: exercise list. Each row shows: exercise name, sets × reps, rest time, three-dot menu (edit/delete). "Add Exercise" button opens the exercise picker sheet.

---

## Components

Directory: `src/components/workout/`

| Component | Used On | Description |
|-----------|---------|-------------|
| `ProgramCard` | `/program` | Program name, split badge, days/week, active indicator |
| `TemplateCard` | Empty state, `/program/templates` | Template name, description, day breakdown, "Use Template" button |
| `DayCard` | `/program/[id]` | Day name, muscle group badges, exercise count |
| `ExerciseRow` | Day detail | Exercise name, sets × reps, rest, inline edit, actions menu |
| `ExercisePicker` | Day detail (sheet) | Search input, muscle group filter chips, exercise list, "Add custom" option |
| `MuscleGroupBadge` | Multiple | Colored badge for muscle group labels |

### Additional shadcn/ui components needed:
- `Select` — for form dropdowns
- `Dialog` — for confirm dialogs (delete)
- `Sonner` — for toast notifications

---

## Server Actions

File: `src/app/(app)/program/actions.ts`

| Action | Input | Behavior |
|--------|-------|----------|
| `createProgram` | name, splitType, daysPerWeek | Insert, redirect to `/program/[id]` |
| `updateProgram` | id, name?, splitType?, daysPerWeek? | Update fields, revalidate path |
| `deleteProgram` | id | Delete, redirect to `/program` |
| `setActiveProgram` | programId | Deactivate others, activate this one, revalidate |
| `adoptTemplate` | templateKey | Insert full program + days + exercises, redirect to new program |
| `createDay` | programId, name, targetMuscles | Insert with next `day_order`, revalidate |
| `updateDay` | dayId, name?, targetMuscles? | Update fields, revalidate |
| `deleteDay` | dayId | Delete, revalidate |
| `reorderDays` | programId, dayIds[] | Update `day_order` for each, revalidate |
| `addExercise` | dayId, exerciseName, targetSets, targetReps, restSeconds | Insert with next `exercise_order`, revalidate |
| `updateExercise` | exerciseId, fields | Update fields, revalidate |
| `deleteExercise` | exerciseId | Delete, revalidate |
| `reorderExercises` | dayId, exerciseIds[] | Update `exercise_order` for each, revalidate |

---

## Error Handling

- All server actions wrapped in try/catch, return `{ error: string }` on failure
- `useTransition` for pending states (loading spinners on buttons)
- Sonner toast notifications for success/error feedback
- Server-side validation for required fields
- Ownership enforced by Supabase RLS — no manual auth checks needed in queries

---

## Visual Design

- **Accent:** Blue `#3b82f6` (Tailwind `blue-500`)
- **Backgrounds:** Slate `#111827` (cards), `#1e293b` (borders/secondary), `#0a0a0a` (page)
- **Font:** Outfit (Google Fonts, via `next/font/google`)
- **Dark mode only** (existing app default)
- **Muscle group badge colors:** Each muscle group gets a distinct color (red/chest, yellow/shoulders, cyan/triceps, indigo/back, pink/biceps, green/quads, yellow/hamstrings, red/glutes, etc.)
- **Active program:** Blue border on card, green "Active Program" badge on detail page

---

## Out of Scope

- Drag-to-reorder (v1 uses move up/down buttons; drag can be added later)
- Optimistic updates (mutations are fast enough with loading states)
- AI integration (that's the Coach tab, Phase 2b)
- Workout logging (that's the Track tab, Phase 2c)
