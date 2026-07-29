import { Capacitor } from "@capacitor/core";
import { getDatabase } from "../sqlite";
import {
  createMockWorkout,
  getMockWorkoutByDate,
  getWorkoutExercises,
} from "../../servises/workoutService";
import { mapWorkoutFromDb } from "../mappers/workoutMapper";
import { mockCategories } from "../../data/mockCategories";
import { mockExercises } from "../../data/mockExercises";
import { mockSets } from "../../data/mockSets";
import { ExerciseWorkoutCard } from "../../types/workoutCard";
import { mapExerciseFromDb } from "../mappers/exerciseMapper";
import { mapCategoryFromDb } from "../mappers/categoryMapper";
import { mapSetFromDb } from "../mappers/setMapper";

export async function getWorkoutByDate(date: string) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();
    const sql = `SELECT * FROM workouts WHERE date = ?`;
    const result = await db.query(sql, [date]);
    const row = result.values?.[0];
    return row ? mapWorkoutFromDb(row) : null;
  }

  return getMockWorkoutByDate(date);
}

export async function getWorkoutDetailsByDate(date: string) {
  if (Capacitor.isNativePlatform()) {
    return getWorkoutDetailsFromDb(date);
  }

  return getMockWorkoutDetailsByDate(date);
}

function getMockWorkoutDetailsByDate(date: string) {
  const workout = getMockWorkoutByDate(date);

  if (!workout) {
    return null;
  }

  return {
    workout,
    exercises: getWorkoutExercises(
      workout.id,
      mockExercises,
      mockSets,
      mockCategories,
    ),
  };
}

async function getWorkoutDetailsFromDb(date: string) {
  const workout = await getWorkoutByDate(date);

  if (!workout) {
    return null;
  }

  const exercises = await getWorkoutExercisesFromDb(workout.id);

  return {
    workout,
    exercises,
  };
}

async function getWorkoutExercisesFromDb(id: number) {
  const db = await getDatabase();
  const sql = `
    SELECT
    e.id,
    e.name,
    e.has_weight,
    e.default_weight,
    c.id AS category_id,
    c.name AS category_name,
    s.id AS set_id,
    s.reps,
    s.used_weight,
    s.workout_id
FROM sets s
JOIN exercises e ON e.id = s.exercise_id
JOIN categories c ON c.id = e.category_id
WHERE s.workout_id = ?
ORDER BY e.id, s.id;`;
  const result = await db.query(sql, [id]);

  const map = new Map<number, ExerciseWorkoutCard>();

  for (const row of result.values ?? []) {
    let exercise = map.get(row.id);

    if (!exercise) {
      exercise = {
        exercise: mapExerciseFromDb(row),
        category: mapCategoryFromDb(row),
        sets: [],
      };

      map.set(row.id, exercise);
    }

    exercise.sets.push(mapSetFromDb(row));
  }
  return [...map.values()];
}

export async function createWorkout(date: string) {
  const today = new Date().toISOString().split("T")[0];
  const status = date < today ? "completed" : "planned";
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();
    await db.run(
      `
      INSERT INTO workouts
        (date, status)
      VALUES (?, ?)
      `,
      [date, status],
    );

    return;
  }

  return createMockWorkout(date, status);
}
