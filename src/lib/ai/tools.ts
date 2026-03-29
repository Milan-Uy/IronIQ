import { tool } from "ai";
import { z } from "zod";
import { EXERCISES } from "@/lib/exercises";
import {
  createProgram,
  createDay,
  addExercise,
  updateExercise,
  setActiveProgram,
} from "@/lib/supabase/programs";

export function buildTools(userId: string) {
  return {
    create_program: tool({
      description:
        "Create a complete workout program for the user and set it as active. Use this when the user asks you to build or generate a workout plan.",
      inputSchema: z.object({
        name: z.string().describe("The program name, e.g. 'My PPL Program'"),
        splitType: z
          .enum(["ppl", "upper_lower", "full_body", "custom"])
          .describe("The training split type"),
        daysPerWeek: z.number().int().min(1).max(7).describe("How many days per week"),
        days: z.array(
          z.object({
            name: z.string().describe("Day name, e.g. 'Push Day'"),
            targetMuscles: z
              .array(z.string())
              .describe("Muscle groups targeted this day"),
            exercises: z.array(
              z.object({
                name: z.string().describe("Exercise name"),
                sets: z.number().int().min(1).describe("Number of sets"),
                reps: z.string().describe("Rep range, e.g. '8-12' or '5'"),
                restSeconds: z.number().int().describe("Rest time in seconds"),
              })
            ),
          })
        ),
      }),
      execute: async (input) => {
        const { name, splitType, daysPerWeek, days } = input;
        try {
          const programId = await createProgram(userId, name, splitType, daysPerWeek);
          for (const day of days) {
            const dayId = await createDay(programId, day.name, day.targetMuscles);
            for (const ex of day.exercises) {
              await addExercise(dayId, ex.name, ex.sets, ex.reps, ex.restSeconds);
            }
          }
          await setActiveProgram(userId, programId);
          return {
            success: true,
            programId,
            message: `Created "${name}" with ${days.length} training days and set it as your active program.`,
          };
        } catch (e) {
          return { success: false, error: String(e) };
        }
      },
    }),

    modify_exercise: tool({
      description:
        "Modify an exercise in the user's program. Use when the user asks to change sets, reps, rest time, or the exercise name.",
      inputSchema: z.object({
        exerciseId: z.string().describe("The UUID of the exercise to modify"),
        fields: z.object({
          exercise_name: z.string().optional().describe("New exercise name"),
          target_sets: z.number().int().optional().describe("New number of sets"),
          target_reps: z.string().optional().describe("New rep range"),
          rest_seconds: z.number().int().optional().describe("New rest time in seconds"),
          notes: z.string().optional().describe("Coaching notes for this exercise"),
        }),
      }),
      execute: async (input) => {
        const { exerciseId, fields } = input;
        try {
          await updateExercise(exerciseId, fields);
          return { success: true, message: "Exercise updated successfully." };
        } catch (e) {
          return { success: false, error: String(e) };
        }
      },
    }),

    add_exercise_to_day: tool({
      description:
        "Add a new exercise to an existing day in the user's active program. Use when the user asks to add an exercise to a specific workout day.",
      inputSchema: z.object({
        dayId: z.string().describe("The UUID of the workout day to add the exercise to"),
        name: z.string().describe("Exercise name"),
        sets: z.number().int().min(1).describe("Number of sets"),
        reps: z.string().describe("Rep range, e.g. '8-12' or '15'"),
        restSeconds: z.number().int().describe("Rest time in seconds"),
      }),
      execute: async (input) => {
        const { dayId, name, sets, reps, restSeconds } = input;
        try {
          await addExercise(dayId, name, sets, reps, restSeconds);
          return { success: true, message: `Added "${name}" to your workout day.` };
        } catch (e) {
          return { success: false, error: String(e) };
        }
      },
    }),

    suggest_alternative: tool({
      description:
        "Suggest alternative exercises for a given exercise. Use when the user can't do an exercise or wants a swap.",
      inputSchema: z.object({
        exerciseName: z.string().describe("The exercise to find alternatives for"),
        reason: z
          .string()
          .optional()
          .describe("Why the user wants an alternative (injury, no equipment, preference)"),
      }),
      execute: async (input) => {
        const { exerciseName, reason } = input;
        const target = EXERCISES.find(
          (e) => e.name.toLowerCase() === exerciseName.toLowerCase()
        );
        if (!target) {
          return {
            alternatives: [],
            message: `Could not find "${exerciseName}" in the exercise database. Providing general advice instead.`,
          };
        }

        const alternatives = EXERCISES.filter(
          (e) =>
            e.muscleGroup === target.muscleGroup &&
            e.name !== target.name &&
            (reason?.includes("equipment") ? e.equipment !== target.equipment : true)
        ).slice(0, 3);

        return {
          originalExercise: target.name,
          muscleGroup: target.muscleGroup,
          reason: reason ?? "preference",
          alternatives: alternatives.map((e) => ({
            name: e.name,
            equipment: e.equipment,
            muscleGroup: e.muscleGroup,
          })),
        };
      },
    }),
  };
}
