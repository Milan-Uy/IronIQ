"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateExerciseAction,
  deleteExerciseAction,
} from "@/app/(app)/program/actions";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type Exercise = Database["public"]["Tables"]["workout_exercises"]["Row"];

export function ExerciseRow({
  exercise,
  programId,
  dayId,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  exercise: Exercise;
  programId: string;
  dayId: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sets, setSets] = useState(String(exercise.target_sets));
  const [reps, setReps] = useState(exercise.target_reps);
  const [rest, setRest] = useState(String(exercise.rest_seconds ?? 90));

  function handleSave() {
    startTransition(async () => {
      const result = await updateExerciseAction(exercise.id, programId, dayId, {
        target_sets: parseInt(sets, 10),
        target_reps: reps,
        rest_seconds: parseInt(rest, 10),
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        setEditing(false);
        toast.success("Exercise updated");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteExerciseAction(exercise.id, programId, dayId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Exercise removed");
      }
    });
  }

  if (editing) {
    return (
      <div className="space-y-3 rounded-lg border border-primary/40 bg-card p-4 shadow-[var(--shadow-stripe-elevated)]">
        <div className="tight-display text-[15px] font-[500] text-foreground">
          {exercise.exercise_name}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] text-muted-foreground">Sets</label>
            <Input
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Reps</label>
            <Input
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground">Rest (s)</label>
            <Input
              value={rest}
              onChange={(e) => setRest(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isPending} className="flex-1">
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-stripe-standard)] transition-colors hover:border-border">
      <div className="min-w-0">
        <div className="tight-display truncate text-[15px] font-[500] text-foreground">
          {exercise.exercise_name}
        </div>
        <div className="mt-1 text-[12px] text-muted-foreground">
          <span className="tnum">{exercise.target_sets}</span>
          <span className="mx-1 opacity-60">×</span>
          <span className="tnum">{exercise.target_reps}</span>
          {exercise.rest_seconds ? (
            <>
              <span className="mx-1.5 opacity-40">·</span>
              <span className="tnum">{exercise.rest_seconds}s</span> rest
            </>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!isFirst && (
          <button onClick={onMoveUp} className="p-1 text-muted-foreground hover:text-foreground">
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        )}
        {!isLast && (
          <button onClick={onMoveDown} className="p-1 text-muted-foreground hover:text-foreground">
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-32 rounded-md border border-border bg-popover p-1 shadow-lg">
              <button
                onClick={() => { setEditing(true); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => { handleDelete(); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
