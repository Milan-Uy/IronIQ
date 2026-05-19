import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressionCard } from "./progression-card";
import type { WeeklyVolume, MuscleVolume } from "@/lib/supabase/insights";

const VolumeChart = dynamic(() => import("./volume-chart").then((m) => m.VolumeChart), {
  ssr: false,
  loading: () => <div className="h-52 animate-pulse rounded-xl bg-muted" />,
});

const MuscleBalanceChart = dynamic(
  () => import("./muscle-balance-chart").then((m) => m.MuscleBalanceChart),
  {
    ssr: false,
    loading: () => <div className="h-52 animate-pulse rounded-xl bg-muted" />,
  },
);

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
      {/* Hero KPI cards — elevated, gradient-accented */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg border border-border/60 p-5 shadow-[var(--shadow-stripe-elevated)]"
          style={{ background: "var(--gradient-accent), var(--card)" }}
        >
          <div className="tnum tight-hero text-[36px] font-[300] leading-none text-foreground">
            {totalSessionsThisWeek}
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            Sessions this week
          </div>
        </div>
        <div
          className="rounded-lg border border-border/60 p-5 shadow-[var(--shadow-stripe-elevated)]"
          style={{ background: "var(--gradient-accent), var(--card)" }}
        >
          <div className="tnum tight-hero text-[36px] font-[300] leading-none text-foreground">
            {totalVolumeThisWeek >= 1000
              ? `${(totalVolumeThisWeek / 1000).toFixed(1)}k`
              : totalVolumeThisWeek}
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            Volume this week
          </div>
        </div>
      </div>

      {/* Charts wrapped in elevated Cards */}
      <Card className="shadow-[var(--shadow-stripe-standard)]">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="tight-display text-sm font-[400]">Weekly Volume</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <VolumeChart data={weeklyVolume} />
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-stripe-standard)]">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="tight-display text-sm font-[400]">Muscle Group Balance</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <MuscleBalanceChart data={muscleBalance} />
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-stripe-standard)]">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="tight-display text-sm font-[400]">Exercise Progression</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ProgressionCard exerciseNames={exerciseNames} />
        </CardContent>
      </Card>
    </div>
  );
}
