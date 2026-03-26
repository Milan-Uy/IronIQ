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
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/program" className="text-primary">
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
                setName(program.name);
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
            {program.name}
          </h1>
        )}
      </div>

      {/* Badges + Actions */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="bg-secondary text-secondary-foreground text-[13px] px-2 py-0.5 rounded-md">
          {SPLIT_LABELS[program.split_type] ?? program.split_type}
        </span>
        <span className="bg-secondary text-secondary-foreground text-[13px] px-2 py-0.5 rounded-md">
          {program.days_per_week} days/wk
        </span>

        {program.is_active ? (
          <Badge variant="default" className="bg-green-600 text-[11px]">
            <Check className="h-3 w-3 mr-1" /> Active Program
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="text-[11px] h-6"
            onClick={handleSetActive}
            disabled={isPending}
          >
            Set Active
          </Button>
        )}

        <div className="ml-auto">
          <Dialog>
            <DialogTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 p-0 text-destructive hover:bg-accent/50 transition-colors">
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
      </div>

      {/* Day List */}
      <div className="space-y-2 mb-4">
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
        <div className="rounded-lg border border-dashed border-primary/50 p-4 space-y-3">
          <Input
            placeholder="Day name (e.g. Push, Upper A)"
            value={newDayName}
            onChange={(e) => setNewDayName(e.target.value)}
            autoFocus
          />
          <div>
            <p className="text-[12px] text-muted-foreground mb-2">Target muscles:</p>
            <div className="flex gap-1.5 flex-wrap">
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
          className="w-full rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Day
        </button>
      )}
    </div>
  );
}
