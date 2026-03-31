export function PageSkeleton({
  variant = "list",
}: {
  variant?: "list" | "chat" | "charts";
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 animate-pulse">
      {/* Header */}
      <div className="h-7 w-40 rounded bg-muted mb-6" />

      {variant === "chat" && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`h-14 rounded-2xl bg-muted ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`}
              />
            </div>
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {variant === "charts" && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-xl bg-muted" />
            <div className="h-20 rounded-xl bg-muted" />
          </div>
          {/* Chart placeholders */}
          <div className="h-52 rounded-xl bg-muted" />
          <div className="h-52 rounded-xl bg-muted" />
        </div>
      )}
    </div>
  );
}
