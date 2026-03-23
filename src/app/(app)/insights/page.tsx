import { BarChart3 } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-muted p-4">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered analytics on your training volume, progress, and
          recommendations.
        </p>
      </div>
    </div>
  );
}
