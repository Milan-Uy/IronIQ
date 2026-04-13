"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-1.5">
      <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card px-4 py-3 shadow-[var(--shadow-stripe-standard)]">
        <span
          className="h-2 w-2 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
