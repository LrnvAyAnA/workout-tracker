import { useState } from "react";
import CategoryBar from "../categoryBar/CategoryBar";
import styles from "./addNewExercise.module.css";
import InlineNumberInput from "../inlineNumberInput/InlineNumberInput";
import Close from "../../assets/icons/close.svg?react";

import { IonToggle } from "@ionic/react";
import Button from "../button/Button";

type NewExerciseInput = {
  name: string;
  categoryId: number;
  isUsesWeight: boolean;
  defaultWeight?: number;
};

type Props = {
  onClose: () => void;
  onAddExercise: (newExercise: NewExerciseInput) => void;
};

const AddNewExercise = ({ onClose, onAddExercise }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isUsesWeight, setIsUsesWeight] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [defaultWeight, setDefaultWeight] = useState<number | null>(null);

  const handleAdd = () => {
    if (selectedCategory === null) {
      return; //показать ошибку
    }

    onAddExercise({
      name: name,
      categoryId: selectedCategory,
      isUsesWeight: isUsesWeight,
      defaultWeight: isUsesWeight ? (defaultWeight ?? undefined) : undefined,
    });
  };
  return (
    <div className={styles["exercise-card"]}>
      <h2>NEW EXERCISE</h2>
      <CategoryBar
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
              value={defaultWeight === null ? "" : String(defaultWeight)}
              onChange={(e) => {
                const raw = e.target.value;
                if (/^\d*$/.test(raw)) {
                  setDefaultWeight(Number(raw));
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
      <Button variant="add-set" children="ADD" onClick={handleAdd} />
    </div>
  );
};

export default AddNewExercise;
