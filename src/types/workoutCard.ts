import { Exercise, Category, WorkoutSet, WorkoutType } from "./workout";

export interface WorkoutDetails {
  workout: WorkoutType;
  exercises: ExerciseWorkoutCard[];
}

export interface ExerciseWorkoutCard {
  exercise: Exercise;
  category: Category;
  sets: WorkoutSet[];
  lastUsedWeight: number | null;
  maxWeight: number | null;
}

export interface ExerciseWithLastWeight extends Exercise {
  categoryName?: string;
  lastWeight?: number | null;
  maxWeight?: number | null;
}

export type CreateSetInput = Omit<WorkoutSet, "id">;

export type UpdateSetInput = {
  reps?: number;
  usedWeight?: number | null;
};
