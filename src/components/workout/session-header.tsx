"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Timer, StickyNote } from "lucide-react";
import { finishSession, updateSessionNotes } from "@/app/(app)/track/actions";
import { toast } from "sonner";
import Link from "next/link";

export function SessionHeader({
  sessionId,
  dayName,
  startedAt,
  initialNotes,
}: {
  sessionId: string;
  dayName: string;
  startedAt: string;
  initialNotes?: string | null;
}) {
  const [elapsed, setElapsed] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function update() {
      const diff = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setElapsed(
        h > 0
          ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${m}:${String(s).padStart(2, "0")}`
      );
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  function handleFinish() {
    startTransition(async () => {
      const result = await finishSession(sessionId);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  function handleNotesBlur() {
    startTransition(async () => {
      const result = await updateSessionNotes(sessionId, notes);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/track" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="font-semibold text-sm">{dayName}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer className="h-3 w-3" />
              {elapsed}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setShowNotes((v) => !v)}
            title="Session notes"
          >
            <StickyNote className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleFinish}
            disabled={isPending}
          >
            {isPending ? "Finishing..." : "Finish Workout"}
          </Button>
        </div>
      </div>
      {showNotes && (
        <Textarea
          className="mt-3 resize-none text-sm"
          placeholder="Session notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={2}
        />
      )}
    </div>
  );
}
