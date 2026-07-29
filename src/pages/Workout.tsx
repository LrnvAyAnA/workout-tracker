import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./workout.module.css";
import Calendar from "../components/calendar/Calendar";
import SetCard from "../components/setCard/SetCard";
import Button from "../components/button/Button";
import { useEffect, useState } from "react";
import AddExerciseSheet from "../components/addExerciseSheet/AddExerciseSheet";
import { ExerciseWithLastWeight, WorkoutDetails } from "../types/workoutCard";
import {
  createWorkout,
  getWorkoutDetailsByDate,
} from "../database/repositories/workoutRepository";

const Workout: React.FC = () => {
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getWorkoutDetailsByDate(today).then(setWorkout);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleAddExercise(exercise: ExerciseWithLastWeight) {
    //  let workoutId = workout?.workout.id;

    //   if (!workoutId) {
    //     const newWorkout = await createWorkout(today);

    //     workoutId = newWorkout?.id;
    //   }

    //   await addExerciseToWorkout(workoutId, exercise);

    //   const updatedWorkout = await getWorkoutDetailsByDate(today);
    //   setWorkout(updatedWorkout);

    setIsModalOpen(false);
  }

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
            <span className={styles["count-exercises"]}>
              {workout?.exercises.length ?? 0} exercises
            </span>
          </div>
          {workout?.exercises.map((data) => (
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
            workoutExercises={workout?.exercises ?? []}
          />
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Workout;
