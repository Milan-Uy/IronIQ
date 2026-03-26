// Static exercise database for IronIQ

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

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
}

export const EXERCISES: Exercise[] = [
  // ── Chest (10) ──────────────────────────────────────────────
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

  // ── Back (10) ───────────────────────────────────────────────
  { id: "bb-row", name: "Barbell Row", muscleGroup: "back", equipment: "barbell" },
  { id: "db-row", name: "Dumbbell Row", muscleGroup: "back", equipment: "dumbbell" },
  { id: "pull-ups", name: "Pull-Ups", muscleGroup: "back", equipment: "bodyweight" },
  { id: "chin-ups", name: "Chin-Ups", muscleGroup: "back", equipment: "bodyweight" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "back", equipment: "cable" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "back", equipment: "cable" },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "back", equipment: "barbell" },
  { id: "face-pulls", name: "Face Pulls", muscleGroup: "back", equipment: "cable" },
  { id: "deadlift", name: "Deadlift", muscleGroup: "back", equipment: "barbell" },
  { id: "rack-pulls", name: "Rack Pulls", muscleGroup: "back", equipment: "barbell" },

  // ── Shoulders (10) ──────────────────────────────────────────
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

  // ── Biceps (10) ─────────────────────────────────────────────
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

  // ── Triceps (10) ────────────────────────────────────────────
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "triceps", equipment: "cable" },
  { id: "overhead-tricep-ext", name: "Overhead Tricep Extension", muscleGroup: "triceps", equipment: "cable" },
  { id: "skull-crushers", name: "Skull Crushers", muscleGroup: "triceps", equipment: "barbell" },
  { id: "close-grip-bench", name: "Close Grip Bench Press", muscleGroup: "triceps", equipment: "barbell" },
  { id: "tricep-dips", name: "Tricep Dips", muscleGroup: "triceps", equipment: "bodyweight" },
  { id: "db-kickback", name: "Dumbbell Kickback", muscleGroup: "triceps", equipment: "dumbbell" },
  { id: "rope-pushdown", name: "Rope Pushdown", muscleGroup: "triceps", equipment: "cable" },
  { id: "db-overhead-ext", name: "Dumbbell Overhead Extension", muscleGroup: "triceps", equipment: "dumbbell" },
  { id: "machine-tricep-ext", name: "Machine Tricep Extension", muscleGroup: "triceps", equipment: "machine" },
  { id: "diamond-push-ups", name: "Diamond Push-Ups", muscleGroup: "triceps", equipment: "bodyweight" },

  // ── Quads (10) ──────────────────────────────────────────────
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

  // ── Hamstrings (10) ─────────────────────────────────────────
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

  // ── Glutes (6) ──────────────────────────────────────────────
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "glutes", equipment: "barbell" },
  { id: "db-hip-thrust", name: "Dumbbell Hip Thrust", muscleGroup: "glutes", equipment: "dumbbell" },
  { id: "cable-kickback", name: "Cable Kickback", muscleGroup: "glutes", equipment: "cable" },
  { id: "glute-bridge", name: "Glute Bridge", muscleGroup: "glutes", equipment: "bodyweight" },
  { id: "sumo-deadlift", name: "Sumo Deadlift", muscleGroup: "glutes", equipment: "barbell" },
  { id: "hip-abduction-machine", name: "Hip Abduction Machine", muscleGroup: "glutes", equipment: "machine" },

  // ── Calves (4) ──────────────────────────────────────────────
  { id: "standing-calf-raise", name: "Standing Calf Raise", muscleGroup: "calves", equipment: "machine" },
  { id: "seated-calf-raise", name: "Seated Calf Raise", muscleGroup: "calves", equipment: "machine" },
  { id: "db-calf-raise", name: "Dumbbell Calf Raise", muscleGroup: "calves", equipment: "dumbbell" },
  { id: "leg-press-calf-raise", name: "Leg Press Calf Raise", muscleGroup: "calves", equipment: "machine" },

  // ── Core (8) ────────────────────────────────────────────────
  { id: "plank", name: "Plank", muscleGroup: "core", equipment: "bodyweight" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscleGroup: "core", equipment: "bodyweight" },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "core", equipment: "cable" },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", muscleGroup: "core", equipment: "bodyweight" },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "core", equipment: "bodyweight" },
  { id: "decline-crunch", name: "Decline Crunch", muscleGroup: "core", equipment: "bodyweight" },
  { id: "pallof-press", name: "Pallof Press", muscleGroup: "core", equipment: "cable" },
  { id: "dead-bug", name: "Dead Bug", muscleGroup: "core", equipment: "bodyweight" },
];

/** Search exercises by name query and optional muscle group filter. */
export function searchExercises(
  query: string,
  muscleGroup?: MuscleGroup
): Exercise[] {
  const lowerQuery = query.toLowerCase().trim();

  return EXERCISES.filter((exercise) => {
    if (muscleGroup && exercise.muscleGroup !== muscleGroup) {
      return false;
    }
    if (lowerQuery && !exercise.name.toLowerCase().includes(lowerQuery)) {
      return false;
    }
    return true;
  });
}

/** Look up an exercise by its ID. */
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((exercise) => exercise.id === id);
}
