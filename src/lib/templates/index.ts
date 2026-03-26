import { pplTemplate } from "./ppl";
import { upperLowerTemplate } from "./upper-lower";
import { fullBodyTemplate } from "./full-body";
import type { WorkoutTemplate } from "./types";

export type { WorkoutTemplate, TemplateDay, TemplateExercise } from "./types";

const TEMPLATES: WorkoutTemplate[] = [pplTemplate, upperLowerTemplate, fullBodyTemplate];

export function getAllTemplates(): WorkoutTemplate[] {
  return TEMPLATES;
}

export function getTemplate(key: string): WorkoutTemplate | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
