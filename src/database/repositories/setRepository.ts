import { Capacitor } from "@capacitor/core";
import { getDatabase } from "../sqlite";
import {
  addMockSet,
  deleteMockSet,
  updateMockSet,
} from "../../servises/workoutService";
import { CreateSetInput, UpdateSetInput } from "../../types/workoutCard";
import { WorkoutSet } from "../../types/workout";
import { mockSets } from "../../data/mockSets";
import { mapSetFromDb } from "../mappers/setMapper";

export async function getSetById(id: number): Promise<WorkoutSet | null> {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    const result = await db.query(`SELECT * FROM sets WHERE id = ?`, [id]);

    const row = result.values?.[0];

    return row ? mapSetFromDb(row) : null;
  }

  return mockSets.find((set) => set.id === id) ?? null;
}

export async function addSet(set: CreateSetInput) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    await db.run(
      `
      INSERT INTO sets
        (exercise_id, workout_id, reps, used_weight)
      VALUES (?, ?, ?, ?)
      `,
      [set.exerciseId, set.workoutId, set.reps, set.usedWeight],
    );

    return;
  }

  addMockSet(set);
}

export async function updateSet(setId: number, changes: UpdateSetInput) {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    const fields: string[] = [];
    const values: (number | null)[] = [];

    if (changes.reps !== undefined) {
      fields.push("reps = ?");
      values.push(changes.reps);
    }

    if (changes.usedWeight !== undefined) {
      fields.push("used_weight = ?");
      values.push(changes.usedWeight);
    }

    values.push(setId);

    await db.run(
      `
      UPDATE sets
      SET ${fields.join(", ")}
      WHERE id = ?
      `,
      values,
    );

    return;
  }

  updateMockSet(setId, changes);
}

export async function deleteSetFromWorkout(setId: number) {
  if (Capacitor.isNativePlatform()) {
    await deleteSetFromDB(setId);
  } else {
    deleteMockSet(setId);
  }
}

async function deleteSetFromDB(setId: number) {
  const db = await getDatabase();

  const res = await db.query("SELECT workout_id FROM sets WHERE id = ?", [
    setId,
  ]);
  const row = res.values?.[0];
  if (!row) {
    return;
  }

  const { workout_id } = row;

  await db.run("DELETE FROM sets WHERE id = ?", [setId]);

  const cntRes = await db.query(
    "SELECT COUNT(*) as cnt FROM sets WHERE workout_id = ?",
    [workout_id],
  );
  const setsLeft = cntRes.values?.[0]?.cnt ?? 0;

  if (setsLeft === 0) {
    await db.run("DELETE FROM workouts WHERE id = ?", [workout_id]);
  }
}
