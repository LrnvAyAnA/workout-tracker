import { Exercise, Category, Set } from "./workout";

export interface ExerciseWorkoutCard {
  exercise: Exercise;
  category: Category;
  sets: Set[];
}

export interface ExerciseWithLastWeight extends Exercise {
  categoryName?: string;
  lastWeight?: number;
}
