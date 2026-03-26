export type TemplateExercise = {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  notes?: string;
};

export type TemplateDay = {
  name: string;
  targetMuscles: string[];
  exercises: TemplateExercise[];
};

export type WorkoutTemplate = {
  key: string;
  name: string;
  description: string;
  splitType: "ppl" | "upper_lower" | "full_body";
  daysPerWeek: number;
  days: TemplateDay[];
};
