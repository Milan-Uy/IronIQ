"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MuscleGroupBadge } from "@/components/workout/muscle-group-badge";
import { fetchMoreSessions } from "@/app/(app)/insights/actions";
import type { CompletedSession } from "@/lib/supabase/insights";
import type { MuscleGroup } from "@/lib/exercises";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function SessionHistoryList({
  initialSessions,
}: {
  initialSessions: CompletedSession[];
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [hasMore, setHasMore] = useState(initialSessions.length === 20);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const more = await fetchMoreSessions(sessions.length);
      setSessions((prev) => [...prev, ...more]);
      if (more.length < 20) setHasMore(false);
    });
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <Dumbbell className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Complete your first workout to see history here.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div>
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={`/insights/session/${session.id}`}
            className="group flex items-center justify-between border-b border-border/40 px-4 py-4 hover:bg-muted/20 active:bg-muted/30"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{session.day_name}</span>
              </div>
              <div className="tnum mt-0.5 text-xs text-muted-foreground">
                {formatDate(session.completed_at)} · {formatDuration(session.duration_minutes)} · {session.set_count} sets
              </div>
              {session.target_muscles.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {session.target_muscles.slice(0, 3).map((m) => (
                    <MuscleGroupBadge key={m} muscle={m as MuscleGroup} />
                  ))}
                </div>
              )}
            </div>
            <div className="ml-3 flex items-center gap-2">
              <div className="text-right">
                <div className="tnum text-sm font-medium">
                  {session.total_volume >= 1000
                    ? `${(session.total_volume / 1000).toFixed(1)}k`
                    : session.total_volume}
                </div>
                <div className="text-xs text-muted-foreground">vol</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
          </Link>
        ))}
      </div>
      {hasMore && (
        <div className="px-4 pt-4">
          <Button
            variant="ghost"
            className="w-full text-primary hover:text-primary"
            onClick={handleLoadMore}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
