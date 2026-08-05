// mockExercises.ts
import { Exercise } from "../types/workout";

export const mockExercises: Exercise[] = [
  {
    id: 1,
    name: "Bench Press",
    categoryId: 1,
    defaultWeight: 60,
    isUsesWeight: true,
  },
  {
    id: 2,
    name: "Deadlift",
    categoryId: 2,
    defaultWeight: 80,
    isUsesWeight: true,
  },
  {
    id: 3,
    name: "Squats",
    categoryId: 3,
    defaultWeight: 70,
    isUsesWeight: true,
  },
  {
    id: 4,
    name: "Overhead Press",
    categoryId: 4,
    defaultWeight: 30,
    isUsesWeight: true,
  },
  {
    id: 5,
    name: "Bicep Curl",
    categoryId: 5,
    defaultWeight: 15,
    isUsesWeight: true,
  },
  {
    id: 6,
    name: "Pull-ups",
    categoryId: 2,
    defaultWeight: null,
    isUsesWeight: false,
  },
];
