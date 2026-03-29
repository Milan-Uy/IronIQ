"use client";

import { useTransition } from "react";
import { Play } from "lucide-react";
import { MuscleGroupBadge } from "./muscle-group-badge";
import { startSession } from "@/app/(app)/track/actions";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type Day = Database["public"]["Tables"]["workout_days"]["Row"];
type Exercise = Database["public"]["Tables"]["workout_exercises"]["Row"];

export function DayPicker({
  days,
}: {
  days: (Day & { workout_exercises: Exercise[] })[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleStart(dayId: string) {
    startTransition(async () => {
      const result = await startSession(dayId);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-3">
      {days.map((day) => (
        <button
          key={day.id}
          onClick={() => handleStart(day.id)}
          disabled={isPending}
          className="w-full rounded-lg border border-border p-4 text-left transition-colors hover:bg-accent/50 disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">
                Day {day.day_order} — {day.name}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {day.workout_exercises.length} exercises
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {day.target_muscles.map((m) => (
                  <MuscleGroupBadge key={m} muscle={m} />
                ))}
              </div>
            </div>
            <Play className="h-5 w-5 text-primary" />
          </div>
        </button>
      ))}
    </div>
  );
}
