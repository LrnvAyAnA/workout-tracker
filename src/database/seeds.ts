import { getDatabase } from "./sqlite";

const defaultCategories = ["Chest", "Back", "Legs", "Shoulders", "Arms"];

export async function seedCategories() {
  const db = await getDatabase();

  const result = await db.query("SELECT COUNT(*) as count FROM categories");

  const count = result.values?.[0].count ?? 0;

  if (count > 0) {
    return;
  }

  for (const name of defaultCategories) {
    await db.run(
      `
      INSERT INTO categories (name)
      VALUES (?)
      `,
      [name],
    );
  }
}
