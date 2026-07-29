import { Capacitor } from "@capacitor/core";
import { Exercise } from "../../types/workout";
import { getDatabase } from "../sqlite";
import { mockExercises } from "../../data/mockExercises";
import { mockCategories } from "../../data/mockCategories";
import { mockWorkouts } from "../../data/mockWorkouts";
import { mockSets } from "../../data/mockSets";
import { ExerciseWithLastWeight } from "../../types/workoutCard";
import {
  createMockExercise,
  deleteMockExercise,
  editMockExercise,
  getMockExercisesWithLastWeight,
} from "../../servises/workoutService";
import { CreateExerciseInput } from "../../types/exercise";

export async function getExercisesWithLastWeight(
  categoryId?: number,
): Promise<ExerciseWithLastWeight[]> {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    const sql = `
      SELECT 
        exercises.id,
        exercises.name,
        exercises.has_weight,
        exercises.default_weight,
        categories.name AS category_name,
         (
        SELECT sets.used_weight
        FROM sets
        JOIN workouts ON workouts.id = sets.workout_id
        WHERE sets.exercise_id = exercises.id
        ORDER BY workouts.date DESC
        LIMIT 1
    ) AS last_weight
      FROM exercises
      JOIN categories ON categories.id = exercises.category_id
      WHERE exercises.deleted_at IS NULL
      ${categoryId ? "AND exercises.category_id = ?" : ""}
    `;
    const result = await db.query(sql, categoryId ? [categoryId] : []);
    return (result.values ?? []).map(mapExerciseWithLastWeightFromDb);
  } else {
    return getMockExercisesWithLastWeight(
      mockCategories,
      mockWorkouts,
      mockExercises,
      mockSets,
      categoryId,
    );
  }
}

export async function createExercise(exercise: CreateExerciseInput) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    await db.run(
      `
      INSERT INTO exercises
        (name, category_id, has_weight, default_weight)
      VALUES (?, ?, ?, ?)
      `,
      [
        exercise.name,
        exercise.categoryId,
        exercise.isUsesWeight ? 1 : 0,
        exercise.defaultWeight ?? null,
      ],
    );

    return;
  }

  createMockExercise(exercise);
}

export async function editExercise(id: number, exercise: CreateExerciseInput) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    await db.run(
      `
    UPDATE exercises
    SET 
      name = ?,
      category_id = ?,
      has_weight = ?,
      default_weight = ?
    WHERE id = ?
    `,
      [
        exercise.name,
        exercise.categoryId,
        exercise.isUsesWeight ? 1 : 0,
        exercise.defaultWeight ?? null,
        id,
      ],
    );
    return;
  }

  editMockExercise(id, exercise);
}

export async function deleteExercise(id: number) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    await db.run(
      `
  UPDATE exercises
  SET deleted_at = datetime('now')
  WHERE id = ?
  `,
      [id],
    );

    return;
  }

  deleteMockExercise(id);
}
function mapExerciseWithLastWeightFromDb(
  value: any,
  index: number,
  array: any[],
): ExerciseWithLastWeight {
  throw new Error("Function not implemented.");
}
