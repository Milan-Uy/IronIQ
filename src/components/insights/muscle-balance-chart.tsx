"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MuscleVolume {
  muscleGroup: string;
  sets: number;
}

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
  borderRadius: 6,
  fontSize: 12,
  boxShadow: "var(--shadow-stripe-elevated)",
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
        <defs>
          <linearGradient id="muscleFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "var(--chart-2)", stopOpacity: 0.75 }} />
          </linearGradient>
        </defs>
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="muscleGroup"
          tick={{ fontSize: 11, fill: "var(--foreground)" }}
          axisLine={false}
          tickLine={false}
          width={80}
          tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${value} sets`, "Volume"]}
          cursor={{ fill: "var(--muted)", fillOpacity: 0.35 }}
        />
        <Bar dataKey="sets" fill="url(#muscleFill)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
