import { createClient } from "./server";
import type { Database } from "@/types/database";

type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  structured_data: unknown;
  created_at: string;
}

export async function getChatHistory(
  userId: string,
  limit = 50
): Promise<StoredMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, structured_data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as StoredMessage[];
}

export async function saveChatMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
  structuredData?: unknown
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("chat_messages").insert({
    user_id: userId,
    role,
    content,
    structured_data: (structuredData ?? null) as import("@/types/database").Database["public"]["Tables"]["chat_messages"]["Row"]["structured_data"],
  });
  if (error) throw error;
}

export async function clearChatHistory(userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}
