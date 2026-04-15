import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionWithSets, getLastSessionForDay } from "@/lib/supabase/sessions";
import { SessionClient } from "./session-client";
import type { Database } from "@/types/database";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let session;
  try {
    session = await getSessionWithSets(sessionId);
  } catch {
    notFound();
  }

  if (session.status === "completed") {
    notFound();
  }

  // Fetch day data, profile (for weight unit), and last session in parallel
  const [dayResult, profileResult, lastSession] = await Promise.all([
    supabase
      .from("workout_days")
      .select(`*, workout_exercises (*)`)
      .eq("id", session.day_id)
      .single(),
    supabase
      .from("profiles")
      .select("weight_unit")
      .eq("id", user.id)
      .single(),
    getLastSessionForDay(user.id, session.day_id),
  ]);

  if (!dayResult.data) notFound();

  type DayRow = Database["public"]["Tables"]["workout_days"]["Row"];
  type ExerciseRow = Database["public"]["Tables"]["workout_exercises"]["Row"];
  const day = dayResult.data as unknown as DayRow & { workout_exercises: ExerciseRow[] };

  const exercises = day.workout_exercises.sort(
    (a, b) => a.exercise_order - b.exercise_order
  );

  const weightUnit = profileResult.data?.weight_unit ?? "lbs";

  return (
    <div className="track-surface">
      <SessionClient
        session={session}
        dayName={day.name}
        plannedExercises={exercises}
        previousSets={lastSession?.session_sets ?? []}
        weightUnit={weightUnit}
      />
    </div>
  );
}
