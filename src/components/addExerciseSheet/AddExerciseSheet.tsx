import { IonModal } from "@ionic/react";
import styles from "./addExerciseSheet.module.css";
import { useState } from "react";
import CategoryBar from "../categoryBar/CategoryBar";
import { getExercisesWithLastWeight } from "../../servises/workoutService";
import { mockCategories } from "../../data/mockCategories";
import { mockExercises } from "../../data/mockExercises";
import { mockSets } from "../../data/mockSets";
import { mockWorkouts } from "../../data/mockWorkouts";
import ExerciseCard from "../exerciseCard/ExerciseCard";
import {
  ExerciseWithLastWeight,
  ExerciseWorkoutCard,
} from "../../types/workoutCard";

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
  const exerciseData = getExercisesWithLastWeight(
    mockCategories,
    mockWorkouts,
    mockExercises,
    mockSets,
    selectedCategory ?? undefined,
  );

  const availableExercises = exerciseData.filter(
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
