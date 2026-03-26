import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserPrograms } from "@/lib/supabase/programs";
import { getAllTemplates } from "@/lib/templates";
import { ProgramCard } from "@/components/workout/program-card";
import { TemplateCard } from "@/components/workout/template-card";

export default async function ProgramPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const userPrograms = await getUserPrograms(user.id);
  const templates = getAllTemplates();
  const hasPrograms = userPrograms.length > 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Programs</h1>
        {hasPrograms && (
          <Link
            href="/program/new"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Link>
        )}
      </div>

      {hasPrograms ? (
        <div className="space-y-3">
          {userPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
          <div className="text-center pt-4">
            <Link href="/program/templates" className="text-primary text-sm">
              Browse Templates →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🏋️</div>
            <p className="text-muted-foreground text-sm">
              No programs yet. Pick a template to get started!
            </p>
          </div>
          <div className="space-y-3">
            {templates.map((template) => (
              <TemplateCard key={template.key} template={template} />
            ))}
          </div>
          <div className="text-center pt-2">
            <span className="text-muted-foreground text-sm">
              or{" "}
              <Link href="/program/new" className="text-primary">
                create from scratch
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
