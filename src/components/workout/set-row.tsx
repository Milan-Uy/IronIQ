"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";
import { logSet } from "@/app/(app)/track/actions";
import { toast } from "sonner";

export function SetRow({
  sessionId,
  exerciseName,
  setNumber,
  savedWeight,
  savedReps,
  savedRpe,
  placeholderWeight,
  placeholderReps,
  weightUnit = "lbs",
}: {
  sessionId: string;
  exerciseName: string;
  setNumber: number;
  savedWeight: number | null;
  savedReps: number | null;
  savedRpe?: number | null;
  placeholderWeight: number | null;
  placeholderReps: number | null;
  weightUnit?: string;
}) {
  const [weight, setWeight] = useState(savedWeight != null ? String(savedWeight) : "");
  const [reps, setReps] = useState(savedReps != null ? String(savedReps) : "");
  const [rpe, setRpe] = useState(savedRpe != null ? String(savedRpe) : "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(savedWeight != null && savedReps != null);

  function handleBlur() {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (isNaN(w) || isNaN(r) || w < 0 || r <= 0) return;

    const rpeValue = rpe !== "" ? parseFloat(rpe) : null;

    startTransition(async () => {
      const result = await logSet(sessionId, exerciseName, setNumber, w, r, rpeValue);
      if (result?.error) {
        toast.error(result.error);
        setSaved(false);
      } else {
        setSaved(true);
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-center text-xs text-muted-foreground">
        {setNumber}
      </span>
      <Input
        type="number"
        inputMode="decimal"
        placeholder={placeholderWeight != null ? String(placeholderWeight) : weightUnit}
        value={weight}
        onChange={(e) => { setWeight(e.target.value); setSaved(false); }}
        onBlur={handleBlur}
        className="h-9 w-20 text-center"
      />
      <span className="text-xs text-muted-foreground">×</span>
      <Input
        type="number"
        inputMode="numeric"
        placeholder={placeholderReps != null ? String(placeholderReps) : "reps"}
        value={reps}
        onChange={(e) => { setReps(e.target.value); setSaved(false); }}
        onBlur={handleBlur}
        className="h-9 w-20 text-center"
      />
      <Input
        type="number"
        inputMode="decimal"
        placeholder="RPE"
        value={rpe}
        onChange={(e) => { setRpe(e.target.value); setSaved(false); }}
        onBlur={handleBlur}
        className="h-9 w-16 text-center"
        min={1}
        max={10}
        step={0.5}
      />
      <div className="w-5">
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {!isPending && saved && <Check className="h-4 w-4 text-green-500" />}
      </div>
    </div>
  );
}
