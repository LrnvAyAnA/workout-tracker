import { IonModal } from "@ionic/react";
import styles from "./addExerciseSheet.module.css";
import { useEffect, useState } from "react";
import CategoryBar from "../categoryBar/CategoryBar";
import {} from "../../servises/workoutService";
import ExerciseCard from "../exerciseCard/ExerciseCard";
import {
  ExerciseWithLastWeight,
  ExerciseWorkoutCard,
} from "../../types/workoutCard";
import { getExercisesWithLastWeight } from "../../database/repositories/exerciseRepository";
import { Category } from "../../types/workout";
import { getCategories } from "../../database/repositories/categoryRepository";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  handleSelectExercise: (exercise: ExerciseWithLastWeight) => void;
  workoutExercises: ExerciseWorkoutCard[];
};

const AddExerciseSheet = ({
  isOpen,
  onClose,
  handleSelectExercise,
  workoutExercises,
}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [exercises, setExercises] = useState<ExerciseWithLastWeight[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  useEffect(() => {
    loadExercises();
  }, [selectedCategory]);

  async function loadExercises() {
    const data = await getExercisesWithLastWeight(
      selectedCategory ?? undefined,
    );
    setExercises(data);
  }

  const availableExercises = exercises.filter(
    (exercise) =>
      !workoutExercises.some((we) => we.exercise.id === exercise.id),
  );

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.75}
      breakpoints={[0, 0.25, 0.5, 0.75]}
      className={styles["custom-modal"]}
    >
      <div className={styles["modal-content"]}>
        <div className={styles["title"]}>
          <h2>Add exercise</h2>
        </div>
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showAllOption={true}
        />
        {availableExercises.map((exercise) => (
          <div
            key={exercise.id}
            className={styles["exercise-select-item"]}
            onClick={() => handleSelectExercise(exercise)}
          >
            <ExerciseCard data={exercise} />
          </div>
        ))}
      </div>
    </IonModal>
  );
};

export default AddExerciseSheet;
