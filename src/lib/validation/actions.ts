import { z } from "zod";

// Program
export const createProgramSchema = z.object({
  name: z.string().min(1).max(100),
  splitType: z.string().min(1).max(50),
  daysPerWeek: z.number().int().min(1).max(7),
});

export const updateProgramSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  split_type: z.string().min(1).max(50).optional(),
  days_per_week: z.number().int().min(1).max(7).optional(),
});

// Day
export const createDaySchema = z.object({
  name: z.string().min(1).max(100),
  targetMuscles: z.array(z.string().min(1).max(50)).max(20),
});

export const updateDaySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  target_muscles: z.array(z.string().min(1).max(50)).max(20).optional(),
});

// Exercise
export const addExerciseSchema = z.object({
  exerciseName: z.string().min(1).max(100),
  targetSets: z.number().int().min(1).max(20),
  targetReps: z.string().min(1).max(20),
  restSeconds: z.number().int().min(0).max(600),
});

export const updateExerciseSchema = z.object({
  exercise_name: z.string().min(1).max(100).optional(),
  target_sets: z.number().int().min(1).max(20).optional(),
  target_reps: z.string().min(1).max(20).optional(),
  rest_seconds: z.number().int().min(0).max(600).optional(),
  notes: z.string().max(500).optional(),
});

// Tracking
export const logSetSchema = z.object({
  exerciseName: z.string().min(1).max(100),
  setNumber: z.number().int().min(1).max(50),
  weight: z.number().min(0).max(1000),
  reps: z.number().int().min(1).max(100),
  rpe: z.number().min(1).max(10).nullable().optional(),
});

export const updateSessionNotesSchema = z.object({
  notes: z.string().max(2000),
});
