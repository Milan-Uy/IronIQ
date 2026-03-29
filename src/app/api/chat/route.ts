import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getModel } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { buildUserContext } from "@/lib/ai/context";
import { buildTools } from "@/lib/ai/tools";
import { saveChatMessage } from "@/lib/supabase/chat";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!checkRateLimit(user.id)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const body = await req.json();
  const uiMessages: UIMessage[] = body.messages ?? [];

  // Save the last user message
  const lastUserMessage = [...uiMessages].reverse().find((m) => m.role === "user");
  if (lastUserMessage) {
    const text = lastUserMessage.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
    if (text) {
      await saveChatMessage(user.id, "user", text).catch(() => {});
    }
  }

  const [context] = await Promise.all([buildUserContext(user.id)]);
  const systemPrompt = buildSystemPrompt(context);
  const tools = buildTools(user.id);
  // Keep only the last 10 messages to limit token usage
  const recentMessages = uiMessages.slice(-10);
  const modelMessages = await convertToModelMessages(recentMessages);

  const result = streamText({
    model: getModel(),
    system: systemPrompt,
    messages: modelMessages,
    tools,
    onFinish: async ({ text }) => {
      if (text) {
        await saveChatMessage(user.id, "assistant", text).catch(() => {});
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
