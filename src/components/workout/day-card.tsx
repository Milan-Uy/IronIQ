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
    <Link href={`/program/${programId}/day/${day.id}`}>
      <div className="rounded-lg border border-border p-3 transition-colors hover:bg-accent/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">
              Day {day.day_order} — {day.name}
            </div>
            <div className="flex gap-1 mt-1 flex-wrap">
              {day.target_muscles.map((m) => (
                <MuscleGroupBadge key={m} muscle={m} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <span>{exerciseCount} exercises</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
