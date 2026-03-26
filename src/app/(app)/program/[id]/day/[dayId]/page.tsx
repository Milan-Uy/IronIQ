import { notFound } from "next/navigation";
import { getProgram } from "@/lib/supabase/programs";
import { DayDetailClient } from "./day-detail-client";

export default async function DayDetailPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const { id, dayId } = await params;

  try {
    const program = await getProgram(id);
    const day = program.workout_days.find((d) => d.id === dayId);
    if (!day) notFound();
    return <DayDetailClient program={program} day={day} />;
  } catch {
    notFound();
  }
}
