"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DayCard } from "@/components/workout/day-card";
import { MuscleGroupBadge } from "@/components/workout/muscle-group-badge";
import {
  updateProgram,
  deleteProgram,
  setActiveProgram,
  createDay,
} from "@/app/(app)/program/actions";
import { toast } from "sonner";
import type { ProgramWithDays } from "@/lib/supabase/programs";

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push/Pull/Legs",
  upper_lower: "Upper/Lower",
  full_body: "Full Body",
};

const ALL_MUSCLES = [
  "chest", "back", "shoulders", "biceps", "triceps",
  "quads", "hamstrings", "glutes", "calves", "core",
];

export function ProgramDetailClient({ program }: { program: ProgramWithDays }) {
  const [isPending, startTransition] = useTransition();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(program.name);
  const [addingDay, setAddingDay] = useState(false);
  const [newDayName, setNewDayName] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

  function handleSaveName() {
    if (!name.trim() || name === program.name) {
      setEditingName(false);
      setName(program.name);
      return;
    }
    startTransition(async () => {
      const result = await updateProgram(program.id, { name: name.trim() });
      if (result?.error) {
        toast.error(result.error);
        setName(program.name);
      } else {
        toast.success("Program renamed");
      }
      setEditingName(false);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProgram(program.id);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  function handleSetActive() {
    startTransition(async () => {
      const result = await setActiveProgram(program.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Program set as active");
      }
    });
  }

  function handleCreateDay() {
    if (!newDayName.trim()) return;
    startTransition(async () => {
      const result = await createDay(program.id, newDayName.trim(), selectedMuscles);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Day added");
        setNewDayName("");
        setSelectedMuscles([]);
        setAddingDay(false);
      }
    });
  }

  function toggleMuscle(muscle: string) {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-4 pb-2 pt-6">
        <div className="mx-auto max-w-lg">
          <Link
            href="/program"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Programs
          </Link>
          <div className="mt-2 flex items-start justify-between gap-3">
            {editingName ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") {
                    setName(program.name);
                    setEditingName(false);
                  }
                }}
                className="tight-display h-auto rounded-none border-0 border-b border-primary px-0 py-0 text-2xl font-[400] focus-visible:ring-0"
                autoFocus
              />
            ) : (
              <h1
                className="tight-display cursor-pointer text-2xl font-[400] text-foreground transition-colors hover:text-primary"
                onClick={() => setEditingName(true)}
              >
                {program.name}
              </h1>
            )}
            <Dialog>
              <DialogTrigger className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Program</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete &quot;{program.name}&quot;? This will also delete all days and exercises. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                    {isPending ? "Deleting..." : "Delete Program"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Meta strip */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[12px] text-secondary-foreground">
              {SPLIT_LABELS[program.split_type] ?? program.split_type}
            </span>
            <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[12px] text-secondary-foreground">
              {program.days_per_week} days/wk
            </span>
            {program.is_active ? (
              <Badge
                variant="default"
                className="bg-primary/15 text-[10px] font-medium uppercase tracking-widest text-primary"
              >
                <Check className="mr-1 h-3 w-3" /> Active
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-6 border-border/60 text-[11px]"
                onClick={handleSetActive}
                disabled={isPending}
              >
                Set Active
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Section label */}
        <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Training Days
        </div>

        {/* Day List */}
        <div className="mb-3 space-y-2.5">
          {program.workout_days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              programId={program.id}
              exerciseCount={day.workout_exercises.length}
            />
          ))}
        </div>

        {/* Add Day */}
        {addingDay ? (
          <div className="space-y-3 rounded-lg border border-primary/40 bg-card p-4 shadow-[var(--shadow-stripe-elevated)]">
            <Input
              placeholder="Day name (e.g. Push, Upper A)"
              value={newDayName}
              onChange={(e) => setNewDayName(e.target.value)}
              autoFocus
            />
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Target muscles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_MUSCLES.map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => toggleMuscle(muscle)}
                    className="transition-opacity"
                  >
                    <MuscleGroupBadge
                      muscle={muscle}
                      className={`cursor-pointer ${
                        selectedMuscles.includes(muscle) ? "ring-1 ring-primary" : "opacity-40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateDay}
                disabled={isPending || !newDayName.trim()}
                className="flex-1"
              >
                {isPending ? "Adding..." : "Add Day"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAddingDay(false);
                  setNewDayName("");
                  setSelectedMuscles([]);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingDay(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-card/30 p-4 text-sm text-muted-foreground transition-all hover:border-primary/60 hover:bg-card/60 hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add Day
          </button>
        )}
      </div>
    </div>
  );
}
