"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProgram } from "@/app/(app)/program/actions";

const SPLIT_OPTIONS = [
  { value: "ppl", label: "Push / Pull / Legs" },
  { value: "upper_lower", label: "Upper / Lower" },
  { value: "full_body", label: "Full Body" },
];

const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function NewProgramPage() {
  const [state, formAction, isPending] = useActionState(createProgram, null);

  return (
    <div className="pb-20">
      <div className="px-4 pb-2 pt-6">
        <div className="mx-auto max-w-lg">
          <Link
            href="/program"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Programs
          </Link>
          <h1 className="tight-display mt-2 text-2xl font-[400] text-foreground">New Program</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up the shell — you can add days and exercises after
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        <form
          action={formAction}
          className="space-y-6 rounded-lg border border-border/60 bg-card p-5 shadow-[var(--shadow-stripe-standard)]"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Program Name</Label>
            <Input id="name" name="name" placeholder="My Workout Program" required />
          </div>

          <div className="space-y-2">
            <Label>Split Type</Label>
            <Select name="splitType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a split" />
              </SelectTrigger>
              <SelectContent>
                {SPLIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Days per Week</Label>
            <Select name="daysPerWeek" required>
              <SelectTrigger>
                <SelectValue placeholder="How many days?" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OPTIONS.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d} {d === 1 ? "day" : "days"} / week
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create Program"}
          </Button>
        </form>
      </div>
    </div>
  );
}
