import { Exercise } from "./workout";

export type CreateExerciseInput = Omit<Exercise, "id">;

export type ExerciseFormValues = {
  name: string;
  categoryId: number | null;
  isUsesWeight: boolean;
  defaultWeight?: number;
};
