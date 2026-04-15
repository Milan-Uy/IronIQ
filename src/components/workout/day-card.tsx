import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MuscleGroupBadge } from "./muscle-group-badge";
import type { Database } from "@/types/database";

type Day = Database["public"]["Tables"]["workout_days"]["Row"];

export function DayCard({
  day,
  programId,
  exerciseCount,
}: {
  day: Day;
  programId: string;
  exerciseCount: number;
}) {
  return (
    <Link href={`/program/${programId}/day/${day.id}`} className="block">
      <div className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-stripe-standard)] transition-all hover:-translate-y-0.5 hover:border-border">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="tnum text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Day {day.day_order}
              </span>
              <span className="tight-display truncate text-[15px] font-[500] text-foreground">
                {day.name}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {day.target_muscles.map((m) => (
                <MuscleGroupBadge key={m} muscle={m} />
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
            <span className="tnum">{exerciseCount}</span>
            <span>ex</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
