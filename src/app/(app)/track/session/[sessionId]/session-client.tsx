"use client";

import { useState } from "react";
import { SessionHeader } from "@/components/workout/session-header";
import { SessionExerciseCard } from "@/components/workout/session-exercise-card";
import { ExercisePicker } from "@/components/workout/exercise-picker";
import type { SessionWithSets } from "@/lib/supabase/sessions";
import type { Database } from "@/types/database";

type Exercise = Database["public"]["Tables"]["workout_exercises"]["Row"];
type SetRowData = Database["public"]["Tables"]["session_sets"]["Row"];

interface SessionExercise {
  exerciseName: string;
  targetSets: number;
}

export function SessionClient({
  session,
  dayName,
  plannedExercises,
  previousSets,
  weightUnit,
}: {
  session: SessionWithSets;
  dayName: string;
  plannedExercises: Exercise[];
  previousSets: SetRowData[];
  weightUnit?: string;
}) {
  // Build initial exercise list from planned exercises
  const initialExercises: SessionExercise[] = plannedExercises.map((ex) => ({
    exerciseName: ex.exercise_name,
    targetSets: ex.target_sets,
  }));

  // Also include any exercises logged in this session that aren't in the plan (added mid-session)
  const plannedNames = new Set(plannedExercises.map((ex) => ex.exercise_name));
  const addedExercises: SessionExercise[] = [];
  const addedNames = new Set<string>();
  for (const s of session.session_sets) {
    if (!plannedNames.has(s.exercise_name) && !addedNames.has(s.exercise_name)) {
      addedNames.add(s.exercise_name);
      const setsForExercise = session.session_sets.filter(
        (set) => set.exercise_name === s.exercise_name
      );
      addedExercises.push({
        exerciseName: s.exercise_name,
        targetSets: Math.max(3, setsForExercise.length),
      });
    }
  }

  const [exercises, setExercises] = useState<SessionExercise[]>([
    ...initialExercises,
    ...addedExercises,
  ]);

  function handleAddExercise(name: string) {
    if (exercises.some((ex) => ex.exerciseName === name)) return;
    setExercises((prev) => [...prev, { exerciseName: name, targetSets: 3 }]);
  }

  function handleRemoved(exerciseName: string) {
    setExercises((prev) => prev.filter((ex) => ex.exerciseName !== exerciseName));
  }

  return (
    <div className="pb-20">
      <SessionHeader
        sessionId={session.id}
        dayName={dayName}
        startedAt={session.started_at}
        initialNotes={session.notes}
      />
      <div className="space-y-4 px-4 pt-4">
        {exercises.map((ex) => (
          <SessionExerciseCard
            key={ex.exerciseName}
            sessionId={session.id}
            exerciseName={ex.exerciseName}
            targetSets={ex.targetSets}
            loggedSets={session.session_sets.filter(
              (s) => s.exercise_name === ex.exerciseName
            )}
            previousSets={previousSets.filter(
              (s) => s.exercise_name === ex.exerciseName
            )}
            weightUnit={weightUnit}
            onRemoved={handleRemoved}
          />
        ))}
        <ExercisePicker
          onSelect={handleAddExercise}
          label="+ Add Exercise"
        />
      </div>
    </div>
  );
}
