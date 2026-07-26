import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { trash } from "ionicons/icons";

import styles from "./exercises.module.css";
import CategoryBar from "../components/categoryBar/CategoryBar";
import { mockCategories } from "../data/mockCategories";
import { mockExercises } from "../data/mockExercises";
import { mockSets } from "../data/mockSets";
import { mockWorkouts } from "../data/mockWorkouts";
import { getExercisesWithLastWeight } from "../servises/workoutService";
import { useState } from "react";
import ExerciseCard from "../components/exerciseCard/ExerciseCard";
import Button from "../components/button/Button";
import AddNewExercise from "../components/addNewExercise/AddNewExercise";
import { ExerciseWithLastWeight } from "../types/workoutCard";

type NewExerciseInput = {
  name: string;
  categoryId: number;
  isUsesWeight: boolean;
  defaultWeight?: number;
};

const Exercises: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isAddNewExercise, setIsAddNewExercise] = useState(false);
  const initialExercises = getExercisesWithLastWeight(
    mockCategories,
    mockWorkouts,
    mockExercises,
    mockSets,
    selectedCategory ?? undefined,
  );

  const [exercises, setExercises] =
    useState<ExerciseWithLastWeight[]>(initialExercises);
  const filteredExercises =
    selectedCategory === null
      ? exercises
      : exercises.filter((e) => e.categoryId === selectedCategory);
  const handleAddExercise = (newExercise: NewExerciseInput) => {
    const exerciseToAdd: ExerciseWithLastWeight = {
      id: Date.now(), // временный id на моках
      name: newExercise.name,
      categoryId: newExercise.categoryId,
      categoryName: mockCategories.find((c) => c.id === newExercise.categoryId)
        ?.name,
      lastWeight: newExercise.isUsesWeight
        ? newExercise.defaultWeight
        : undefined,
    };

    setExercises((prev) => [...prev, exerciseToAdd]);
    setIsAddNewExercise(false);
  };
  const exerciseLength = filteredExercises.length;

  function handleDeleteExercsie(id: number): void {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Exercises</IonTitle>
          <div slot="end" className={styles["exercise-counter"]}>
            {exerciseLength} TOTAL
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <main className={styles["workout-page"]}>
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            showAllOption={true}
          />
          {filteredExercises.map((exercise) => (
            <IonItemSliding key={exercise.id}>
              <IonItem className={styles["ion-item"]}>
                <ExerciseCard data={exercise} />
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  className={styles["button-trash"]}
                  color="danger"
                  onClick={() => handleDeleteExercsie(exercise.id)}
                >
                  <IonIcon slot="icon-only" icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
          {isAddNewExercise ? (
            <AddNewExercise
              onClose={() => setIsAddNewExercise(false)}
              onAddExercise={handleAddExercise}
            />
          ) : (
            <Button
              variant="add-exercise"
              children={"+ NEW EXERCISE"}
              onClick={() => setIsAddNewExercise(true)}
            />
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Exercises;
