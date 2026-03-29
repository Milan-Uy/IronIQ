import { createClient } from "@/lib/supabase/server";
import {
  getCompletedSessions,
  getVolumeByWeek,
  getVolumeByMuscleGroup,
  getRecentExerciseNames,
} from "@/lib/supabase/insights";
import { InsightsClient } from "./insights-client";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [sessions, weeklyVolume, muscleBalance, exerciseNames] = await Promise.all([
    getCompletedSessions(user.id, 20, 0),
    getVolumeByWeek(user.id, 8),
    getVolumeByMuscleGroup(user.id, 30),
    getRecentExerciseNames(user.id),
  ]);

  // Compute this week's stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter(
    (s) => new Date(s.completed_at) >= weekStart
  );
  const totalSessionsThisWeek = thisWeekSessions.length;
  const totalVolumeThisWeek = thisWeekSessions.reduce((acc, s) => acc + s.total_volume, 0);

  return (
    <div className="pb-20">
      <InsightsClient
        sessions={sessions}
        weeklyVolume={weeklyVolume}
        muscleBalance={muscleBalance}
        exerciseNames={exerciseNames}
        totalSessionsThisWeek={totalSessionsThisWeek}
        totalVolumeThisWeek={totalVolumeThisWeek}
      />
    </div>
  );
}
