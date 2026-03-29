import { createClient } from "@/lib/supabase/server";
import { getChatHistory } from "@/lib/supabase/chat";
import { CoachClient } from "./coach-client";
import type { UIMessage } from "ai";

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const history = await getChatHistory(user.id, 50).catch(() => []);

  const initialMessages: UIMessage[] = history.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    parts: [{ type: "text" as const, text: msg.content }],
    createdAt: new Date(msg.created_at),
  }));

  return <CoachClient initialMessages={initialMessages} />;
}
