import { Category, Exercise, Set, Workout } from "../types/workout";

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

export function getCategories(categories: Category[]) {
  return categories;
}

export function getExercisesWithLastWeight(
  categories: Category[],
  workouts: Workout[],
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
