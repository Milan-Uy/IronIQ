import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllTemplates } from "@/lib/templates";
import { TemplateCard } from "@/components/workout/template-card";

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/program" className="text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Templates</h1>
      </div>
      <div className="space-y-3">
        {templates.map((template) => (
          <TemplateCard key={template.key} template={template} />
        ))}
      </div>
    </div>
  );
}
