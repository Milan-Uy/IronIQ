"use client";

import { useState, useTransition } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProgressionData } from "@/app/(app)/insights/actions";

interface ExerciseProgression {
  sessionDate: string;
  maxWeight: number;
  totalVolume: number;
}

export function ProgressionCard({ exerciseNames }: { exerciseNames: string[] }) {
  const [selected, setSelected] = useState(exerciseNames[0] ?? "");
  const [data, setData] = useState<ExerciseProgression[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSelect(name: string | null) {
    if (!name) return;
    setSelected(name);
    startTransition(async () => {
      const result = await fetchProgressionData(name);
      setData(result);
    });
  }

  if (exerciseNames.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Complete workouts to track progression.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Select value={selected} onValueChange={handleSelect}>
        <SelectTrigger className="h-9 w-full">
          <SelectValue placeholder="Pick an exercise" />
        </SelectTrigger>
        <SelectContent>
          {exerciseNames.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {selected ? "Select an exercise above" : "No data for this exercise"}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="progressionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="sessionDate"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--primary) / 0.3)",
                borderRadius: 6,
                fontSize: 12,
                boxShadow: "var(--shadow-stripe-elevated)",
              }}
              formatter={(value) => [`${value} lbs`, "Max Weight"]}
            />
            <Area
              type="monotone"
              dataKey="maxWeight"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#progressionFill)"
              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
