import { Category } from "../../types/workout";

// для простого SELECT id, name FROM categories
type SimpleCategoryDbRow = {
  id: number;
  name: string;
};

export function mapCategoryFromDb(row: SimpleCategoryDbRow): Category {
  return {
    id: row.id,
    name: row.name,
  };
}

// для JOIN-запроса, где категория пришла с префиксом category_
type JoinedCategoryDbRow = {
  category_id: number;
  category_name: string;
};

export function mapCategoryFromJoinedRow(row: JoinedCategoryDbRow): Category {
  return {
    id: row.category_id,
    name: row.category_name,
  };
}
