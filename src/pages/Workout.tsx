import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./workout.module.css";
import Calendar from "../components/calendar/Calendar";
import { getWorkoutExercises } from "../servises/workoutService";
import { mockCategories } from "../data/mockCategories";
import { mockExercises } from "../data/mockExercises";
import { mockSets } from "../data/mockSets";
import SetCard from "../components/setCard/SetCard";
import Button from "../components/button/Button";
import { useState } from "react";
import AddExerciseSheet from "../components/addExerciseSheet/AddExerciseSheet";
import {
  ExerciseWithLastWeight,
  ExerciseWorkoutCard,
} from "../types/workoutCard";

const Workout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exerciseData = getWorkoutExercises(
    2,
    mockExercises,
    mockSets,
    mockCategories,
  );

  const [workoutExercises, setWorkoutExercises] =
    useState<ExerciseWorkoutCard[]>(exerciseData);

  const handleAddExercise = (exercise: ExerciseWithLastWeight) => {
    const category = mockCategories.find((c) => c.id === exercise.categoryId);
    const newWorkoutExercise: ExerciseWorkoutCard = {
      exercise: {
        id: exercise.id,
        name: exercise.name,
        categoryId: exercise.categoryId,
      },
      category: category!,
      sets: [
        {
          id: Date.now(),
          exerciseId: exercise.id,
          workoutId: 0,
          reps: 0,
          usedWeight: 0,
        },
      ],
    };
    setWorkoutExercises((prev) => [...prev, newWorkoutExercise]);
    setIsModalOpen(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Workouts</IonTitle>
          <div slot="end" className={styles["logged-exercises"]}>
            6 logged
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <main className={styles["workout-page"]}>
          <Calendar />
          <div className={styles["day-info"]}>
            <h2 className={styles["selected-day"]}>Today</h2>
            <span className={styles["count-exercises"]}>3 exercises</span>
          </div>
          {workoutExercises.map((data) => (
            <SetCard key={data.exercise.id} data={data} />
          ))}
          <Button
            variant="add-exercise"
            children={"+ ADD EXERCISE"}
            onClick={() => setIsModalOpen(true)}
          />
          <AddExerciseSheet
            onClose={() => setIsModalOpen(false)}
            isOpen={isModalOpen}
            handleSelectExercise={handleAddExercise}
            workoutExercises={workoutExercises}
          />
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Workout;
