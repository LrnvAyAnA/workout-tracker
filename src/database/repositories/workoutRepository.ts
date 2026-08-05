import { Capacitor } from "@capacitor/core";
import { getDatabase } from "../sqlite";
import {
  addMockExerciseToWorkout,
  createMockWorkout,
  deleteMockWorkout,
  getMockWorkoutByDate,
  getWorkoutExercises,
  updateMockWorkoutStatus,
} from "../../servises/workoutService";
import { mapWorkoutFromDb } from "../mappers/workoutMapper";
import { mockCategories } from "../../data/mockCategories";
import { mockExercises } from "../../data/mockExercises";
import { mockSets } from "../../data/mockSets";
import {
  ExerciseWithLastWeight,
  ExerciseWorkoutCard,
} from "../../types/workoutCard";
import { mapExerciseFromDb } from "../mappers/exerciseMapper";
import { mapCategoryFromJoinedRow } from "../mappers/categoryMapper";
import { mapSetFromDb } from "../mappers/setMapper";
import { WorkoutType } from "../../types/workout";
import { mockWorkouts } from "../../data/mockWorkouts";
import { getLocalDate } from "../../utils/date";

export async function getAllWorkouts(): Promise<WorkoutType[]> {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();
    const res = await db.query("SELECT * FROM workouts ORDER BY date DESC");
    return (res.values ?? []) as WorkoutType[];
  } else {
    return [...mockWorkouts];
  }
}

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
      mockWorkouts,
    ),
  };
}

async function getWorkoutDetailsFromDb(date: string) {
  console.log("getWorkoutDetailsFromDb called with", date);
  const workout = await getWorkoutByDate(date);
  console.log("workout found:", workout);
  if (!workout) {
    return null;
  }

  const exercises = await getWorkoutExercisesFromDb(workout.id);

  return {
    workout,
    exercises,
  };
}

async function getWorkoutExercisesFromDb(workoutId: number) {
  console.log("getWorkoutExercisesFromDb called with", workoutId);
  const db = await getDatabase();

  const setsSql = `
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
    ORDER BY e.id, s.id`;
  const setsResult = await db.query(setsSql, [workoutId]);
  const statsSql = `
    SELECT
      e.id AS exercise_id,
      (
        SELECT s2.used_weight
        FROM sets s2
        JOIN workouts w2 ON w2.id = s2.workout_id
        WHERE s2.exercise_id = e.id 
          AND s2.workout_id != ?
          AND w2.status = 'completed'
        ORDER BY w2.date DESC, s2.id DESC
        LIMIT 1
      ) AS last_used_weight,
      (
        SELECT MAX(s3.used_weight)
        FROM sets s3
        JOIN workouts w3 ON w3.id = s3.workout_id
        WHERE s3.exercise_id = e.id
          AND w3.status = 'completed'
      ) AS max_weight
    FROM exercises e
    WHERE e.id IN (SELECT exercise_id FROM sets WHERE workout_id = ?)`;
  const statsResult = await db.query(statsSql, [workoutId, workoutId]);

  const statsMap = new Map<
    number,
    { lastUsedWeight: number | null; maxWeight: number | null }
  >();
  for (const row of statsResult.values ?? []) {
    statsMap.set(row.exercise_id, {
      lastUsedWeight: row.last_used_weight ?? null,
      maxWeight: row.max_weight ?? null,
    });
  }

  const map = new Map<number, ExerciseWorkoutCard>();

  for (const row of setsResult.values ?? []) {
    let exercise = map.get(row.id);

    if (!exercise) {
      const stats = statsMap.get(row.id) ?? {
        lastUsedWeight: null,
        maxWeight: null,
      };
      exercise = {
        exercise: mapExerciseFromDb(row),
        category: mapCategoryFromJoinedRow(row),
        sets: [],
        lastUsedWeight: stats.lastUsedWeight,
        maxWeight: stats.maxWeight,
      };
      map.set(row.id, exercise);
    }

    exercise.sets.push(mapSetFromDb(row));
  }

  return [...map.values()];
}

export async function createWorkout(date: string) {
  const today = getLocalDate();
  const status = date < today ? "completed" : "planned";
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    const result = await db.run(
      `
      INSERT INTO workouts
        (date, status)
      VALUES (?, ?)
      `,
      [date, status],
    );

    return {
      id: result.changes?.lastId,
      date,
      status,
    };
  }

  return createMockWorkout(date, status);
}

export async function addExerciseToWorkout(
  workoutId: number,
  exercise: ExerciseWithLastWeight,
) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();
    console.log(`addExerciseToWorkout: ${workoutId}, ${exercise}`);

    await db.run(
      `
      INSERT INTO sets
        (exercise_id, workout_id, reps, used_weight)
      VALUES (?, ?, ?, ?)
      `,
      [
        exercise.id,
        workoutId,
        12,
        exercise.isUsesWeight ? (exercise.defaultWeight ?? null) : null,
      ],
    );

    return;
  }

  return addMockExerciseToWorkout(workoutId, exercise);
}

export async function deleteWorkout(workoutId: number) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();
    const sql = `DELETE FROM workouts WHERE id = ?`;
    await db.run(sql, [workoutId]);
  } else {
    deleteMockWorkout(workoutId);
  }
}

export async function updateWorkoutStatus(
  workoutId: number,
  status: "planned" | "completed",
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();
    await db.run(`UPDATE workouts SET status = ? WHERE id = ?`, [
      status,
      workoutId,
    ]);
  } else {
    updateMockWorkoutStatus(workoutId, status);
  }
}
