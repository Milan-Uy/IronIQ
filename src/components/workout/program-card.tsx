import Link from "next/link";
import type { Database } from "@/types/database";

type Program = Database["public"]["Tables"]["workout_programs"]["Row"];

const SPLIT_LABELS: Record<string, string> = {
  ppl: "Push/Pull/Legs",
  upper_lower: "Upper/Lower",
  full_body: "Full Body",
};

export function ProgramCard({ program }: { program: Program }) {
  const active = program.is_active;
  return (
    <Link href={`/program/${program.id}`} className="block">
      <div
        className={`rounded-lg border p-5 transition-all hover:-translate-y-0.5 ${
          active
            ? "border-primary/40 shadow-[var(--shadow-stripe-elevated)]"
            : "border-border/60 shadow-[var(--shadow-stripe-standard)] hover:border-border"
        }`}
        style={
          active
            ? { background: "var(--gradient-accent), var(--card)" }
            : { background: "var(--card)" }
        }
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="tight-display text-base font-[500] text-foreground">
            {program.name}
          </span>
          {active && (
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
              Active
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[12px] text-secondary-foreground">
            {SPLIT_LABELS[program.split_type] ?? program.split_type}
          </span>
          <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[12px] text-secondary-foreground">
            {program.days_per_week} days/wk
          </span>
        </div>
      </div>
    </Link>
  );
}
