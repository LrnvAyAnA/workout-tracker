import { Capacitor } from "@capacitor/core";
import { getDatabase } from "../sqlite";
import { Category } from "../../types/workout";
import { getMockCategories } from "../../servises/workoutService";
import { mapCategoryFromDb } from "../mappers/categoryMapper";

export async function getCategories(): Promise<Category[]> {
  if (Capacitor.isNativePlatform()) {
    const db = await getDatabase();

    const result = await db.query(
      `
      SELECT 
        id,
        name
      FROM categories
      `,
    );

    return (result.values ?? []).map(mapCategoryFromDb);
  }

  return getMockCategories();
}
