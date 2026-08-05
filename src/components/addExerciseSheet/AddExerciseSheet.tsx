import { IonContent, IonModal, useIonViewWillEnter } from "@ionic/react";
import styles from "./addExerciseSheet.module.css";
import { useCallback, useEffect, useState } from "react";
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

  useIonViewWillEnter(() => {
    loadCategories();
    loadExercises();
  });

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  const loadExercises = useCallback(async () => {
    const data = await getExercisesWithLastWeight(
      selectedCategory ?? undefined,
    );
    setExercises(data);
  }, [selectedCategory]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const availableExercises = exercises.filter(
    (exercise) =>
      !workoutExercises.some((we) => we.exercise.id === exercise.id),
  );

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.75}
      breakpoints={[0, 0.25, 0.75, 1]}
      className={styles["custom-modal"]}
    >
      <div className={styles["sheet-wrapper"]}>
        <div className={styles["title"]}>
          <h2>Add exercise</h2>
        </div>
        <IonContent className={styles["sheet-scroll"]}>
          <div className={styles["content"]}>
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
        </IonContent>
      </div>
    </IonModal>
  );
};

export default AddExerciseSheet;
