"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  }

  return (
    <div className="border-t border-border bg-background px-4 pb-safe py-3">
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach..."
          className="min-h-[44px] max-h-32 flex-1 resize-none"
          rows={1}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 shrink-0"
          disabled={!input.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-1.5 text-center text-xs text-muted-foreground">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
