# Program Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Program tab with full CRUD for workout programs, days, and exercises, including template adoption and a searchable exercise picker.

**Architecture:** Nested route pages (`/program` → `/program/[id]` → `/program/[id]/day/[dayId]`). Server components for data fetching, server actions for mutations. Static exercise database and workout templates in TypeScript. Supabase for persistence with RLS.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Supabase, Outfit font

**Spec:** `docs/superpowers/specs/2026-03-23-program-tab-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `src/lib/exercises.ts` | Static exercise database (~100 exercises with muscle group + equipment) |
| `src/lib/templates/types.ts` | Template type definitions |
| `src/lib/templates/ppl.ts` | Push/Pull/Legs template data |
| `src/lib/templates/upper-lower.ts` | Upper/Lower template data |
| `src/lib/templates/full-body.ts` | Full Body template data |
| `src/lib/templates/index.ts` | Re-exports, `getAllTemplates()`, `getTemplate()` |
| `src/lib/supabase/programs.ts` | All Supabase queries for programs, days, exercises |
| `src/app/(app)/program/actions.ts` | Server actions for all mutations |
| `src/app/(app)/program/templates/page.tsx` | Template browser page |
| `src/app/(app)/program/new/page.tsx` | Create program form |
| `src/app/(app)/program/[id]/page.tsx` | Program detail page (server) |
| `src/app/(app)/program/[id]/program-detail-client.tsx` | Program detail interactive client component |
| `src/app/(app)/program/[id]/day/[dayId]/page.tsx` | Day detail page (server) |
| `src/app/(app)/program/[id]/day/[dayId]/day-detail-client.tsx` | Day detail interactive client component |
| `src/components/workout/program-card.tsx` | Program list card |
| `src/components/workout/template-card.tsx` | Template preview card |
| `src/components/workout/day-card.tsx` | Day list card |
| `src/components/workout/exercise-row.tsx` | Exercise row with inline edit |
| `src/components/workout/exercise-picker.tsx` | Searchable exercise sheet |
| `src/components/workout/muscle-group-badge.tsx` | Colored muscle group badge |

### Modified Files

| File | Change |
|------|--------|
| `src/app/(app)/program/page.tsx` | Replace placeholder with program list + empty state |
| `src/app/layout.tsx` | Swap Geist → Outfit font |
| `src/app/globals.css` | Update `--primary` to blue, update `--font-sans` reference |

---

## Task 1: Swap Font to Outfit and Update Theme Colors

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update layout.tsx to use Outfit**

Replace the Geist imports and config with Outfit:

```tsx
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IronIQ",
  description: "AI-powered fitness tracker and coaching assistant",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update globals.css theme**

In the `@theme inline` block, update the font reference:
```css
--font-sans: var(--font-outfit);
```

Remove the `--font-mono: var(--font-geist-mono);` line (no longer used).

Update the `.dark` section to use blue as primary:
```css
--primary: oklch(0.623 0.214 259.815);
--primary-foreground: oklch(0.985 0 0);
```

This maps to Tailwind `blue-500` (`#3b82f6`) in oklch.

- [ ] **Step 3: Verify the app runs**

Run: `pnpm dev`

Open `http://localhost:3000` and verify:
- Font has changed from Geist to Outfit
- Tab bar active color is now blue
- Profile page buttons use blue accent

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "switch font to Outfit, update primary color to blue"
```

---

## Task 2: Add shadcn/ui Components (Select, Dialog, Sonner)

**Files:**
- Create: `src/components/ui/select.tsx` (via shadcn CLI)
- Create: `src/components/ui/dialog.tsx` (via shadcn CLI)
- Create: `src/components/ui/sonner.tsx` (via shadcn CLI)
- Modify: `src/app/layout.tsx` (add Toaster)

- [ ] **Step 1: Install components via shadcn CLI**

```bash
pnpm dlx shadcn@latest add select dialog sonner
```

- [ ] **Step 2: Add Toaster to root layout**

In `src/app/layout.tsx`, add the Sonner Toaster inside the `<body>`:

```tsx
import { Toaster } from "@/components/ui/sonner";

// Inside the body:
<body className="min-h-full flex flex-col bg-background text-foreground">
  {children}
  <Toaster />
</body>
```

- [ ] **Step 3: Verify**

Run: `pnpm build`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/select.tsx src/components/ui/dialog.tsx src/components/ui/sonner.tsx src/app/layout.tsx package.json pnpm-lock.yaml
git commit -m "add shadcn select, dialog, and sonner components"
```

---

## Task 3: Exercise Database

**Files:**
- Create: `src/lib/exercises.ts`

- [ ] **Step 1: Create the exercise database file**

Create `src/lib/exercises.ts` with the type and ~100 exercises:

```ts
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
};

export const EXERCISES: Exercise[] = [
  // Chest
  { id: "bb-bench-press", name: "Barbell Bench Press", muscleGroup: "chest", equipment: "barbell" },
  { id: "db-bench-press", name: "Dumbbell Bench Press", muscleGroup: "chest", equipment: "dumbbell" },
  { id: "incline-bb-press", name: "Incline Barbell Press", muscleGroup: "chest", equipment: "barbell" },
  { id: "incline-db-press", name: "Incline Dumbbell Press", muscleGroup: "chest", equipment: "dumbbell" },
  { id: "decline-bb-press", name: "Decline Barbell Press", muscleGroup: "chest", equipment: "barbell" },
  { id: "cable-flyes", name: "Cable Flyes", muscleGroup: "chest", equipment: "cable" },
  { id: "pec-deck", name: "Pec Deck", muscleGroup: "chest", equipment: "machine" },
  { id: "dips-chest", name: "Dips (Chest)", muscleGroup: "chest", equipment: "bodyweight" },
  { id: "push-ups", name: "Push-Ups", muscleGroup: "chest", equipment: "bodyweight" },
  { id: "db-flyes", name: "Dumbbell Flyes", muscleGroup: "chest", equipment: "dumbbell" },

  // Back
  { id: "bb-row", name: "Barbell Row", muscleGroup: "back", equipment: "barbell" },
  { id: "db-row", name: "Dumbbell Row", muscleGroup: "back", equipment: "dumbbell" },
  { id: "pull-ups", name: "Pull-Ups", muscleGroup: "back", equipment: "bodyweight" },
  { id: "chin-ups", name: "Chin-Ups", muscleGroup: "back", equipment: "bodyweight" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "back", equipment: "cable" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "back", equipment: "cable" },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "back", equipment: "barbell" },
  { id: "face-pulls", name: "Face Pulls", muscleGroup: "back", equipment: "cable" },
  { id: "bb-deadlift", name: "Deadlift", muscleGroup: "back", equipment: "barbell" },
  { id: "rack-pulls", name: "Rack Pulls", muscleGroup: "back", equipment: "barbell" },

  // Shoulders
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "shoulders", equipment: "barbell" },
  { id: "db-shoulder-press", name: "Dumbbell Shoulder Press", muscleGroup: "shoulders", equipment: "dumbbell" },
  { id: "lateral-raises", name: "Lateral Raises", muscleGroup: "shoulders", equipment: "dumbbell" },
  { id: "cable-lateral-raises", name: "Cable Lateral Raises", muscleGroup: "shoulders", equipment: "cable" },
  { id: "front-raises", name: "Front Raises", muscleGroup: "shoulders", equipment: "dumbbell" },
  { id: "rear-delt-flyes", name: "Rear Delt Flyes", muscleGroup: "shoulders", equipment: "dumbbell" },
  { id: "arnold-press", name: "Arnold Press", muscleGroup: "shoulders", equipment: "dumbbell" },
  { id: "upright-rows", name: "Upright Rows", muscleGroup: "shoulders", equipment: "barbell" },
  { id: "machine-shoulder-press", name: "Machine Shoulder Press", muscleGroup: "shoulders", equipment: "machine" },
  { id: "reverse-pec-deck", name: "Reverse Pec Deck", muscleGroup: "shoulders", equipment: "machine" },

  // Biceps
  { id: "bb-curl", name: "Barbell Curl", muscleGroup: "biceps", equipment: "barbell" },
  { id: "db-curl", name: "Dumbbell Curl", muscleGroup: "biceps", equipment: "dumbbell" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "biceps", equipment: "dumbbell" },
  { id: "preacher-curl", name: "Preacher Curl", muscleGroup: "biceps", equipment: "barbell" },
  { id: "cable-curl", name: "Cable Curl", muscleGroup: "biceps", equipment: "cable" },
  { id: "incline-db-curl", name: "Incline Dumbbell Curl", muscleGroup: "biceps", equipment: "dumbbell" },
  { id: "concentration-curl", name: "Concentration Curl", muscleGroup: "biceps", equipment: "dumbbell" },
  { id: "ez-bar-curl", name: "EZ Bar Curl", muscleGroup: "biceps", equipment: "barbell" },
  { id: "spider-curl", name: "Spider Curl", muscleGroup: "biceps", equipment: "dumbbell" },
  { id: "machine-curl", name: "Machine Curl", muscleGroup: "biceps", equipment: "machine" },

  // Triceps
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "triceps", equipment: "cable" },
  { id: "overhead-tricep-ext", name: "Overhead Tricep Extension", muscleGroup: "triceps", equipment: "cable" },
  { id: "skull-crushers", name: "Skull Crushers", muscleGroup: "triceps", equipment: "barbell" },
  { id: "close-grip-bench", name: "Close Grip Bench Press", muscleGroup: "triceps", equipment: "barbell" },
  { id: "tricep-dips", name: "Tricep Dips", muscleGroup: "triceps", equipment: "bodyweight" },
  { id: "db-tricep-kickback", name: "Dumbbell Kickback", muscleGroup: "triceps", equipment: "dumbbell" },
  { id: "rope-pushdown", name: "Rope Pushdown", muscleGroup: "triceps", equipment: "cable" },
  { id: "db-overhead-ext", name: "Dumbbell Overhead Extension", muscleGroup: "triceps", equipment: "dumbbell" },
  { id: "machine-tricep-ext", name: "Machine Tricep Extension", muscleGroup: "triceps", equipment: "machine" },
  { id: "diamond-push-ups", name: "Diamond Push-Ups", muscleGroup: "triceps", equipment: "bodyweight" },

  // Quads
  { id: "bb-squat", name: "Barbell Squat", muscleGroup: "quads", equipment: "barbell" },
  { id: "front-squat", name: "Front Squat", muscleGroup: "quads", equipment: "barbell" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "quads", equipment: "machine" },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "quads", equipment: "machine" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscleGroup: "quads", equipment: "dumbbell" },
  { id: "goblet-squat", name: "Goblet Squat", muscleGroup: "quads", equipment: "dumbbell" },
  { id: "hack-squat", name: "Hack Squat", muscleGroup: "quads", equipment: "machine" },
  { id: "walking-lunge", name: "Walking Lunge", muscleGroup: "quads", equipment: "dumbbell" },
  { id: "sissy-squat", name: "Sissy Squat", muscleGroup: "quads", equipment: "bodyweight" },
  { id: "step-ups", name: "Step-Ups", muscleGroup: "quads", equipment: "dumbbell" },

  // Hamstrings
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "hamstrings", equipment: "barbell" },
  { id: "db-rdl", name: "Dumbbell RDL", muscleGroup: "hamstrings", equipment: "dumbbell" },
  { id: "lying-leg-curl", name: "Lying Leg Curl", muscleGroup: "hamstrings", equipment: "machine" },
  { id: "seated-leg-curl", name: "Seated Leg Curl", muscleGroup: "hamstrings", equipment: "machine" },
  { id: "nordic-curl", name: "Nordic Curl", muscleGroup: "hamstrings", equipment: "bodyweight" },
  { id: "good-morning", name: "Good Morning", muscleGroup: "hamstrings", equipment: "barbell" },
  { id: "cable-pull-through", name: "Cable Pull-Through", muscleGroup: "hamstrings", equipment: "cable" },
  { id: "single-leg-rdl", name: "Single Leg RDL", muscleGroup: "hamstrings", equipment: "dumbbell" },
  { id: "glute-ham-raise", name: "Glute-Ham Raise", muscleGroup: "hamstrings", equipment: "bodyweight" },
  { id: "stiff-leg-deadlift", name: "Stiff Leg Deadlift", muscleGroup: "hamstrings", equipment: "barbell" },

  // Glutes
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "glutes", equipment: "barbell" },
  { id: "db-hip-thrust", name: "Dumbbell Hip Thrust", muscleGroup: "glutes", equipment: "dumbbell" },
  { id: "cable-kickback", name: "Cable Kickback", muscleGroup: "glutes", equipment: "cable" },
  { id: "glute-bridge", name: "Glute Bridge", muscleGroup: "glutes", equipment: "bodyweight" },
  { id: "sumo-deadlift", name: "Sumo Deadlift", muscleGroup: "glutes", equipment: "barbell" },
  { id: "hip-abduction", name: "Hip Abduction Machine", muscleGroup: "glutes", equipment: "machine" },

  // Calves
  { id: "standing-calf-raise", name: "Standing Calf Raise", muscleGroup: "calves", equipment: "machine" },
  { id: "seated-calf-raise", name: "Seated Calf Raise", muscleGroup: "calves", equipment: "machine" },
  { id: "db-calf-raise", name: "Dumbbell Calf Raise", muscleGroup: "calves", equipment: "dumbbell" },
  { id: "leg-press-calf-raise", name: "Leg Press Calf Raise", muscleGroup: "calves", equipment: "machine" },

  // Core
  { id: "plank", name: "Plank", muscleGroup: "core", equipment: "bodyweight" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscleGroup: "core", equipment: "bodyweight" },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "core", equipment: "cable" },
  { id: "ab-wheel", name: "Ab Wheel Rollout", muscleGroup: "core", equipment: "bodyweight" },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "core", equipment: "bodyweight" },
  { id: "decline-crunch", name: "Decline Crunch", muscleGroup: "core", equipment: "bodyweight" },
  { id: "pallof-press", name: "Pallof Press", muscleGroup: "core", equipment: "cable" },
  { id: "dead-bug", name: "Dead Bug", muscleGroup: "core", equipment: "bodyweight" },
];

export function searchExercises(query: string, muscleGroup?: MuscleGroup): Exercise[] {
  let results = EXERCISES;
  if (muscleGroup) {
    results = results.filter((e) => e.muscleGroup === muscleGroup);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter((e) => e.name.toLowerCase().includes(q));
  }
  return results;
}

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/exercises.ts
git commit -m "add static exercise database with 98 exercises"
```

---

## Task 4: Workout Templates

**Files:**
- Create: `src/lib/templates/types.ts`
- Create: `src/lib/templates/ppl.ts`
- Create: `src/lib/templates/upper-lower.ts`
- Create: `src/lib/templates/full-body.ts`
- Create: `src/lib/templates/index.ts`

- [ ] **Step 1: Create template types**

Create `src/lib/templates/types.ts`:

```ts
export type TemplateExercise = {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  notes?: string;
};

export type TemplateDay = {
  name: string;
  targetMuscles: string[];
  exercises: TemplateExercise[];
};

export type WorkoutTemplate = {
  key: string;
  name: string;
  description: string;
  splitType: "ppl" | "upper_lower" | "full_body";
  daysPerWeek: number;
  days: TemplateDay[];
};
```

- [ ] **Step 2: Create PPL template**

Create `src/lib/templates/ppl.ts` with a full 6-day PPL program. Each day has 5-7 exercises with sets, reps, rest times, and notes. Days: Push, Pull, Legs, Push 2, Pull 2, Legs 2.

The template should use exercise IDs from `src/lib/exercises.ts` in the `exerciseId` field and include the display name in `exerciseName`.

- [ ] **Step 3: Create Upper/Lower template**

Create `src/lib/templates/upper-lower.ts` with a 4-day Upper/Lower program. Days: Upper A, Lower A, Upper B, Lower B.

- [ ] **Step 4: Create Full Body template**

Create `src/lib/templates/full-body.ts` with a 3-day Full Body program. Days: Full Body A, Full Body B, Full Body C. Each day has 6-7 compound + accessory exercises.

- [ ] **Step 5: Create index.ts**

Create `src/lib/templates/index.ts`:

```ts
import { pplTemplate } from "./ppl";
import { upperLowerTemplate } from "./upper-lower";
import { fullBodyTemplate } from "./full-body";
import type { WorkoutTemplate } from "./types";

export type { WorkoutTemplate, TemplateDay, TemplateExercise } from "./types";

const TEMPLATES: WorkoutTemplate[] = [
  pplTemplate,
  upperLowerTemplate,
  fullBodyTemplate,
];

export function getAllTemplates(): WorkoutTemplate[] {
  return TEMPLATES;
}

export function getTemplate(key: string): WorkoutTemplate | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
```

- [ ] **Step 6: Verify**

Run: `pnpm build`

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/lib/templates/
git commit -m "add PPL, Upper/Lower, and Full Body workout templates"
```

---

## Task 5: MuscleGroupBadge Component

**Files:**
- Create: `src/components/workout/muscle-group-badge.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/workout/muscle-group-badge.tsx`:

```tsx
import { cn } from "@/lib/utils";
import type { MuscleGroup } from "@/lib/exercises";

const MUSCLE_GROUP_COLORS: Record<MuscleGroup, { bg: string; text: string }> = {
  chest: { bg: "bg-red-400/15", text: "text-red-400" },
  back: { bg: "bg-indigo-400/15", text: "text-indigo-400" },
  shoulders: { bg: "bg-amber-400/15", text: "text-amber-400" },
  biceps: { bg: "bg-fuchsia-400/15", text: "text-fuchsia-400" },
  triceps: { bg: "bg-cyan-400/15", text: "text-cyan-400" },
  quads: { bg: "bg-green-400/15", text: "text-green-400" },
  hamstrings: { bg: "bg-orange-400/15", text: "text-orange-400" },
  glutes: { bg: "bg-rose-400/15", text: "text-rose-400" },
  calves: { bg: "bg-teal-400/15", text: "text-teal-400" },
  core: { bg: "bg-yellow-300/15", text: "text-yellow-300" },
};

const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  core: "Core",
};

export function MuscleGroupBadge({
  muscle,
  className,
}: {
  muscle: string;
  className?: string;
}) {
  const key = muscle.toLowerCase() as MuscleGroup;
  const colors = MUSCLE_GROUP_COLORS[key] ?? { bg: "bg-muted", text: "text-muted-foreground" };
  const label = MUSCLE_GROUP_LABELS[key] ?? muscle;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build`

- [ ] **Step 3: Commit**

```bash
git add src/components/workout/muscle-group-badge.tsx
git commit -m "add MuscleGroupBadge component with per-group colors"
```

---

## Task 6: Supabase Query Module

**Files:**
- Create: `src/lib/supabase/programs.ts`

- [ ] **Step 1: Create the query module**

Create `src/lib/supabase/programs.ts` with all typed Supabase query functions. This file imports `createClient` from `./server` and provides:

```ts
import { createClient } from "./server";
import type { Database } from "@/types/database";

type Program = Database["public"]["Tables"]["workout_programs"]["Row"];
type Day = Database["public"]["Tables"]["workout_days"]["Row"];
type Exercise = Database["public"]["Tables"]["workout_exercises"]["Row"];

export type ProgramWithDays = Program & {
  workout_days: (Day & { workout_exercises: Exercise[] })[];
};

export async function getUserPrograms(userId: string): Promise<Program[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_programs")
    .select("*")
    .eq("user_id", userId)
    .eq("is_template", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProgram(programId: string): Promise<ProgramWithDays> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_programs")
    .select(`
      *,
      workout_days (
        *,
        workout_exercises (*)
      )
    `)
    .eq("id", programId)
    .single();
  if (error) throw error;
  // Sort days by day_order, exercises by exercise_order
  data.workout_days = data.workout_days
    .sort((a: Day, b: Day) => a.day_order - b.day_order)
    .map((day: Day & { workout_exercises: Exercise[] }) => ({
      ...day,
      workout_exercises: day.workout_exercises.sort(
        (a: Exercise, b: Exercise) => a.exercise_order - b.exercise_order
      ),
    }));
  return data as ProgramWithDays;
}

export async function createProgram(
  userId: string,
  name: string,
  splitType: string,
  daysPerWeek: number
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_programs")
    .insert({ user_id: userId, name, split_type: splitType, days_per_week: daysPerWeek })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateProgram(
  programId: string,
  fields: { name?: string; split_type?: string; days_per_week?: number }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_programs")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", programId);
  if (error) throw error;
}

export async function deleteProgram(programId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_programs")
    .delete()
    .eq("id", programId);
  if (error) throw error;
}

export async function setActiveProgram(userId: string, programId: string): Promise<void> {
  const supabase = await createClient();
  // Deactivate all
  await supabase
    .from("workout_programs")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  // Activate target
  const { error } = await supabase
    .from("workout_programs")
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq("id", programId);
  if (error) throw error;
}

export async function createDay(
  programId: string,
  name: string,
  targetMuscles: string[]
): Promise<string> {
  const supabase = await createClient();
  // Get next day_order
  const { data: existing } = await supabase
    .from("workout_days")
    .select("day_order")
    .eq("program_id", programId)
    .order("day_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.day_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("workout_days")
    .insert({ program_id: programId, name, day_order: nextOrder, target_muscles: targetMuscles })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateDay(
  dayId: string,
  fields: { name?: string; target_muscles?: string[] }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_days")
    .update(fields)
    .eq("id", dayId);
  if (error) throw error;
}

export async function deleteDay(dayId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_days")
    .delete()
    .eq("id", dayId);
  if (error) throw error;
}

export async function reorderDays(programId: string, dayIds: string[]): Promise<void> {
  const supabase = await createClient();
  const updates = dayIds.map((id, index) =>
    supabase.from("workout_days").update({ day_order: index + 1 }).eq("id", id)
  );
  await Promise.all(updates);
}

export async function addExercise(
  dayId: string,
  exerciseName: string,
  targetSets: number,
  targetReps: string,
  restSeconds: number
): Promise<string> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("workout_exercises")
    .select("exercise_order")
    .eq("day_id", dayId)
    .order("exercise_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.exercise_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("workout_exercises")
    .insert({
      day_id: dayId,
      exercise_name: exerciseName,
      target_sets: targetSets,
      target_reps: targetReps,
      rest_seconds: restSeconds,
      exercise_order: nextOrder,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateExercise(
  exerciseId: string,
  fields: {
    exercise_name?: string;
    target_sets?: number;
    target_reps?: string;
    rest_seconds?: number;
    notes?: string;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_exercises")
    .update(fields)
    .eq("id", exerciseId);
  if (error) throw error;
}

export async function deleteExercise(exerciseId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("id", exerciseId);
  if (error) throw error;
}

export async function reorderExercises(dayId: string, exerciseIds: string[]): Promise<void> {
  const supabase = await createClient();
  const updates = exerciseIds.map((id, index) =>
    supabase.from("workout_exercises").update({ exercise_order: index + 1 }).eq("id", id)
  );
  await Promise.all(updates);
}

export async function adoptTemplate(
  userId: string,
  template: import("@/lib/templates/types").WorkoutTemplate
): Promise<string> {
  const supabase = await createClient();

  // Create the program
  const { data: program, error: programError } = await supabase
    .from("workout_programs")
    .insert({
      user_id: userId,
      name: template.name,
      split_type: template.splitType,
      days_per_week: template.daysPerWeek,
    })
    .select("id")
    .single();
  if (programError) throw programError;

  // Create days and exercises
  for (let i = 0; i < template.days.length; i++) {
    const day = template.days[i];
    const { data: dayData, error: dayError } = await supabase
      .from("workout_days")
      .insert({
        program_id: program.id,
        name: day.name,
        day_order: i + 1,
        target_muscles: day.targetMuscles,
      })
      .select("id")
      .single();
    if (dayError) throw dayError;

    const exercises = day.exercises.map((ex, j) => ({
      day_id: dayData.id,
      exercise_name: ex.exerciseName,
      target_sets: ex.targetSets,
      target_reps: ex.targetReps,
      rest_seconds: ex.restSeconds,
      exercise_order: j + 1,
      notes: ex.notes ?? null,
    }));

    const { error: exError } = await supabase
      .from("workout_exercises")
      .insert(exercises);
    if (exError) throw exError;
  }

  return program.id;
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build`

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/programs.ts
git commit -m "add Supabase query module for programs, days, exercises"
```

---

## Task 7: Server Actions

**Files:**
- Create: `src/app/(app)/program/actions.ts`

- [ ] **Step 1: Create the server actions file**

Create `src/app/(app)/program/actions.ts` with all mutation actions. Each action:
1. Is marked `"use server"`
2. Gets the current user from Supabase auth
3. Calls the appropriate query function from `src/lib/supabase/programs.ts`
4. Wraps in try/catch, returns `{ error?: string }`
5. Calls `revalidatePath` or `redirect` as appropriate

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import * as programs from "@/lib/supabase/programs";
import { getTemplate } from "@/lib/templates";

async function getCurrentUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function createProgram(prevState: { error?: string } | null, formData: FormData) {
  const userId = await getCurrentUserId();
  const name = formData.get("name") as string;
  const splitType = formData.get("splitType") as string;
  const daysPerWeek = parseInt(formData.get("daysPerWeek") as string, 10);

  if (!name || !splitType || !daysPerWeek) {
    return { error: "All fields are required" };
  }

  try {
    const id = await programs.createProgram(userId, name, splitType, daysPerWeek);
    redirect(`/program/${id}`);
  } catch (e) {
    if ((e as any)?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: "Failed to create program" };
  }
}

export async function updateProgram(programId: string, fields: { name?: string; split_type?: string; days_per_week?: number }) {
  try {
    await programs.updateProgram(programId, fields);
    revalidatePath(`/program/${programId}`);
    return {};
  } catch {
    return { error: "Failed to update program" };
  }
}

export async function deleteProgram(programId: string) {
  try {
    await programs.deleteProgram(programId);
  } catch {
    return { error: "Failed to delete program" };
  }
  redirect("/program");
}

export async function setActiveProgram(programId: string) {
  try {
    const userId = await getCurrentUserId();
    await programs.setActiveProgram(userId, programId);
    revalidatePath("/program");
    revalidatePath(`/program/${programId}`);
    return {};
  } catch {
    return { error: "Failed to set active program" };
  }
}

export async function adoptTemplate(templateKey: string) {
  const userId = await getCurrentUserId();
  const template = getTemplate(templateKey);
  if (!template) return { error: "Template not found" };

  try {
    const id = await programs.adoptTemplate(userId, template);
    redirect(`/program/${id}`);
  } catch (e) {
    if ((e as any)?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: "Failed to adopt template" };
  }
}

export async function createDay(programId: string, name: string, targetMuscles: string[]) {
  if (!name) return { error: "Day name is required" };
  try {
    await programs.createDay(programId, name, targetMuscles);
    revalidatePath(`/program/${programId}`);
    return {};
  } catch {
    return { error: "Failed to create day" };
  }
}

export async function updateDay(dayId: string, programId: string, fields: { name?: string; target_muscles?: string[] }) {
  try {
    await programs.updateDay(dayId, fields);
    revalidatePath(`/program/${programId}`);
    return {};
  } catch {
    return { error: "Failed to update day" };
  }
}

export async function deleteDay(dayId: string, programId: string) {
  try {
    await programs.deleteDay(dayId);
    revalidatePath(`/program/${programId}`);
    return {};
  } catch {
    return { error: "Failed to delete day" };
  }
}

export async function reorderDays(programId: string, dayIds: string[]) {
  try {
    await programs.reorderDays(programId, dayIds);
    revalidatePath(`/program/${programId}`);
    return {};
  } catch {
    return { error: "Failed to reorder days" };
  }
}

export async function addExerciseAction(
  dayId: string,
  programId: string,
  exerciseName: string,
  targetSets: number,
  targetReps: string,
  restSeconds: number
) {
  if (!exerciseName) return { error: "Exercise name is required" };
  try {
    await programs.addExercise(dayId, exerciseName, targetSets, targetReps, restSeconds);
    revalidatePath(`/program/${programId}/day/${dayId}`);
    return {};
  } catch {
    return { error: "Failed to add exercise" };
  }
}

export async function updateExerciseAction(
  exerciseId: string,
  programId: string,
  dayId: string,
  fields: { exercise_name?: string; target_sets?: number; target_reps?: string; rest_seconds?: number; notes?: string }
) {
  try {
    await programs.updateExercise(exerciseId, fields);
    revalidatePath(`/program/${programId}/day/${dayId}`);
    return {};
  } catch {
    return { error: "Failed to update exercise" };
  }
}

export async function deleteExerciseAction(exerciseId: string, programId: string, dayId: string) {
  try {
    await programs.deleteExercise(exerciseId);
    revalidatePath(`/program/${programId}/day/${dayId}`);
    return {};
  } catch {
    return { error: "Failed to delete exercise" };
  }
}

export async function reorderExercisesAction(dayId: string, programId: string, exerciseIds: string[]) {
  try {
    await programs.reorderExercises(dayId, exerciseIds);
    revalidatePath(`/program/${programId}/day/${dayId}`);
    return {};
  } catch {
    return { error: "Failed to reorder exercises" };
  }
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build`

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/program/actions.ts
git commit -m "add server actions for program, day, and exercise mutations"
```

---

## Task 8: ProgramCard and TemplateCard Components

**Files:**
- Create: `src/components/workout/program-card.tsx`
- Create: `src/components/workout/template-card.tsx`

- [ ] **Step 1: Create ProgramCard**

Create `src/components/workout/program-card.tsx`:

```tsx
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database";

type Program = Database["public"]["Tables"]["workout_programs"]["Row"];

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push/Pull/Legs",
  upper_lower: "Upper/Lower",
  full_body: "Full Body",
};

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Link href={`/program/${program.id}`}>
      <div
        className={`rounded-xl border p-4 transition-colors hover:bg-accent/50 ${
          program.is_active ? "border-primary" : "border-border"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-[15px]">{program.name}</span>
          {program.is_active && (
            <Badge variant="default" className="text-[11px]">Active</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <span className="bg-secondary text-secondary-foreground text-[13px] px-2 py-0.5 rounded-md">
            {SPLIT_LABELS[program.split_type] ?? program.split_type}
          </span>
          <span className="bg-secondary text-secondary-foreground text-[13px] px-2 py-0.5 rounded-md">
            {program.days_per_week} days/wk
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create TemplateCard**

Create `src/components/workout/template-card.tsx`:

```tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { adoptTemplate } from "@/app/(app)/program/actions";
import { toast } from "sonner";
import type { WorkoutTemplate } from "@/lib/templates/types";

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push/Pull/Legs",
  upper_lower: "Upper/Lower",
  full_body: "Full Body",
};

export function TemplateCard({ template }: { template: WorkoutTemplate }) {
  const [isPending, startTransition] = useTransition();

  function handleAdopt() {
    startTransition(async () => {
      const result = await adoptTemplate(template.key);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[15px]">{template.name}</span>
        <span className="bg-secondary text-secondary-foreground text-[11px] px-2 py-0.5 rounded-md">
          {template.daysPerWeek} days
        </span>
      </div>
      <p className="text-muted-foreground text-[12px] mb-3">{template.description}</p>
      <div className="text-muted-foreground text-[11px] mb-3">
        {template.days.map((d) => d.name).join(" · ")}
      </div>
      <Button
        className="w-full"
        size="sm"
        onClick={handleAdopt}
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Use Template"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm build`

- [ ] **Step 4: Commit**

```bash
git add src/components/workout/program-card.tsx src/components/workout/template-card.tsx
git commit -m "add ProgramCard and TemplateCard components"
```

---

## Task 9: DayCard Component

**Files:**
- Create: `src/components/workout/day-card.tsx`

- [ ] **Step 1: Create DayCard**

Create `src/components/workout/day-card.tsx`:

```tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MuscleGroupBadge } from "./muscle-group-badge";
import type { Database } from "@/types/database";

type Day = Database["public"]["Tables"]["workout_days"]["Row"];
type Exercise = Database["public"]["Tables"]["workout_exercises"]["Row"];

export function DayCard({
  day,
  programId,
  exerciseCount,
}: {
  day: Day;
  programId: string;
  exerciseCount: number;
}) {
  return (
    <Link href={`/program/${programId}/day/${day.id}`}>
      <div className="rounded-lg border border-border p-3 transition-colors hover:bg-accent/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">
              Day {day.day_order} — {day.name}
            </div>
            <div className="flex gap-1 mt-1 flex-wrap">
              {day.target_muscles.map((m) => (
                <MuscleGroupBadge key={m} muscle={m} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <span>{exerciseCount} exercises</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm build`

- [ ] **Step 3: Commit**

```bash
git add src/components/workout/day-card.tsx
git commit -m "add DayCard component"
```

---

## Task 10: Program List Page (with Empty State)

**Files:**
- Modify: `src/app/(app)/program/page.tsx`

- [ ] **Step 1: Replace placeholder with full program list page**

Rewrite `src/app/(app)/program/page.tsx` as a server component:

```tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserPrograms } from "@/lib/supabase/programs";
import { getAllTemplates } from "@/lib/templates";
import { ProgramCard } from "@/components/workout/program-card";
import { TemplateCard } from "@/components/workout/template-card";

export default async function ProgramPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const userPrograms = await getUserPrograms(user.id);
  const templates = getAllTemplates();
  const hasPrograms = userPrograms.length > 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Programs</h1>
        {hasPrograms && (
          <Link
            href="/program/new"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Link>
        )}
      </div>

      {hasPrograms ? (
        <div className="space-y-3">
          {userPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
          <div className="text-center pt-4">
            <Link href="/program/templates" className="text-primary text-sm">
              Browse Templates →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🏋️</div>
            <p className="text-muted-foreground text-sm">
              No programs yet. Pick a template to get started!
            </p>
          </div>
          <div className="space-y-3">
            {templates.map((template) => (
              <TemplateCard key={template.key} template={template} />
            ))}
          </div>
          <div className="text-center pt-2">
            <span className="text-muted-foreground text-sm">
              or{" "}
              <Link href="/program/new" className="text-primary">
                create from scratch
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm dev`

Navigate to `/program`. With no programs, you should see the template showcase. After adopting a template, you should see the program card.

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/program/page.tsx
git commit -m "implement program list page with empty state and template showcase"
```

---

## Task 11: Templates Browser Page

**Files:**
- Create: `src/app/(app)/program/templates/page.tsx`

- [ ] **Step 1: Create templates page**

Create `src/app/(app)/program/templates/page.tsx`:

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllTemplates } from "@/lib/templates";
import { TemplateCard } from "@/components/workout/template-card";

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/program" className="text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Templates</h1>
      </div>
      <div className="space-y-3">
        {templates.map((template) => (
          <TemplateCard key={template.key} template={template} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(app)/program/templates/page.tsx
git commit -m "add templates browser page"
```

---

## Task 12: Create Program Page

**Files:**
- Create: `src/app/(app)/program/new/page.tsx`

- [ ] **Step 1: Create the new program form page**

Create `src/app/(app)/program/new/page.tsx` as a client component with a form for name, split type (select), and days per week (select). Calls the `createProgram` server action via form action.

```tsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProgram } from "@/app/(app)/program/actions";

const SPLIT_OPTIONS = [
  { value: "ppl", label: "Push / Pull / Legs" },
  { value: "upper_lower", label: "Upper / Lower" },
  { value: "full_body", label: "Full Body" },
];

const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function NewProgramPage() {
  const [state, formAction, isPending] = useActionState(createProgram, null);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/program" className="text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">New Program</h1>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Program Name</Label>
          <Input id="name" name="name" placeholder="My Workout Program" required />
        </div>

        <div className="space-y-2">
          <Label>Split Type</Label>
          <Select name="splitType" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a split" />
            </SelectTrigger>
            <SelectContent>
              {SPLIT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Days per Week</Label>
          <Select name="daysPerWeek" required>
            <SelectTrigger>
              <SelectValue placeholder="How many days?" />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OPTIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} {d === 1 ? "day" : "days"} / week
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {state?.error && (
          <p className="text-destructive text-sm">{state.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Program"}
        </Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm dev`, navigate to `/program/new`. Fill the form and submit. Should create a program and redirect to `/program/[id]` (which will 404 for now — that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/program/new/page.tsx
git commit -m "add create program form page"
```

---

## Task 13: Program Detail Page

**Files:**
- Create: `src/app/(app)/program/[id]/page.tsx`

- [ ] **Step 1: Create program detail page**

Create `src/app/(app)/program/[id]/page.tsx` as a server component that:
1. Fetches the program with days and exercises via `getProgram()`
2. Displays: back link, program name, split/days badges, active toggle, edit/delete
3. Lists days using `DayCard` component
4. Has "Add Day" button that opens an inline form (client component section)
5. Uses `Dialog` for delete confirmation

This is a larger file. It should be a server component with an embedded client component for interactive parts (edit name, add day, delete). Use a separate client wrapper:

Create the page as a server component that passes data to a client component `ProgramDetailClient`:

```tsx
import { notFound } from "next/navigation";
import { getProgram } from "@/lib/supabase/programs";
import { ProgramDetailClient } from "./program-detail-client";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const program = await getProgram(id);
    return <ProgramDetailClient program={program} />;
  } catch {
    notFound();
  }
}
```

Create `src/app/(app)/program/[id]/program-detail-client.tsx` as a client component that renders the full detail view with all interactive features: edit name, set active, delete (with dialog), add day (inline form), and day cards list.

The client component should:
- Show back link to `/program`
- Display editable program name (click to edit, save on blur/enter)
- Show split type and days/week badges
- Show "Active Program" badge or "Set Active" button
- Delete button with confirmation dialog
- List days using `DayCard`
- "Add Day" button that reveals an inline form (name + muscle group multi-select)
- Use `useTransition` for all mutations
- Show toast on success/error

- [ ] **Step 2: Verify**

Run: `pnpm dev`. Navigate to a program detail page. Verify:
- Program name displays and is editable
- Days are listed with muscle badges and exercise counts
- "Set Active" works
- "Delete" shows confirmation dialog
- "Add Day" form works

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/program/[id]/
git commit -m "add program detail page with day management"
```

---

## Task 14: ExerciseRow and ExercisePicker Components

**Files:**
- Create: `src/components/workout/exercise-row.tsx`
- Create: `src/components/workout/exercise-picker.tsx`

- [ ] **Step 1: Create ExerciseRow**

Create `src/components/workout/exercise-row.tsx` as a client component. It shows:
- Exercise name, sets × reps, rest time
- Three-dot menu (using a simple dropdown) with Edit and Delete options
- Inline edit mode: when "Edit" is clicked, fields become editable inputs
- Move up/down buttons for reordering
- Uses `useTransition` for mutations via server actions

- [ ] **Step 2: Create ExercisePicker**

Create `src/components/workout/exercise-picker.tsx` as a client component. It's a Sheet (from shadcn/ui) that contains:
- Search input (filters exercises as you type)
- Muscle group filter chips (clickable, "All" default)
- Scrollable list of matching exercises from `EXERCISES` array
- Each exercise shows name, muscle group, equipment
- Click an exercise to select it (calls `onSelect` callback with default sets/reps/rest)
- "Add custom exercise" option at bottom that shows a text input

```tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { searchExercises, type MuscleGroup } from "@/lib/exercises";

const MUSCLE_FILTERS: { value: MuscleGroup | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "quads", label: "Quads" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "glutes", label: "Glutes" },
  { value: "calves", label: "Calves" },
  { value: "core", label: "Core" },
];

export function ExercisePicker({
  onSelect,
  children,
}: {
  onSelect: (name: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MuscleGroup | "all">("all");
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");

  const results = searchExercises(query, filter === "all" ? undefined : filter);

  function handleSelect(name: string) {
    onSelect(name);
    setOpen(false);
    setQuery("");
    setFilter("all");
    setCustomMode(false);
    setCustomName("");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Add Exercise</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {MUSCLE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[50vh] space-y-1">
            {results.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleSelect(exercise.name)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="text-left">
                  <div className="text-sm">{exercise.name}</div>
                  <div className="text-[11px] text-muted-foreground capitalize">
                    {exercise.muscleGroup} · {exercise.equipment}
                  </div>
                </div>
                <span className="text-primary text-lg">+</span>
              </button>
            ))}
            {results.length === 0 && !customMode && (
              <p className="text-center text-muted-foreground text-sm py-4">
                No exercises found
              </p>
            )}
          </div>

          <div className="border-t border-border pt-3">
            {customMode ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Exercise name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customName.trim()) {
                      handleSelect(customName.trim());
                    }
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (customName.trim()) handleSelect(customName.trim());
                  }}
                  disabled={!customName.trim()}
                >
                  Add
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setCustomMode(true)}
                className="w-full text-center text-primary text-sm py-1"
              >
                + Add custom exercise
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm build`

- [ ] **Step 4: Commit**

```bash
git add src/components/workout/exercise-row.tsx src/components/workout/exercise-picker.tsx
git commit -m "add ExerciseRow and ExercisePicker components"
```

---

## Task 15: Day Detail Page

**Files:**
- Create: `src/app/(app)/program/[id]/day/[dayId]/page.tsx`

- [ ] **Step 1: Create day detail page**

Create the day detail page as a server component that fetches program data, finds the specific day, and passes it to a client component.

The page should:
1. Fetch the program via `getProgram(id)`
2. Find the day matching `dayId` from the program's days
3. Display: back link to program, editable day name, muscle group badges
4. List exercises using `ExerciseRow`
5. "Add Exercise" button that opens `ExercisePicker`
6. When an exercise is selected from the picker, add it with default values (3 sets, "8-12" reps, 90s rest) via the `addExerciseAction` server action

Split into server page + client component (similar to Task 13):

Server page `src/app/(app)/program/[id]/day/[dayId]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { getProgram } from "@/lib/supabase/programs";
import { DayDetailClient } from "./day-detail-client";

export default async function DayDetailPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const { id, dayId } = await params;

  try {
    const program = await getProgram(id);
    const day = program.workout_days.find((d) => d.id === dayId);
    if (!day) notFound();
    return <DayDetailClient program={program} day={day} />;
  } catch {
    notFound();
  }
}
```

Create `src/app/(app)/program/[id]/day/[dayId]/day-detail-client.tsx` as a client component that renders:
- Back link to `/program/[id]`
- Editable day name
- Muscle group badges
- Exercise list with `ExerciseRow` for each exercise
- Move up/down reordering
- "Add Exercise" button opening `ExercisePicker`
- All mutations via server actions with `useTransition`
- Toast feedback

- [ ] **Step 2: Verify end-to-end**

Run: `pnpm dev`. Navigate through the full flow:
1. `/program` → see programs or empty state
2. Adopt a template or create from scratch
3. `/program/[id]` → see days, add/delete days
4. `/program/[id]/day/[dayId]` → see exercises, add/edit/delete/reorder exercises

- [ ] **Step 3: Commit**

```bash
git add src/app/(app)/program/[id]/day/
git commit -m "add day detail page with exercise management"
```

---

## Task 16: Final Polish and Verification

**Files:**
- Various

- [ ] **Step 1: Run the full build**

```bash
pnpm build
```

Fix any TypeScript or build errors.

- [ ] **Step 2: Manual smoke test**

Test the full flow:
1. Sign up / log in
2. `/program` — see empty state with templates
3. Adopt PPL template → redirected to program detail
4. See 6 days with correct exercises
5. Set program as active
6. Navigate to a day → see exercises
7. Add an exercise via picker
8. Edit exercise sets/reps
9. Delete an exercise
10. Go back, create a new program from scratch
11. Add days, add exercises
12. Delete a program

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "polish: fix issues found during smoke testing"
```

- [ ] **Step 4: Final commit — feature complete**

If no fixes were needed, skip this step. Otherwise confirm the build is clean:

```bash
pnpm build
```
