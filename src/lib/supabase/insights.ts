import { createClient } from "./server";
import { EXERCISES } from "@/lib/exercises";
import type { Database } from "@/types/database";

type SetRow = Database["public"]["Tables"]["session_sets"]["Row"];

export interface CompletedSession {
  id: string;
  day_id: string;
  day_name: string;
  target_muscles: string[];
  started_at: string;
  completed_at: string;
  set_count: number;
  total_volume: number;
  duration_minutes: number;
}

export interface SessionDetailSet {
  id: string;
  exercise_name: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  rpe: number | null;
}

export interface SessionDetail {
  id: string;
  day_id: string;
  day_name: string;
  started_at: string;
  completed_at: string;
  notes: string | null;
  sets: SessionDetailSet[];
}

export interface WeeklyVolume {
  week: string;
  volume: number;
}

export interface MuscleVolume {
  muscleGroup: string;
  sets: number;
}

export interface ExerciseProgression {
  sessionDate: string;
  maxWeight: number;
  totalVolume: number;
}

function getMuscleGroup(exerciseName: string): string {
  const match = EXERCISES.find(
    (e) => e.name.toLowerCase() === exerciseName.toLowerCase()
  );
  return match?.muscleGroup ?? "other";
}

export async function getCompletedSessions(
  userId: string,
  limit = 20,
  offset = 0
): Promise<CompletedSession[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`
      id, day_id, started_at, completed_at,
      session_sets (reps, weight),
      workout_days (name, target_muscles)
    `)
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  if (!data) return [];

  return (data as unknown as Array<{
    id: string;
    day_id: string;
    started_at: string;
    completed_at: string;
    session_sets: Array<{ reps: number | null; weight: number | null }>;
    workout_days: { name: string; target_muscles: string[] } | null;
  }>).map((row) => {
    const sets = row.session_sets ?? [];
    const totalVolume = sets.reduce(
      (acc, s) => acc + (s.reps ?? 0) * (s.weight ?? 0),
      0
    );
    const start = new Date(row.started_at);
    const end = new Date(row.completed_at);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

    return {
      id: row.id,
      day_id: row.day_id,
      day_name: row.workout_days?.name ?? "Workout",
      target_muscles: row.workout_days?.target_muscles ?? [],
      started_at: row.started_at,
      completed_at: row.completed_at,
      set_count: sets.length,
      total_volume: Math.round(totalVolume),
      duration_minutes: durationMinutes,
    };
  });
}

export async function getSessionDetail(sessionId: string): Promise<SessionDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`
      id, day_id, started_at, completed_at, notes,
      session_sets (id, exercise_name, set_number, reps, weight, rpe),
      workout_days (name)
    `)
    .eq("id", sessionId)
    .single();

  if (error) return null;
  if (!data) return null;

  const typed = data as unknown as {
    id: string;
    day_id: string;
    started_at: string;
    completed_at: string;
    notes: string | null;
    session_sets: SetRow[];
    workout_days: { name: string } | null;
  };

  const sets = (typed.session_sets ?? []).sort(
    (a, b) => a.exercise_name.localeCompare(b.exercise_name) || a.set_number - b.set_number
  );

  return {
    id: typed.id,
    day_id: typed.day_id,
    day_name: typed.workout_days?.name ?? "Workout",
    started_at: typed.started_at,
    completed_at: typed.completed_at,
    notes: typed.notes,
    sets: sets.map((s) => ({
      id: s.id,
      exercise_name: s.exercise_name,
      set_number: s.set_number,
      reps: s.reps,
      weight: s.weight,
      rpe: s.rpe,
    })),
  };
}

export async function getVolumeByWeek(
  userId: string,
  weekCount = 8
): Promise<WeeklyVolume[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - weekCount * 7);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`completed_at, session_sets (reps, weight)`)
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("completed_at", since.toISOString())
    .order("completed_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  const weekMap = new Map<string, number>();

  for (const session of data as unknown as Array<{
    completed_at: string;
    session_sets: Array<{ reps: number | null; weight: number | null }>;
  }>) {
    const date = new Date(session.completed_at);
    // ISO week key: YYYY-Www
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1); // Monday
    const key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const volume = (session.session_sets ?? []).reduce(
      (acc, s) => acc + (s.reps ?? 0) * (s.weight ?? 0),
      0
    );
    weekMap.set(key, (weekMap.get(key) ?? 0) + volume);
  }

  return Array.from(weekMap.entries()).map(([week, volume]) => ({
    week,
    volume: Math.round(volume),
  }));
}

export async function getVolumeByMuscleGroup(
  userId: string,
  daysBack = 30
): Promise<MuscleVolume[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`session_sets (exercise_name, reps)`)
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("completed_at", since.toISOString());

  if (error) throw error;
  if (!data) return [];

  const groupMap = new Map<string, number>();

  for (const session of data as unknown as Array<{
    session_sets: Array<{ exercise_name: string; reps: number | null }>;
  }>) {
    for (const set of session.session_sets ?? []) {
      const group = getMuscleGroup(set.exercise_name);
      groupMap.set(group, (groupMap.get(group) ?? 0) + 1);
    }
  }

  return Array.from(groupMap.entries())
    .map(([muscleGroup, sets]) => ({ muscleGroup, sets }))
    .sort((a, b) => b.sets - a.sets);
}

export async function getProgressionForExercise(
  userId: string,
  exerciseName: string,
  sessionCount = 10
): Promise<ExerciseProgression[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`completed_at, session_sets (exercise_name, reps, weight)`)
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: true })
    .limit(100);

  if (error) throw error;
  if (!data) return [];

  const result: ExerciseProgression[] = [];

  for (const session of data as unknown as Array<{
    completed_at: string;
    session_sets: Array<{ exercise_name: string; reps: number | null; weight: number | null }>;
  }>) {
    const exerciseSets = (session.session_sets ?? []).filter(
      (s) => s.exercise_name.toLowerCase() === exerciseName.toLowerCase()
    );
    if (exerciseSets.length === 0) continue;

    const maxWeight = Math.max(...exerciseSets.map((s) => s.weight ?? 0));
    const totalVolume = exerciseSets.reduce(
      (acc, s) => acc + (s.reps ?? 0) * (s.weight ?? 0),
      0
    );

    result.push({
      sessionDate: new Date(session.completed_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      maxWeight,
      totalVolume: Math.round(totalVolume),
    });
  }

  return result.slice(-sessionCount);
}

export async function getRecentExerciseNames(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 90);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`session_sets (exercise_name)`)
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("completed_at", since.toISOString());

  if (error) throw error;
  if (!data) return [];

  const names = new Set<string>();
  for (const session of data as unknown as Array<{
    session_sets: Array<{ exercise_name: string }>;
  }>) {
    for (const s of session.session_sets ?? []) {
      names.add(s.exercise_name);
    }
  }

  return Array.from(names).sort();
}
