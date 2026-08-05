export interface Category {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  categoryId: number;
  defaultWeight: number | null;
  isUsesWeight: boolean;
}

export interface WorkoutType {
  id: number;
  date: string;
  status: "planned" | "completed";
}

export type WorkoutSet = {
  id: number;
  exerciseId: number;
  workoutId: number;
  usedWeight: number | null;
  reps: number;
};
