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
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[15px]">{template.name}</span>
        <span className="bg-secondary text-secondary-foreground text-[11px] px-2 py-0.5 rounded-md">
          {template.daysPerWeek} days
        </span>
      </div>
      <p className="text-muted-foreground text-[12px] mb-3">{template.description}</p>
      <div className="text-muted-foreground text-[11px] mb-3">
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
