import { createClient } from "@/lib/supabase/server";
import { getActiveProgram } from "@/lib/supabase/programs";
import { getCompletedSessions } from "@/lib/supabase/insights";
import type { UserContext } from "./types";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function buildUserContext(userId: string): Promise<UserContext> {
  const supabase = await createClient();

  const [profileResult, activeProgram, recentSessions] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    getActiveProgram(userId).catch(() => null),
    getCompletedSessions(userId, 5, 0).catch(() => []),
  ]);

  const profile = profileResult.data as Profile | null;

  return {
    userId,
    profile: {
      displayName: profile?.display_name ?? null,
      fitnessGoal: profile?.fitness_goal ?? null,
      experienceLevel: profile?.experience_level ?? null,
      preferredSplit: profile?.preferred_split ?? null,
      workoutsPerWeek: profile?.workouts_per_week ?? null,
      weightUnit: profile?.weight_unit ?? "lbs",
    },
    activeProgram: activeProgram
      ? {
          name: activeProgram.name,
          splitType: activeProgram.split_type,
          days: activeProgram.workout_days.map((d) => ({
            name: d.name,
            targetMuscles: d.target_muscles ?? [],
            exercises: d.workout_exercises.map((e) => ({
              name: e.exercise_name,
              targetSets: e.target_sets,
              targetReps: e.target_reps,
              restSeconds: e.rest_seconds,
            })),
          })),
        }
      : null,
    recentSessions: recentSessions.map((s) => ({
      dayName: s.day_name,
      completedAt: s.completed_at,
      setCount: s.set_count,
      totalVolume: s.total_volume,
    })),
  };
}
