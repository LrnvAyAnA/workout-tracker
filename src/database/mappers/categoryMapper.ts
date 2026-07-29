import { Category } from "../../types/workout";

export function mapCategoryFromDb(row: any): Category {
  return {
    id: row.id,
    name: row.name,
  };
}
