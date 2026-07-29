import "./categoryBar.css";
import Button from "../button/Button";
import { Category } from "../../types/workout";

type CategoryBarProps = {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
  showAllOption: boolean;
};

const CategoryBar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  showAllOption,
}: CategoryBarProps) => {
  return (
    <div className="category-filter">
      {showAllOption ? (
        <Button
          variant={selectedCategory === null ? "chip-active" : "chip"}
          onClick={() => onSelectCategory(null)}
        >
          ALL
        </Button>
      ) : null}
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selectedCategory === cat.id ? "chip-active" : "chip"}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryBar;
