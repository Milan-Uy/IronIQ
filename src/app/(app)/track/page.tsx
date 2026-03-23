import { Dumbbell } from "lucide-react";

export default function TrackPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-muted p-4">
        <Dumbbell className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Track</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log your workouts, track sets and reps, and review your training
          history.
        </p>
      </div>
    </div>
  );
}
