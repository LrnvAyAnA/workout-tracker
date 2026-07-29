import { getDatabase } from "./sqlite";
import {
  createCategoriesTable,
  createExercisesTable,
  createWorkoutsTable,
  createSetsTable,
} from "./schema";
import { seedCategories } from "./seeds";

export async function initializeDatabase() {
  const db = await getDatabase();
  await db.execute(createCategoriesTable);
  await db.execute(createExercisesTable);
  await db.execute(createWorkoutsTable);
  await db.execute(createSetsTable);

  await seedCategories();

  console.log("Tables created");

  return db;
}
