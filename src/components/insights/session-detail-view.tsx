import Link from "next/link";
import { ArrowLeft, Clock, StickyNote } from "lucide-react";
import type { SessionDetail } from "@/lib/supabase/insights";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(startedAt: string, completedAt: string) {
  const mins = Math.round(
    (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 60000
  );
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

interface ExerciseGroup {
  name: string;
  sets: SessionDetail["sets"];
}

function groupByExercise(sets: SessionDetail["sets"]): ExerciseGroup[] {
  const map = new Map<string, SessionDetail["sets"]>();
  for (const s of sets) {
    if (!map.has(s.exercise_name)) map.set(s.exercise_name, []);
    map.get(s.exercise_name)!.push(s);
  }
  return Array.from(map.entries()).map(([name, sets]) => ({ name, sets }));
}

export function SessionDetailView({ session }: { session: SessionDetail }) {
  const exerciseGroups = groupByExercise(session.sets);
  const totalVolume = session.sets.reduce(
    (acc, s) => acc + (s.reps ?? 0) * (s.weight ?? 0),
    0
  );

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/insights" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="font-semibold text-sm">{session.day_name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(session.started_at, session.completed_at)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-4 pt-4">
        <div className="text-sm text-muted-foreground">
          {formatDateTime(session.completed_at)}
        </div>
        <div className="flex gap-4 text-sm">
          <span><span className="font-medium">{session.sets.length}</span> <span className="text-muted-foreground">sets</span></span>
          <span><span className="font-medium">{Math.round(totalVolume).toLocaleString()}</span> <span className="text-muted-foreground">total vol</span></span>
        </div>
        {session.notes && (
          <div className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
            <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{session.notes}</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4 px-4">
        {exerciseGroups.map((group) => {
          const groupVolume = group.sets.reduce(
            (acc, s) => acc + (s.reps ?? 0) * (s.weight ?? 0),
            0
          );
          return (
            <div key={group.name} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm">{group.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {Math.round(groupVolume).toLocaleString()} vol
                </span>
              </div>
              <div className="mb-2 flex gap-3 text-xs text-muted-foreground">
                <span className="w-8 text-center">Set</span>
                <span className="w-16 text-center">Weight</span>
                <span className="w-12 text-center">Reps</span>
                <span className="w-12 text-center">RPE</span>
              </div>
              <div className="space-y-1.5">
                {group.sets.map((s) => (
                  <div key={s.id} className="flex gap-3 text-sm">
                    <span className="w-8 text-center text-muted-foreground">{s.set_number}</span>
                    <span className="w-16 text-center">{s.weight ?? "—"}</span>
                    <span className="w-12 text-center">{s.reps ?? "—"}</span>
                    <span className="w-12 text-center text-muted-foreground">{s.rpe ?? "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
