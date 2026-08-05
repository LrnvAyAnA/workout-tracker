import "./categoryBar.css";
import Button from "../button/Button";
import { Category } from "../../types/workout";
import { useRef } from "react";

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
  const ref = useRef<HTMLDivElement>(null);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;

    isDown = true;
    startX = e.pageX - ref.current.offsetLeft;
    scrollLeft = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
  };

  const onMouseUp = () => {
    isDown = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !ref.current) return;

    e.preventDefault();

    const x = e.pageX - ref.current.offsetLeft;
    const walk = x - startX;

    ref.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className="category-filter"
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
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
