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
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/program" className="text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">New Program</h1>
      </div>

      <form action={formAction} className="space-y-6">
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
  );
}
