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
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--primary) / 0.3)",
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
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--chart-2))", stopOpacity: 0.75 }} />
          </linearGradient>
        </defs>
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="muscleGroup"
          tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
          axisLine={false}
          tickLine={false}
          width={80}
          tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${value} sets`, "Volume"]}
          cursor={{ fill: "hsl(var(--muted))" }}
        />
        <Bar dataKey="sets" fill="url(#muscleFill)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
