export interface Category {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  categoryId: number;
}

export interface Workout {
  id: number;
  date: string;
}

export interface Set {
  id: number;
  exerciseId: number;
  workoutId: number;
  usedWeight: number;
  reps: number;
}

