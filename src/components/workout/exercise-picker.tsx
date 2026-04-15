"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { searchExercises, type MuscleGroup } from "@/lib/exercises";

const MUSCLE_FILTERS: { value: MuscleGroup | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "quads", label: "Quads" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "glutes", label: "Glutes" },
  { value: "calves", label: "Calves" },
  { value: "core", label: "Core" },
];

export function ExercisePicker({
  onSelect,
  label = "+ Add Exercise",
}: {
  onSelect: (name: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MuscleGroup | "all">("all");
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");

  const results = searchExercises(query, filter === "all" ? undefined : filter);

  function handleSelect(name: string) {
    onSelect(name);
    setOpen(false);
    setQuery("");
    setFilter("all");
    setCustomMode(false);
    setCustomName("");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-card/30 p-4 text-sm text-muted-foreground transition-all hover:border-primary/60 hover:bg-card/60 hover:text-primary">
        {label}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Add Exercise</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {MUSCLE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[50vh] space-y-1">
            {results.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleSelect(exercise.name)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="text-left">
                  <div className="text-sm">{exercise.name}</div>
                  <div className="text-[11px] text-muted-foreground capitalize">
                    {exercise.muscleGroup} · {exercise.equipment}
                  </div>
                </div>
                <span className="text-primary text-lg">+</span>
              </button>
            ))}
            {results.length === 0 && !customMode && (
              <p className="text-center text-muted-foreground text-sm py-4">
                No exercises found
              </p>
            )}
          </div>

          <div className="border-t border-border pt-3">
            {customMode ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Exercise name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customName.trim()) {
                      handleSelect(customName.trim());
                    }
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (customName.trim()) handleSelect(customName.trim());
                  }}
                  disabled={!customName.trim()}
                >
                  Add
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setCustomMode(true)}
                className="w-full text-center text-primary text-sm py-1"
              >
                + Add custom exercise
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
