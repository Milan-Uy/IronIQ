"use server";

import { createClient } from "@/lib/supabase/server";
import { clearChatHistory } from "@/lib/supabase/chat";

export async function clearHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  try {
    await clearChatHistory(user.id);
    return {};
  } catch {
    return { error: "Failed to clear history" };
  }
}
