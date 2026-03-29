"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MuscleVolume {
  muscleGroup: string;
  sets: number;
}

const MUSCLE_COLORS: Record<string, string> = {
  chest: "#3b82f6",
  back: "#8b5cf6",
  shoulders: "#06b6d4",
  biceps: "#f59e0b",
  triceps: "#f97316",
  quads: "#10b981",
  hamstrings: "#14b8a6",
  glutes: "#ec4899",
  calves: "#84cc16",
  core: "#6366f1",
  other: "#6b7280",
};

export function MuscleBalanceChart({ data }: { data: MuscleVolume[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  const top = data.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        layout="vertical"
        data={top}
        margin={{ top: 4, right: 16, left: 12, bottom: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="muscleGroup"
          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
          axisLine={false}
          tickLine={false}
          width={80}
          tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value) => [`${value} sets`, "Volume"]}
          cursor={{ fill: "hsl(var(--muted))" }}
        />
        <Bar dataKey="sets" radius={[0, 4, 4, 0]}>
          {top.map((entry) => (
            <Cell
              key={entry.muscleGroup}
              fill={MUSCLE_COLORS[entry.muscleGroup] ?? MUSCLE_COLORS.other}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
