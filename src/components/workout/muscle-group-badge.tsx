import { cn } from "@/lib/utils";
import type { MuscleGroup } from "@/lib/exercises";

const MUSCLE_GROUP_COLORS: Record<MuscleGroup, { soft: string; ink: string; dot: string }> = {
  chest:      { soft: "var(--mg-chest-soft)",      ink: "var(--mg-chest-ink)",      dot: "var(--mg-chest)" },
  back:       { soft: "var(--mg-back-soft)",        ink: "var(--mg-back-ink)",        dot: "var(--mg-back)" },
  shoulders:  { soft: "var(--mg-shoulders-soft)",   ink: "var(--mg-shoulders-ink)",   dot: "var(--mg-shoulders)" },
  biceps:     { soft: "var(--mg-biceps-soft)",      ink: "var(--mg-biceps-ink)",      dot: "var(--mg-biceps)" },
  triceps:    { soft: "var(--mg-triceps-soft)",     ink: "var(--mg-triceps-ink)",     dot: "var(--mg-triceps)" },
  quads:      { soft: "var(--mg-quads-soft)",       ink: "var(--mg-quads-ink)",       dot: "var(--mg-quads)" },
  hamstrings: { soft: "var(--mg-hamstrings-soft)",  ink: "var(--mg-hamstrings-ink)",  dot: "var(--mg-hamstrings)" },
  glutes:     { soft: "var(--mg-glutes-soft)",      ink: "var(--mg-glutes-ink)",      dot: "var(--mg-glutes)" },
  calves:     { soft: "var(--mg-calves-soft)",      ink: "var(--mg-calves-ink)",      dot: "var(--mg-calves)" },
  core:       { soft: "var(--mg-core-soft)",        ink: "var(--mg-core-ink)",        dot: "var(--mg-core)" },
};

const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  core: "Core",
};

export function MuscleGroupBadge({
  muscle,
  className,
}: {
  muscle: string;
  className?: string;
}) {
  const key = muscle.toLowerCase() as MuscleGroup;
  const colors = MUSCLE_GROUP_COLORS[key] ?? {
    soft: "var(--muted)",
    ink: "var(--muted-foreground)",
    dot: "var(--muted-foreground)",
  };
  const label = MUSCLE_GROUP_LABELS[key] ?? muscle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        className
      )}
      style={{ background: colors.soft, color: colors.ink }}
    >
      <span
        className="inline-block shrink-0 rounded-full"
        style={{ width: 5, height: 5, background: colors.dot }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
