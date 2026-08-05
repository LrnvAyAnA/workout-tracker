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

  console.log("DB: Tables created");

  await seedCategories();

  console.log("DB: seedCategories");

  return db;
}
