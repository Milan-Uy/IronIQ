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
    <div className="pb-20">
      <div className="px-4 pb-2 pt-6">
        <div className="mx-auto flex max-w-lg items-start justify-between gap-4">
          <div>
            <h1 className="tight-display text-2xl font-[400] text-foreground">Programs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasPrograms
                ? "Your training blueprints"
                : "Pick a template or build your own"}
            </p>
          </div>
          {hasPrograms && (
            <Link
              href="/program/new"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-stripe-standard)] transition-transform hover:-translate-y-0.5"
              aria-label="Create program"
            >
              <Plus className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4">
        {hasPrograms ? (
          <div className="space-y-3">
            {userPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
            <div className="pt-4 text-center">
              <Link
                href="/program/templates"
                className="text-sm text-primary transition-opacity hover:opacity-80"
              >
                Browse Templates →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div
              className="rounded-lg border border-border/60 p-6 text-center shadow-[var(--shadow-stripe-elevated)]"
              style={{ background: "var(--gradient-accent), var(--card)" }}
            >
              <div className="tight-hero text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Get started
              </div>
              <p className="mt-2 tight-display text-base font-[400] text-foreground">
                No programs yet — pick a template to begin
              </p>
            </div>
            <div className="space-y-3">
              {templates.map((template) => (
                <TemplateCard key={template.key} template={template} />
              ))}
            </div>
            <div className="pt-1 text-center">
              <span className="text-sm text-muted-foreground">
                or{" "}
                <Link
                  href="/program/new"
                  className="text-primary transition-opacity hover:opacity-80"
                >
                  create from scratch
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
