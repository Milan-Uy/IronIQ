import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllTemplates } from "@/lib/templates";
import { TemplateCard } from "@/components/workout/template-card";

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="pb-20">
      <div className="px-4 pb-2 pt-6">
        <div className="mx-auto max-w-lg">
          <Link
            href="/program"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Programs
          </Link>
          <h1 className="tight-display mt-2 text-2xl font-[400] text-foreground">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Proven splits you can adopt in one tap
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-lg space-y-3 px-4 py-4">
        {templates.map((template) => (
          <TemplateCard key={template.key} template={template} />
        ))}
      </div>
    </div>
  );
}
