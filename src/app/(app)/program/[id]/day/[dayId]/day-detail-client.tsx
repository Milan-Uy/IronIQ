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
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/program/${program.id}`} className="text-primary">
          <ArrowLeft className="h-5 w-5" />
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
            className="text-xl font-bold h-auto py-0 border-0 border-b border-primary rounded-none px-0 focus-visible:ring-0"
            autoFocus
          />
        ) : (
          <h1
            className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
            onClick={() => setEditingName(true)}
          >
            {name}
          </h1>
        )}
      </div>

      {/* Program name breadcrumb + muscle badges */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm text-muted-foreground">{program.name}</span>
        {targetMuscles.length > 0 && (
          <>
            <span className="text-muted-foreground">·</span>
            {targetMuscles.map((muscle) => (
              <MuscleGroupBadge key={muscle} muscle={muscle} />
            ))}
          </>
        )}
      </div>

      {/* Exercise List */}
      <div className="space-y-2 mb-4">
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
          <p className="text-center text-muted-foreground text-sm py-6">
            No exercises yet. Add your first exercise below.
          </p>
        )}
      </div>

      {/* Add Exercise */}
      <ExercisePicker onSelect={handleAddExercise} />
    </div>
  );
}
