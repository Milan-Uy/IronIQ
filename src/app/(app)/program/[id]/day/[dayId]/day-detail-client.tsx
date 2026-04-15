"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExerciseRow } from "@/components/workout/exercise-row";
import { ExercisePicker } from "@/components/workout/exercise-picker";
import { MuscleGroupBadge } from "@/components/workout/muscle-group-badge";
import {
  updateDay,
  addExerciseAction,
  reorderExercisesAction,
} from "@/app/(app)/program/actions";
import { toast } from "sonner";
import type { ProgramWithDays } from "@/lib/supabase/programs";
import type { Database } from "@/types/database";

type Day = Database["public"]["Tables"]["workout_days"]["Row"] & {
  workout_exercises: Database["public"]["Tables"]["workout_exercises"]["Row"][];
};

export function DayDetailClient({
  program,
  day,
}: {
  program: ProgramWithDays;
  day: Day;
}) {
  const [isPending, startTransition] = useTransition();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(day.name);

  function handleSaveName() {
    if (!name.trim() || name === day.name) {
      setEditingName(false);
      setName(day.name);
      return;
    }
    startTransition(async () => {
      const result = await updateDay(day.id, program.id, { name: name.trim() });
      if (result?.error) {
        toast.error(result.error);
        setName(day.name);
      } else {
        toast.success("Day renamed");
      }
      setEditingName(false);
    });
  }

  function handleAddExercise(exerciseName: string) {
    startTransition(async () => {
      const result = await addExerciseAction(day.id, program.id, exerciseName, 3, "8-12", 90);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Exercise added");
      }
    });
  }

  function handleMoveUp(index: number) {
    const exercises = day.workout_exercises;
    if (index === 0) return;
    const newOrder = [...exercises];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    startTransition(async () => {
      const result = await reorderExercisesAction(day.id, program.id, newOrder.map((e) => e.id));
      if (result?.error) toast.error(result.error);
    });
  }

  function handleMoveDown(index: number) {
    const exercises = day.workout_exercises;
    if (index === exercises.length - 1) return;
    const newOrder = [...exercises];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    startTransition(async () => {
      const result = await reorderExercisesAction(day.id, program.id, newOrder.map((e) => e.id));
      if (result?.error) toast.error(result.error);
    });
  }

  const targetMuscles: string[] = Array.isArray(day.target_muscles) ? day.target_muscles : [];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pb-2 pt-6">
        <div className="mx-auto max-w-lg">
          <Link
            href={`/program/${program.id}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> {program.name}
          </Link>
          {editingName ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") {
                  setName(day.name);
                  setEditingName(false);
                }
              }}
              className="tight-display mt-2 h-auto rounded-none border-0 border-b border-primary px-0 py-0 text-2xl font-[400] focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <h1
              className="tight-display mt-2 cursor-pointer text-2xl font-[400] text-foreground transition-colors hover:text-primary"
              onClick={() => setEditingName(true)}
            >
              {name}
            </h1>
          )}
          {targetMuscles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {targetMuscles.map((muscle) => (
                <MuscleGroupBadge key={muscle} muscle={muscle} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Section label */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Exercises
          </span>
          {day.workout_exercises.length > 0 && (
            <span className="tnum text-[11px] text-muted-foreground">
              {day.workout_exercises.length} total
            </span>
          )}
        </div>

        {/* Exercise List */}
        <div className="mb-4 space-y-2.5">
          {day.workout_exercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              programId={program.id}
              dayId={day.id}
              isFirst={index === 0}
              isLast={index === day.workout_exercises.length - 1}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
            />
          ))}
          {day.workout_exercises.length === 0 && (
            <div
              className="rounded-lg border border-border/60 p-6 text-center shadow-[var(--shadow-stripe-standard)]"
              style={{ background: "var(--gradient-accent), var(--card)" }}
            >
              <p className="text-sm text-muted-foreground">
                No exercises yet. Add your first below.
              </p>
            </div>
          )}
        </div>

        {/* Add Exercise */}
        <ExercisePicker onSelect={handleAddExercise} />
      </div>
    </div>
  );
}
