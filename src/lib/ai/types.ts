export interface KnowledgeChunk {
  content: string;
  source: string;
  score: number;
}

export interface UserContext {
  userId: string;
  profile: {
    displayName: string | null;
    fitnessGoal: string | null;
    experienceLevel: string | null;
    preferredSplit: string | null;
    workoutsPerWeek: number | null;
    weightUnit: string;
  };
  activeProgram: {
    name: string;
    splitType: string | null;
    days: Array<{
      id: string;
      name: string;
      targetMuscles: string[];
      exercises: Array<{
        id: string;
        name: string;
        targetSets: number;
        targetReps: string | null;
        restSeconds: number | null;
      }>;
    }>;
  } | null;
  recentSessions: Array<{
    dayName: string;
    completedAt: string;
    setCount: number;
    totalVolume: number;
  }>;
}
