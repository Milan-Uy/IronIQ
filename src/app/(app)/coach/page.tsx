import { MessageSquare } from "lucide-react";

export default function CoachPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-muted p-4">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">AI Coach</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chat with your AI fitness coach to create workout plans, get exercise
          advice, and more.
        </p>
      </div>
    </div>
  );
}
