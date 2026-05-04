import { cn } from "@/lib/utils";
import type { MuscleGroup } from "@/lib/exercises";

const MUSCLE_GROUP_COLORS: Record<MuscleGroup, { bg: string; text: string; dot: string }> = {
  chest:      { bg: "bg-red-400/15",    text: "text-red-400",    dot: "var(--mg-chest)" },
  back:       { bg: "bg-indigo-400/15", text: "text-indigo-400", dot: "var(--mg-back)" },
  shoulders:  { bg: "bg-amber-400/15",  text: "text-amber-400",  dot: "var(--mg-shoulders)" },
  biceps:     { bg: "bg-fuchsia-400/15",text: "text-fuchsia-400",dot: "var(--mg-biceps)" },
  triceps:    { bg: "bg-cyan-400/15",   text: "text-cyan-400",   dot: "var(--mg-triceps)" },
  quads:      { bg: "bg-green-400/15",  text: "text-green-400",  dot: "var(--mg-quads)" },
  hamstrings: { bg: "bg-orange-400/15", text: "text-orange-400", dot: "var(--mg-hamstrings)" },
  glutes:     { bg: "bg-rose-400/15",   text: "text-rose-400",   dot: "var(--mg-glutes)" },
  calves:     { bg: "bg-teal-400/15",   text: "text-teal-400",   dot: "var(--mg-calves)" },
  core:       { bg: "bg-yellow-300/15", text: "text-yellow-300", dot: "var(--mg-core)" },
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
  const colors = MUSCLE_GROUP_COLORS[key] ?? { bg: "bg-muted", text: "text-muted-foreground", dot: "var(--muted-foreground)" };
  const label = MUSCLE_GROUP_LABELS[key] ?? muscle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        colors.bg,
        colors.text,
        className
      )}
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
