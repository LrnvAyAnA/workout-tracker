import { Set } from "../../types/workout";

type WorkoutExerciseRow = {
  id: number;
  name: string;
  has_weight: number;
  default_weight: number | null;

  category_id: number;
  category_name: string;

  set_id: number;
  reps: number;
  used_weight: number | null;
  workout_id: number;
};

export function mapSetFromDb(row: WorkoutExerciseRow): Set {
  if (row.used_weight === null) {
    throw new Error("Weight set cannot have null used_weight");
  }

  return {
    id: row.set_id,
    exerciseId: row.id,
    workoutId: row.workout_id,
    reps: row.reps,
    usedWeight: row.used_weight,
  };
}
