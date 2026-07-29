import { WorkoutType } from "../../types/workout";
type WorkoutRow = {
  id: number;
  date: string;
  status: string;
};

export function mapWorkoutFromDb(row: WorkoutRow): WorkoutType {
  return {
    id: row.id,
    date: row.date,
    status: row.status as "planned" | "completed",
  };
}
