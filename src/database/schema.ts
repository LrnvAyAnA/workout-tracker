export const createCategoriesTable = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
`;

export const createExercisesTable = `
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  has_weight INTEGER NOT NULL DEFAULT 1,
  default_weight REAL,
  deleted_at TEXT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
`;

export const createWorkoutsTable = `
CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned'
);
`;

export const createSetsTable = `
CREATE TABLE IF NOT EXISTS sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  used_weight REAL,
  reps INTEGER NOT NULL,
  workout_id INTEGER NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id)
);
`;
