import { mockCategories } from "../../data/mockCategories";
import { getCategories } from "../../servises/workoutService";
import "./categoryBar.css";
import Button from "../button/Button";

type CategoryBarProps = {
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
  showAllOption: boolean;
};

const CategoryBar = ({
  selectedCategory,
  onSelectCategory,
  showAllOption,
}: CategoryBarProps) => {
  const categories = getCategories(mockCategories);
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
