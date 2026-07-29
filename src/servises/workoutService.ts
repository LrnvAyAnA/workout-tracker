import { mockCategories } from "../data/mockCategories";
import { mockExercises } from "../data/mockExercises";
import { mockWorkouts } from "../data/mockWorkouts";
import { CreateExerciseInput } from "../types/exercise";
import { Category, Exercise, Set, WorkoutType } from "../types/workout";

export function getWorkoutExercises(
  workoutId: number,
  exercises: Exercise[],
  sets: Set[],
  categories: Category[],
) {
  return exercises
    .filter((exercise) =>
      sets.some(
        (set) => set.exerciseId === exercise.id && set.workoutId === workoutId,
      ),
    )
    .map((exercise) => {
      const category = categories.find(
        (category) => category.id === exercise.categoryId,
      );
      if (!category) {
        throw new Error("Category not found");
      }

      const exerciseSets = sets.filter(
        (set) => set.exerciseId === exercise.id && set.workoutId === workoutId,
      );

      return {
        exercise,
        category,
        sets: exerciseSets,
      };
    });
}

export function getMockExercisesWithLastWeight(
  categories: Category[],
  workouts: WorkoutType[],
  exercises: Exercise[],
  sets: Set[],
  categoryId?: number,
) {
  let exercisesFiltered = exercises;
  if (categoryId) {
    exercisesFiltered = exercises.filter(
      (exercise) => exercise.categoryId === categoryId,
    );
  }

  const setFiltred = sets.filter((set) =>
    exercisesFiltered.some((exercise) => set.exerciseId === exercise.id),
  );

  const setsWithDate = setFiltred.map((set) => {
    const workout = workouts.find((w) => w.id === set.workoutId);
    return { ...set, date: workout?.date };
  });
  const validSets = setsWithDate.filter(
    (s): s is typeof s & { date: string } => s.date !== undefined,
  );
  const groupedByExercise = validSets.reduce(
    (acc, set) => {
      if (!acc[set.exerciseId]) acc[set.exerciseId] = [];
      acc[set.exerciseId].push(set);
      return acc;
    },
    {} as Record<number, typeof validSets>,
  );

  const lastWeights = Object.entries(groupedByExercise).map(
    ([exerciseId, sets]) => {
      const latestSet = sets.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];
      return {
        exerciseId: Number(exerciseId),
        lastWeight: latestSet.usedWeight,
      };
    },
  );

  return exercisesFiltered.map((exercise) => {
    const category = categories.find((cat) => cat.id === exercise.categoryId);
    const weightEntry = lastWeights.find((lw) => lw.exerciseId === exercise.id);

    return {
      ...exercise,
      categoryName: category?.name,
      lastWeight: weightEntry?.lastWeight,
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
  console.log("я был в маппинге");
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
