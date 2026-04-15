"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetRow } from "./set-row";
import { removeSessionExercise } from "@/app/(app)/track/actions";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type SetRowData = Database["public"]["Tables"]["session_sets"]["Row"];

export function SessionExerciseCard({
  sessionId,
  exerciseName,
  targetSets,
  loggedSets,
  previousSets,
  weightUnit,
  onRemoved,
}: {
  sessionId: string;
  exerciseName: string;
  targetSets: number;
  loggedSets: SetRowData[];
  previousSets: SetRowData[];
  weightUnit?: string;
  onRemoved: (exerciseName: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      const result = await removeSessionExercise(sessionId, exerciseName);
      if (result?.error) {
        toast.error(result.error);
      } else {
        onRemoved(exerciseName);
      }
    });
  }

  const setRows = Array.from({ length: targetSets }, (_, i) => {
    const setNumber = i + 1;
    const logged = loggedSets.find((s) => s.set_number === setNumber);
    const prev = previousSets.find((s) => s.set_number === setNumber);
    return {
      setNumber,
      savedWeight: logged?.weight ?? null,
      savedReps: logged?.reps ?? null,
      savedRpe: logged?.rpe ?? null,
      placeholderWeight: prev?.weight ?? null,
      placeholderReps: prev?.reps ?? null,
    };
  });

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="track-display text-base">{exerciseName}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:opacity-85"
          onClick={handleRemove}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="w-8 text-center">Set</span>
        <span className="w-20 text-center">Weight</span>
        <span></span>
        <span className="w-20 text-center">Reps</span>
        <span className="w-16 text-center">RPE</span>
        <span className="w-5"></span>
      </div>
      <div className="space-y-2">
        {setRows.map((row) => (
          <SetRow
            key={row.setNumber}
            sessionId={sessionId}
            exerciseName={exerciseName}
            setNumber={row.setNumber}
            savedWeight={row.savedWeight}
            savedReps={row.savedReps}
            savedRpe={row.savedRpe}
            placeholderWeight={row.placeholderWeight}
            placeholderReps={row.placeholderReps}
            weightUnit={weightUnit}
          />
        ))}
      </div>
    </div>
  );
}
