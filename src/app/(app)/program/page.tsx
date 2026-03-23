import { ClipboardList } from "lucide-react";

export default function ProgramPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-muted p-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Program</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage your workout programs, browse templates, and customize
          your training.
        </p>
      </div>
    </div>
  );
}
