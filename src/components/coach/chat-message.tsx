"use client";

import type { UIMessage as Message } from "ai";
import { ToolResultCard } from "./tool-result-card";

function renderText(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li key={i} className="ml-4 list-disc">
          {line.slice(2)}
        </li>
      );
    }
    if (line.startsWith("# ")) return <h3 key={i} className="font-semibold">{line.slice(2)}</h3>;
    if (line.startsWith("## ")) return <h4 key={i} className="font-medium">{line.slice(3)}</h4>;
    if (line === "") return <div key={i} className="h-2" />;
    return <p key={i}>{line}</p>;
  });
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const textContent = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  // In AI SDK v6, dynamic tool parts have type 'dynamic-tool'
  const toolParts = message.parts.filter(
    (p) => p.type === "dynamic-tool"
  ) as Array<{
    type: "dynamic-tool";
    toolName: string;
    state: string;
    output?: unknown;
  }>;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-4 py-1`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {isUser ? (
          <p>{textContent}</p>
        ) : (
          <div className="space-y-1">
            {textContent && <div>{renderText(textContent)}</div>}
            {toolParts
              .filter((p) => p.state === "output-available")
              .map((p, i) => (
                <ToolResultCard
                  key={i}
                  toolName={p.toolName}
                  result={p.output as Record<string, unknown>}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
