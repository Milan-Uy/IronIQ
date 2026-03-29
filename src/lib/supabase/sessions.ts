import { createClient } from "./server";
import type { Database } from "@/types/database";

type Session = Database["public"]["Tables"]["workout_sessions"]["Row"];
type SetRow = Database["public"]["Tables"]["session_sets"]["Row"];

export type SessionWithSets = Session & {
  session_sets: SetRow[];
};

export async function createSession(userId: string, dayId: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_sessions")
    .insert({ user_id: userId, day_id: dayId, status: "in_progress" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function getActiveSession(userId: string): Promise<SessionWithSets | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`*, session_sets (*)`)
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const typed = data as unknown as SessionWithSets;
  typed.session_sets = typed.session_sets.sort(
    (a, b) => a.exercise_name.localeCompare(b.exercise_name) || a.set_number - b.set_number
  );
  return typed;
}

export async function getSessionWithSets(sessionId: string): Promise<SessionWithSets> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`*, session_sets (*)`)
    .eq("id", sessionId)
    .single();
  if (error) throw error;
  const typed = data as unknown as SessionWithSets;
  typed.session_sets = typed.session_sets.sort(
    (a, b) => a.exercise_name.localeCompare(b.exercise_name) || a.set_number - b.set_number
  );
  return typed;
}

export async function getLastSessionForDay(
  userId: string,
  dayId: string
): Promise<SessionWithSets | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_sessions")
    .select(`*, session_sets (*)`)
    .eq("user_id", userId)
    .eq("day_id", dayId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const typed = data as unknown as SessionWithSets;
  typed.session_sets = typed.session_sets.sort(
    (a, b) => a.exercise_name.localeCompare(b.exercise_name) || a.set_number - b.set_number
  );
  return typed;
}

export async function upsertSet(
  sessionId: string,
  exerciseName: string,
  setNumber: number,
  weight: number,
  reps: number,
  rpe?: number | null
): Promise<SetRow> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("session_sets")
    .select("id")
    .eq("session_id", sessionId)
    .eq("exercise_name", exerciseName)
    .eq("set_number", setNumber)
    .maybeSingle();

  const rpeValue = rpe != null ? rpe : undefined;

  if (existing) {
    const { data, error } = await supabase
      .from("session_sets")
      .update({ weight, reps, ...(rpeValue !== undefined && { rpe: rpeValue }) })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as SetRow;
  } else {
    const { data, error } = await supabase
      .from("session_sets")
      .insert({
        session_id: sessionId,
        exercise_name: exerciseName,
        set_number: setNumber,
        weight,
        reps,
        ...(rpeValue !== undefined && { rpe: rpeValue }),
      })
      .select()
      .single();
    if (error) throw error;
    return data as SetRow;
  }
}

export async function deleteSet(setId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("session_sets")
    .delete()
    .eq("id", setId);
  if (error) throw error;
}

export async function deleteExerciseSets(
  sessionId: string,
  exerciseName: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("session_sets")
    .delete()
    .eq("session_id", sessionId)
    .eq("exercise_name", exerciseName);
  if (error) throw error;
}

export async function updateSessionNotes(sessionId: string, notes: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_sessions")
    .update({ notes })
    .eq("id", sessionId);
  if (error) throw error;
}

export async function completeSession(sessionId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
  if (error) throw error;
}
