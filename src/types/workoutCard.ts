import { Exercise, Category, Set, WorkoutType } from "./workout";

export interface WorkoutDetails {
  workout: WorkoutType;
  exercises: ExerciseWorkoutCard[];
}

export interface ExerciseWorkoutCard {
  exercise: Exercise;
  category: Category;
  sets: Set[];
}

export interface ExerciseWithLastWeight extends Exercise {
  categoryName?: string;
  lastWeight?: number;
}
