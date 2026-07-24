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

const Workout: React.FC = () => {
  const exerciseData = getWorkoutExercises(
    1,
    mockExercises,
    mockSets,
    mockCategories,
  );
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
          {exerciseData.map((data) => (
            <SetCard key={data.exercise.id} data={data} />
          ))}
          <Button variant="add-exercise" children={"+ ADD EXERCISE"} />
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Workout;
