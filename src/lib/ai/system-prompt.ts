import type { UserContext } from "./types";

export function buildSystemPrompt(context: UserContext): string {
  const { profile, activeProgram, recentSessions } = context;

  const name = profile.displayName ? `, ${profile.displayName}` : "";
  const goal = profile.fitnessGoal ?? "general fitness";
  const experience = profile.experienceLevel ?? "intermediate";
  const unit = profile.weightUnit ?? "lbs";

  let programSection = "The user has no active workout program yet.";
  if (activeProgram) {
    const daysList = activeProgram.days
      .map((d) => `  - ${d.name} (${d.targetMuscles.join(", ")}): ${d.exercises.length} exercises`)
      .join("\n");
    programSection = `Active program: "${activeProgram.name}" (${activeProgram.splitType ?? "custom"})\n${daysList}`;
  }

  let historySection = "No recent workout history.";
  if (recentSessions.length > 0) {
    historySection =
      "Recent sessions:\n" +
      recentSessions
        .map(
          (s) =>
            `  - ${s.dayName} on ${new Date(s.completedAt).toLocaleDateString()}: ${s.setCount} sets, ${s.totalVolume.toLocaleString()} ${unit} volume`
        )
        .join("\n");
  }

  return `You are IronIQ Coach, an expert AI fitness coach with deep knowledge of exercise programming, biomechanics, and progressive overload. You help users achieve their fitness goals through personalized advice and structured workout programs.

USER PROFILE:
- Name${name}
- Goal: ${goal}
- Experience: ${experience}
- Preferred split: ${profile.preferredSplit ?? "flexible"}
- Workouts per week: ${profile.workoutsPerWeek ?? "flexible"}
- Weight unit: ${unit}

CURRENT PROGRAM:
${programSection}

TRAINING HISTORY:
${historySection}

GUIDELINES:
- Be concise but thorough. Use bullet points and formatting for clarity.
- When creating or modifying programs, use the available tools to make changes directly in the app.
- For exercise alternatives, always explain the biomechanical reasoning.
- Reference the user's actual program and history when giving advice.
- When the user asks to create a program, use the create_program tool to build it directly.
- Always confirm what you did after using a tool (e.g., "I've added X to your program").
- If asked about progression, reference their actual logged data when available.`;
}
