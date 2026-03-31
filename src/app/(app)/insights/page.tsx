import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  getCompletedSessions,
  getVolumeByWeek,
  getVolumeByMuscleGroup,
  getRecentExerciseNames,
} from "@/lib/supabase/insights";
import { InsightsClient } from "./insights-client";

async function getInsightsData(userId: string) {
  const [sessions, weeklyVolume, muscleBalance, exerciseNames] = await Promise.all([
    getCompletedSessions(userId, 20, 0),
    getVolumeByWeek(userId, 8),
    getVolumeByMuscleGroup(userId, 30),
    getRecentExerciseNames(userId),
  ]);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter(
    (s) => new Date(s.completed_at) >= weekStart
  );

  return {
    sessions,
    weeklyVolume,
    muscleBalance,
    exerciseNames,
    totalSessionsThisWeek: thisWeekSessions.length,
    totalVolumeThisWeek: thisWeekSessions.reduce((acc, s) => acc + s.total_volume, 0),
  };
}

async function InsightsContent({ userId }: { userId: string }) {
  const data = await getInsightsData(userId);
  return <InsightsClient {...data} />;
}

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <div className="pb-20">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg px-4 py-6 animate-pulse space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-xl bg-muted" />
              <div className="h-20 rounded-xl bg-muted" />
            </div>
            <div className="h-52 rounded-xl bg-muted" />
            <div className="h-52 rounded-xl bg-muted" />
          </div>
        }
      >
        <InsightsContent userId={user.id} />
      </Suspense>
    </div>
  );
}
