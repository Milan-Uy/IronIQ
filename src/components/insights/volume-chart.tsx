"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyVolume {
  week: string;
  volume: number;
}

const tooltipStyle = {
  backgroundColor: "var(--chart-tooltip-bg)",
  border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
  borderRadius: 6,
  fontSize: 12,
  boxShadow: "var(--shadow-stripe-elevated)",
};

export function VolumeChart({ data }: { data: WeeklyVolume[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: "var(--primary)", stopOpacity: 0.5 }} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="week"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${Number(value).toLocaleString()} lbs`, "Volume"]}
          cursor={{ fill: "var(--muted)", fillOpacity: 0.35 }}
        />
        <Bar dataKey="volume" fill="url(#volumeFill)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
