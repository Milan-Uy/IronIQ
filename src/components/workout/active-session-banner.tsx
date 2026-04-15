"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";

export function ActiveSessionBanner({
  sessionId,
  dayName,
  startedAt,
}: {
  sessionId: string;
  dayName: string;
  startedAt: string;
}) {
  const [elapsedLabel, setElapsedLabel] = useState("");

  useEffect(() => {
    function update() {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 60000);
      setElapsedLabel(
        elapsed < 60
          ? `${elapsed}m ago`
          : `${Math.floor(elapsed / 60)}h ${elapsed % 60}m ago`
      );
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <Link href={`/track/session/${sessionId}`}>
      <div className="track-glow rounded-lg border border-[var(--sh-lavender)]/40 bg-[var(--sh-lavender)]/10 p-4 transition-opacity duration-150 hover:opacity-85">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-[var(--sh-lavender)]" />
            <div>
              <div className="font-semibold">Resume Workout</div>
              <div className="text-sm text-muted-foreground">
                {dayName} — started {elapsedLabel}
              </div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-[var(--sh-lavender)]" />
        </div>
      </div>
    </Link>
  );
}
