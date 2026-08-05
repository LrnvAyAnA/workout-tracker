import { mockCategories } from "../data/mockCategories";
import { mockExercises } from "../data/mockExercises";
import { mockSets } from "../data/mockSets";
import { mockWorkouts } from "../data/mockWorkouts";
import { CreateExerciseInput } from "../types/exercise";
import { Category, Exercise, WorkoutSet, WorkoutType } from "../types/workout";
import {
  CreateSetInput,
  ExerciseWithLastWeight,
  ExerciseWorkoutCard,
  UpdateSetInput,
} from "../types/workoutCard";

export function getWorkoutExercises(
  workoutId: number,
  exercises: Exercise[],
  sets: WorkoutSet[],
  categories: Category[],
  workouts: WorkoutType[],
): ExerciseWorkoutCard[] {
  const workoutSets = sets.filter((s) => s.workoutId === workoutId);
  const exerciseIds = [...new Set(workoutSets.map((s) => s.exerciseId))];

  // Только завершённые тренировки для статистики
  const completedWorkoutIds = new Set(
    workouts.filter((w) => w.status === "completed").map((w) => w.id),
  );

  return exerciseIds.map((exId) => {
    const exercise = exercises.find((e) => e.id === exId)!;
    const category = categories.find((c) => c.id === exercise.categoryId)!;
    const exerciseSets = workoutSets
      .filter((s) => s.exerciseId === exId)
      .sort((a, b) => a.id - b.id);

    // last used: только из completed
    const prevSets = sets
      .filter(
        (s) =>
          s.exerciseId === exId &&
          s.workoutId !== workoutId &&
          completedWorkoutIds.has(s.workoutId),
      )
      .sort((a, b) => {
        const dateA = workouts.find((w) => w.id === a.workoutId)?.date ?? "";
        const dateB = workouts.find((w) => w.id === b.workoutId)?.date ?? "";
        if (dateB !== dateA) return dateB.localeCompare(dateA);
        return b.id - a.id;
      });
    const lastUsedWeight = prevSets[0]?.usedWeight ?? null;

    // PR: только из completed
    const completedSets = sets.filter(
      (s) => s.exerciseId === exId && completedWorkoutIds.has(s.workoutId),
    );
    const allWeights = completedSets
      .filter((s) => s.usedWeight != null)
      .map((s) => s.usedWeight!);
    const maxWeight = allWeights.length > 0 ? Math.max(...allWeights) : null;

    return {
      exercise,
      category,
      sets: exerciseSets,
      lastUsedWeight,
      maxWeight,
    };
  });
}

export function getMockExercisesWithLastWeight(
  categories: Category[],
  workouts: WorkoutType[],
  exercises: Exercise[],
  sets: WorkoutSet[],
  categoryId?: number,
) {
  const completedWorkoutIds = new Set(
    workouts.filter((w) => w.status === "completed").map((w) => w.id),
  );

  let exercisesFiltered = exercises;
  if (categoryId) {
    exercisesFiltered = exercises.filter(
      (exercise) => exercise.categoryId === categoryId,
    );
  }

  return exercisesFiltered.map((exercise) => {
    const category = categories.find((cat) => cat.id === exercise.categoryId);

    const exerciseSets = sets
      .filter(
        (set) =>
          set.exerciseId === exercise.id &&
          completedWorkoutIds.has(set.workoutId),
      )
      .map((set) => {
        const workout = workouts.find((w) => w.id === set.workoutId);
        return { ...set, date: workout!.date };
      })
      .sort((a, b) => {
        const dateDiff =
          new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return b.id - a.id;
      });

    const lastWeight = exerciseSets[0]?.usedWeight ?? null;

    const maxWeight = exerciseSets.length
      ? Math.max(...exerciseSets.map((s) => s.usedWeight ?? 0))
      : null;

    return {
      ...exercise,
      categoryName: category?.name ?? undefined,
      lastWeight,
      maxWeight,
    };
  });
}

export function createMockExercise(exercise: CreateExerciseInput): Exercise {
  const newExercise: Exercise = {
    id: Date.now(),
    ...exercise,
  };

  mockExercises.push(newExercise);

  return newExercise;
}

export function editMockExercise(id: number, exercise: CreateExerciseInput) {
  const index = mockExercises.findIndex((item) => item.id === id);

  if (index === -1) return;

  mockExercises[index] = {
    id,
    ...exercise,
  };
}

export function deleteMockExercise(id: number) {
  const index = mockExercises.findIndex((exercise) => exercise.id === id);

  if (index !== -1) {
    mockExercises.splice(index, 1);
  }
}

export function getMockCategories(): Category[] {
  return [...mockCategories];
}

export function getMockWorkoutByDate(date: string): WorkoutType | null {
  return mockWorkouts.find((w) => w.date === date) ?? null;
}

export function createMockWorkout(
  date: string,
  status: "completed" | "planned",
): WorkoutType {
  const newWorkout: WorkoutType = {
    id: Date.now(),
    date,
    status,
  };
  mockWorkouts.push(newWorkout);
  return newWorkout;
}

export function deleteMockWorkout(workoutId: number) {
  const index = mockWorkouts.findIndex((workout) => workout.id === workoutId);

  if (index !== -1) {
    mockWorkouts.splice(index, 1);
  }
}

export function addMockExerciseToWorkout(
  workoutId: number,
  exercise: ExerciseWithLastWeight,
) {
  mockSets.push({
    id: Date.now(),
    exerciseId: exercise.id,
    workoutId,
    reps: 12,
    usedWeight: exercise.isUsesWeight ? (exercise.defaultWeight ?? null) : null,
  });
}

export function addMockSet(set: CreateSetInput) {
  mockSets.push({
    ...set,
    id: Date.now(),
  });
}

export function updateMockSet(setId: number, changes: UpdateSetInput) {
  const index = mockSets.findIndex((set) => set.id === setId);

  if (index === -1) return;

  mockSets[index] = {
    ...mockSets[index],
    ...changes,
  };
}

export function deleteMockSet(setId: number) {
  const idx = mockSets.findIndex((s) => s.id === setId);
  if (idx === -1) return;

  const { workoutId } = mockSets[idx];
  mockSets.splice(idx, 1);

  const workoutHasSets = mockSets.some((s) => s.workoutId === workoutId);
  if (!workoutHasSets) {
    deleteMockWorkout(workoutId);
  }
}

export function updateMockWorkoutStatus(
  workoutId: number,
  status: "planned" | "completed",
): void {
  const workout = mockWorkouts.find((w) => w.id === workoutId);
  if (workout) {
    workout.status = status;
  }
}
