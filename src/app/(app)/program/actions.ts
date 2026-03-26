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
