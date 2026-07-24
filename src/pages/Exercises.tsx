import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
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

const Exercises: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const exerciseData = getExercisesWithLastWeight(
    mockCategories,
    mockWorkouts,
    mockExercises,
    mockSets,
    selectedCategory ?? undefined,
  );
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Exercises</IonTitle>
          <div slot="end" className={styles["exercise-counter"]}>
            13 TOTAL
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <main className={styles["workout-page"]}>
          <IonSearchbar
            placeholder="Search exercises..."
            className={styles["search-bar"]}
          />
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          {exerciseData.map((exercise) => (
            <ExerciseCard key={exercise.id} data={exercise} />
          ))}
          <Button variant="add-exercise" children={"+ NEW EXERCISE"} />
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Exercises;
