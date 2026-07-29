export interface Category {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  categoryId: number;
  defaultWeight?: number;
  isUsesWeight: boolean;
}

export interface WorkoutType {
  id: number;
  date: string;
  status: "planned" | "completed";
}

export interface Set {
  id: number;
  exerciseId: number;
  workoutId: number;
  usedWeight: number;
  reps: number;
}
