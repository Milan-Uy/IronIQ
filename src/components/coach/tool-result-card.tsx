"use client";

import Link from "next/link";
import { CheckCircle, Dumbbell, ArrowRight } from "lucide-react";

interface CreateProgramResult {
  success: boolean;
  programId?: string;
  message?: string;
  error?: string;
}

interface SuggestAlternativeResult {
  originalExercise?: string;
  muscleGroup?: string;
  alternatives?: Array<{ name: string; equipment: string }>;
  message?: string;
}

type ToolResult = CreateProgramResult | SuggestAlternativeResult | Record<string, unknown>;

function isProgramResult(r: ToolResult): r is CreateProgramResult {
  return "programId" in r || ("success" in r && typeof (r as CreateProgramResult).message === "string");
}

function isAlternativeResult(r: ToolResult): r is SuggestAlternativeResult {
  return "alternatives" in r && Array.isArray((r as SuggestAlternativeResult).alternatives);
}

export function ToolResultCard({
  toolName,
  result,
}: {
  toolName: string;
  result: ToolResult;
}) {
  if (toolName === "create_program" && isProgramResult(result)) {
    if (!result.success) {
      return (
        <div className="mt-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-xs text-destructive shadow-[var(--shadow-stripe-standard)]">
          Failed to create program: {result.error}
        </div>
      );
    }
    return (
      <div className="mt-2 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 shadow-[var(--shadow-stripe-standard)]">
        <div className="flex items-center gap-2 text-sm font-medium text-green-400">
          <CheckCircle className="h-4 w-4" />
          Program created
        </div>
        {result.programId && (
          <Link
            href={`/program/${result.programId}`}
            className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View in Program tab <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    );
  }

  if (toolName === "suggest_alternative" && isAlternativeResult(result)) {
    if (!result.alternatives || result.alternatives.length === 0) {
      return (
        <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground shadow-[var(--shadow-stripe-standard)]">
          {result.message ?? "No alternatives found."}
        </div>
      );
    }
    return (
      <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 shadow-[var(--shadow-stripe-standard)]">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Dumbbell className="h-3.5 w-3.5" />
          Alternatives for {result.originalExercise}
        </div>
        <div className="space-y-1">
          {result.alternatives.map((alt) => (
            <div key={alt.name} className="text-sm">
              <span className="font-medium">{alt.name}</span>
              <span className="ml-1.5 text-xs text-muted-foreground">({alt.equipment})</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (toolName === "modify_exercise") {
    const r = result as CreateProgramResult;
    return (
      <div className="mt-2 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-xs text-green-400 shadow-[var(--shadow-stripe-standard)]">
        <CheckCircle className="mr-1 inline h-3.5 w-3.5" />
        {r.success ? "Exercise updated" : `Update failed: ${r.error}`}
      </div>
    );
  }

  return null;
}
