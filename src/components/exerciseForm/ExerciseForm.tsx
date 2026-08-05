import { useEffect, useState } from "react";
import CategoryBar from "../categoryBar/CategoryBar";
import styles from "./exerciseForm.module.css";
import Close from "../../assets/icons/close.svg?react";

import { IonToggle } from "@ionic/react";
import Button from "../button/Button";
import { CreateExerciseInput, ExerciseFormValues } from "../../types/exercise";
import { Category } from "../../types/workout";
import { getCategories } from "../../database/repositories/categoryRepository";

type Props = {
  initialValues?: ExerciseFormValues;
  mode: "create" | "edit";
  onSubmit: (exercise: CreateExerciseInput) => void;
  onClose: () => void;
};

const ExerciseForm = ({ onClose, onSubmit, initialValues, mode }: Props) => {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialValues?.categoryId ?? null,
  );
  const [isUsesWeight, setIsUsesWeight] = useState(
    initialValues?.isUsesWeight ?? false,
  );
  const [defaultWeight, setDefaultWeight] = useState<number | null>(
    initialValues?.defaultWeight ?? null,
  );

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleAdd = () => {
    if (selectedCategory === null) {
      return;
    }

    if (name.trim() === "") {
      return;
    }

    if (isUsesWeight && defaultWeight === null) {
      return;
    }

    onSubmit({
      name,
      categoryId: selectedCategory,
      isUsesWeight,
      defaultWeight: isUsesWeight ? defaultWeight : null,
    });
  };
  return (
    <div className={styles["exercise-card"]}>
      <h2>{mode === "create" ? "NEW EXERCISE" : "EDIT EXERCISE"}</h2>
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        showAllOption={false}
      />
      <div className={styles["card-content"]}>
        <div className={styles["input-fields"]}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise name"
            className={styles["input-card"]}
          />

          {isUsesWeight && (
            <input
              value={defaultWeight ?? ""}
              onChange={(e) => {
                const raw = e.target.value;

                if (/^\d*$/.test(raw)) {
                  setDefaultWeight(raw === "" ? null : Number(raw));
                }
              }}
              placeholder="Default weight (kg)"
              inputMode="numeric"
              className={styles["input-card"]}
            />
          )}
        </div>
        <div className={styles["toggle-wrap"]}>
          <IonToggle
            className={styles["ion-toggle"]}
            checked={isUsesWeight}
            onIonChange={(e) => {
              setIsUsesWeight(e.detail.checked);
              if (!e.detail.checked) {
                setDefaultWeight(null);
              }
            }}
          />
          <span className={styles["toggle-title"]}>Uses weight</span>
        </div>
      </div>
      <div onClick={onClose} className={styles["close-button"]}>
        <Close />
      </div>
      <Button
        variant="add-set"
        children={mode === "create" ? "ADD" : "SAVE"}
        onClick={handleAdd}
      />
    </div>
  );
};

export default ExerciseForm;
