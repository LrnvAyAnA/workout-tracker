// mockSets.ts
import { WorkoutSet } from "../types/workout";

export const mockSets: WorkoutSet[] = [
  // ─── Workout 1: 3 упражнения, 5 сетов ───
  // Сценарий: удалить сет 1 или 2 → у жима лежа останется ещё один сет, карточка остаётся
  // Сценарий: удалить сет 2, потом сет 1 → у жима лежа сетов не осталось, карточка исчезает,
  //           но тренировка остаётся (есть становая и приседания)
  { id: 1, exerciseId: 1, workoutId: 1, usedWeight: 60, reps: 10 },
  { id: 2, exerciseId: 1, workoutId: 1, usedWeight: 65, reps: 8 },
  { id: 3, exerciseId: 2, workoutId: 1, usedWeight: 80, reps: 5 },
  { id: 4, exerciseId: 3, workoutId: 1, usedWeight: 70, reps: 8 },
  { id: 5, exerciseId: 3, workoutId: 1, usedWeight: 75, reps: 6 },

  // ─── Workout 2: 3 упражнения (в т.ч. подтягивания без веса) ───
  // Сценарий: удалить сет 6 или 7 → упражнение исчезает из тренировки,
  //           но сама тренировка остаётся (ещё упражнения есть)
  { id: 6, exerciseId: 1, workoutId: 2, usedWeight: 62, reps: 10 },
  { id: 7, exerciseId: 4, workoutId: 2, usedWeight: 30, reps: 12 },
  { id: 11, exerciseId: 6, workoutId: 2, usedWeight: null, reps: 8 },
  { id: 12, exerciseId: 6, workoutId: 2, usedWeight: null, reps: 6 },

  // ─── Workout 3: 1 упражнение, 1 сет ───
  // Сценарий: удалить сет 8 → в тренировке не осталось сетов вообще, тренировка удаляется
  { id: 8, exerciseId: 3, workoutId: 3, usedWeight: 70, reps: 10 },

  // ─── Workout 4: 1 упражнение, 2 сета ───
  // Сценарий: удалить сет 9 → остаётся сет 10, карточка бицепса остаётся
  // Сценарий: удалить сет 10 (или 9, потом 10) → сетов не осталось, тренировка удаляется
  { id: 9, exerciseId: 5, workoutId: 4, usedWeight: 15, reps: 12 },
  { id: 10, exerciseId: 5, workoutId: 4, usedWeight: 17, reps: 10 },
];
