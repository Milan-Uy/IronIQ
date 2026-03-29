import { VolumeChart } from "./volume-chart";
import { MuscleBalanceChart } from "./muscle-balance-chart";
import { ProgressionCard } from "./progression-card";
import type { WeeklyVolume, MuscleVolume } from "@/lib/supabase/insights";

interface OverviewSectionProps {
  weeklyVolume: WeeklyVolume[];
  muscleBalance: MuscleVolume[];
  exerciseNames: string[];
  totalSessionsThisWeek: number;
  totalVolumeThisWeek: number;
}

export function OverviewSection({
  weeklyVolume,
  muscleBalance,
  exerciseNames,
  totalSessionsThisWeek,
  totalVolumeThisWeek,
}: OverviewSectionProps) {
  return (
    <div className="space-y-6 px-4 pb-6 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-3">
          <div className="text-2xl font-bold">{totalSessionsThisWeek}</div>
          <div className="text-xs text-muted-foreground">Sessions this week</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-2xl font-bold">
            {totalVolumeThisWeek >= 1000
              ? `${(totalVolumeThisWeek / 1000).toFixed(1)}k`
              : totalVolumeThisWeek}
          </div>
          <div className="text-xs text-muted-foreground">Volume this week</div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Weekly Volume</h3>
        <VolumeChart data={weeklyVolume} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Muscle Group Balance (30 days)</h3>
        <MuscleBalanceChart data={muscleBalance} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Exercise Progression</h3>
        <ProgressionCard exerciseNames={exerciseNames} />
      </div>
    </div>
  );
}
