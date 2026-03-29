import { notFound } from "next/navigation";
import { getSessionDetail } from "@/lib/supabase/insights";
import { SessionDetailView } from "@/components/insights/session-detail-view";

export default async function InsightsSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getSessionDetail(sessionId);
  if (!session || !session.completed_at) notFound();

  return <SessionDetailView session={session} />;
}
