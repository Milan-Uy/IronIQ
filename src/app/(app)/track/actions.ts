"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import * as sessions from "@/lib/supabase/sessions";

async function getCurrentUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function startSession(dayId: string) {
  const userId = await getCurrentUserId();
  try {
    const sessionId = await sessions.createSession(userId, dayId);
    redirect(`/track/session/${sessionId}`);
  } catch (e) {
    if ((e as Error & { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: "Failed to start session" };
  }
}

export async function logSet(
  sessionId: string,
  exerciseName: string,
  setNumber: number,
  weight: number,
  reps: number,
  rpe?: number | null
) {
  try {
    await sessions.upsertSet(sessionId, exerciseName, setNumber, weight, reps, rpe);
    revalidatePath(`/track/session/${sessionId}`);
    return {};
  } catch {
    return { error: "Failed to save set" };
  }
}

export async function deleteSet(setId: string, sessionId: string) {
  try {
    await sessions.deleteSet(setId);
    revalidatePath(`/track/session/${sessionId}`);
    return {};
  } catch {
    return { error: "Failed to delete set" };
  }
}

export async function removeSessionExercise(
  sessionId: string,
  exerciseName: string
) {
  try {
    await sessions.deleteExerciseSets(sessionId, exerciseName);
    revalidatePath(`/track/session/${sessionId}`);
    return {};
  } catch {
    return { error: "Failed to remove exercise" };
  }
}

export async function updateSessionNotes(sessionId: string, notes: string) {
  try {
    await sessions.updateSessionNotes(sessionId, notes);
    return {};
  } catch {
    return { error: "Failed to save notes" };
  }
}

export async function finishSession(sessionId: string) {
  try {
    await sessions.completeSession(sessionId);
  } catch {
    return { error: "Failed to finish session" };
  }
  revalidatePath("/track");
  redirect("/track");
}
