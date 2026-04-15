import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getActiveProgram } from "@/lib/supabase/programs";
import { getActiveSession } from "@/lib/supabase/sessions";
import { DayPicker } from "@/components/workout/day-picker";
import { ActiveSessionBanner } from "@/components/workout/active-session-banner";

export default async function TrackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [activeSession, activeProgram] = await Promise.all([
    getActiveSession(user.id),
    getActiveProgram(user.id),
  ]);

  // In-progress session — show resume banner
  if (activeSession) {
    const { data: day } = await supabase
      .from("workout_days")
      .select("name")
      .eq("id", activeSession.day_id)
      .single();

    return (
      <div className="track-surface px-4 pt-6">
        <h1 className="mb-4 text-xl font-semibold">Track</h1>
        <ActiveSessionBanner
          sessionId={activeSession.id}
          dayName={day?.name ?? "Workout"}
          startedAt={activeSession.started_at}
        />
      </div>
    );
  }

  // No active program — empty state
  if (!activeProgram) {
    return (
      <div className="track-surface flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="rounded-full bg-muted p-4">
          <Dumbbell className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">No Active Program</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create or activate a program to start tracking workouts.
          </p>
        </div>
        <Link
          href="/program"
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Programs
        </Link>
      </div>
    );
  }

  // Active program — show day picker
  return (
    <div className="track-surface px-4 pt-6">
      <h1 className="mb-1 text-xl font-semibold">Track</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        {activeProgram.name} — pick a day to start
      </p>
      <DayPicker days={activeProgram.workout_days} />
    </div>
  );
}
