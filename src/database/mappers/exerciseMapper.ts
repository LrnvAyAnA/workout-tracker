import { Exercise } from "../../types/workout";
import { ExerciseWithLastWeight } from "../../types/workoutCard";

type ExerciseDbRow = {
  id: number;
  name: string;
  category_id: number;
  category_name: string | null;
  default_weight: number | null;
  has_weight: number;
  last_weight: number | null;
  max_weight: number | null;
};

export function mapExerciseFromDb(row: ExerciseDbRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id,
    defaultWeight: row.default_weight ?? null,
    isUsesWeight: row.has_weight === 1,
  };
}

export function mapExerciseWithLastWeightFromDb(
  row: ExerciseDbRow,
): ExerciseWithLastWeight {
  return {
    ...mapExerciseFromDb(row),
    categoryName: row.category_name ?? undefined,
    lastWeight: row.last_weight,
    maxWeight: row.max_weight,
  };
}
