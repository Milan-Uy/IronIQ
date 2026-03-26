import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database";

type Program = Database["public"]["Tables"]["workout_programs"]["Row"];

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push/Pull/Legs",
  upper_lower: "Upper/Lower",
  full_body: "Full Body",
};

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Link href={`/program/${program.id}`}>
      <div
        className={`rounded-xl border p-4 transition-colors hover:bg-accent/50 ${
          program.is_active ? "border-primary" : "border-border"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-[15px]">{program.name}</span>
          {program.is_active && (
            <Badge variant="default" className="text-[11px]">Active</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <span className="bg-secondary text-secondary-foreground text-[13px] px-2 py-0.5 rounded-md">
            {SPLIT_LABELS[program.split_type] ?? program.split_type}
          </span>
          <span className="bg-secondary text-secondary-foreground text-[13px] px-2 py-0.5 rounded-md">
            {program.days_per_week} days/wk
          </span>
        </div>
      </div>
    </Link>
  );
}
