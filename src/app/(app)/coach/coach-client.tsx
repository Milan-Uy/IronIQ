"use client";

import { useTransition, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage as Message } from "ai";
import { ChatMessageList } from "@/components/coach/chat-message-list";
import { ChatInput } from "@/components/coach/chat-input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { clearHistory } from "./actions";
import { toast } from "sonner";

export function CoachClient({ initialMessages }: { initialMessages: Message[] }) {
  const { messages, sendMessage, status, setMessages, error } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const isLoading = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }

  function handleClearHistory() {
    startTransition(async () => {
      const result = await clearHistory();
      if (result?.error) {
        toast.error(result.error);
      } else {
        setMessages([]);
      }
    });
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="font-semibold text-sm">AI Coach</h1>
          <p className="text-xs text-muted-foreground">Powered by Llama</p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground"
            onClick={handleClearHistory}
            disabled={isPending || isLoading}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Chat
          </Button>
        )}
      </div>
      {error && (
        <div className="mx-4 mt-3 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error.message}
        </div>
      )}
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
