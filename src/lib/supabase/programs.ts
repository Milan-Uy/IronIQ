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
  return data as Program[];
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
  const typed = data as unknown as ProgramWithDays;
  typed.workout_days = typed.workout_days
    .sort((a, b) => a.day_order - b.day_order)
    .map((day) => ({
      ...day,
      workout_exercises: day.workout_exercises.sort(
        (a, b) => a.exercise_order - b.exercise_order
      ),
    }));
  return typed;
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

export async function getActiveProgram(userId: string): Promise<ProgramWithDays | null> {
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
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const typed = data as unknown as ProgramWithDays;
  typed.workout_days = typed.workout_days
    .sort((a, b) => a.day_order - b.day_order)
    .map((day) => ({
      ...day,
      workout_exercises: day.workout_exercises.sort(
        (a, b) => a.exercise_order - b.exercise_order
      ),
    }));
  return typed;
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
