"use client";

import { useEffect, useRef } from "react";
import type { UIMessage as Message } from "ai";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import { Bot } from "lucide-react";

export function ChatMessageList({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <Bot className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <div className="font-semibold">IronIQ Coach</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask me to create a workout plan, suggest exercises, analyze your progress, or answer fitness questions.
          </p>
        </div>
        <div className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1">&quot;Create a PPL program for me&quot;</span>
          <span className="rounded-full border border-border px-3 py-1">&quot;What can I do instead of bench press?&quot;</span>
          <span className="rounded-full border border-border px-3 py-1">&quot;How&apos;s my training volume this week?&quot;</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
