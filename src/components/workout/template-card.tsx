"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { adoptTemplate } from "@/app/(app)/program/actions";
import { toast } from "sonner";
import type { WorkoutTemplate } from "@/lib/templates/types";

export function TemplateCard({ template }: { template: WorkoutTemplate }) {
  const [isPending, startTransition] = useTransition();

  function handleAdopt() {
    startTransition(async () => {
      const result = await adoptTemplate(template.key);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card p-5 shadow-[var(--shadow-stripe-standard)] transition-all hover:-translate-y-0.5 hover:border-border">
      <div className="mb-2 flex items-start justify-between gap-3">
        <span className="tight-display text-base font-[500] text-foreground">
          {template.name}
        </span>
        <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11px] text-secondary-foreground">
          {template.daysPerWeek} days
        </span>
      </div>
      <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">
        {template.description}
      </p>
      <div className="mb-4 text-[11px] uppercase tracking-widest text-muted-foreground/80">
        {template.days.map((d) => d.name).join(" · ")}
      </div>
      <Button
        className="w-full"
        size="sm"
        onClick={handleAdopt}
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Use Template"}
      </Button>
    </div>
  );
}
