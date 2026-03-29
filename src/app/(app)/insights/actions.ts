"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getCompletedSessions,
  getProgressionForExercise,
} from "@/lib/supabase/insights";
import type { CompletedSession, ExerciseProgression } from "@/lib/supabase/insights";

async function getCurrentUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function fetchProgressionData(exerciseName: string): Promise<ExerciseProgression[]> {
  try {
    const userId = await getCurrentUserId();
    return await getProgressionForExercise(userId, exerciseName);
  } catch {
    return [];
  }
}

export async function fetchMoreSessions(offset: number): Promise<CompletedSession[]> {
  try {
    const userId = await getCurrentUserId();
    return await getCompletedSessions(userId, 20, offset);
  } catch {
    return [];
  }
}
