"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewSection } from "@/components/insights/overview-section";
import { SessionHistoryList } from "@/components/insights/session-history-list";
import type { CompletedSession, WeeklyVolume, MuscleVolume } from "@/lib/supabase/insights";

interface InsightsClientProps {
  sessions: CompletedSession[];
  weeklyVolume: WeeklyVolume[];
  muscleBalance: MuscleVolume[];
  exerciseNames: string[];
  totalSessionsThisWeek: number;
  totalVolumeThisWeek: number;
}

export function InsightsClient({
  sessions,
  weeklyVolume,
  muscleBalance,
  exerciseNames,
  totalSessionsThisWeek,
  totalVolumeThisWeek,
}: InsightsClientProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="sticky top-0 z-10 w-full rounded-none border-b border-border bg-background">
        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
        <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-0">
        <OverviewSection
          weeklyVolume={weeklyVolume}
          muscleBalance={muscleBalance}
          exerciseNames={exerciseNames}
          totalSessionsThisWeek={totalSessionsThisWeek}
          totalVolumeThisWeek={totalVolumeThisWeek}
        />
      </TabsContent>
      <TabsContent value="history" className="mt-0">
        <SessionHistoryList initialSessions={sessions} />
      </TabsContent>
    </Tabs>
  );
}
