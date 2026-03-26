import { notFound } from "next/navigation";
import { getProgram } from "@/lib/supabase/programs";
import { ProgramDetailClient } from "./program-detail-client";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const program = await getProgram(id);
    return <ProgramDetailClient program={program} />;
  } catch {
    notFound();
  }
}
