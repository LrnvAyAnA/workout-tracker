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
import {
  ExerciseWithLastWeight,
  ExerciseWorkoutCard,
  UpdateSetInput,
  WorkoutDetails,
} from "../types/workoutCard";
import {
  addExerciseToWorkout,
  createWorkout,
  getAllWorkouts,
  getWorkoutDetailsByDate,
  updateWorkoutStatus,
} from "../database/repositories/workoutRepository";
import {
  addSet,
  deleteSetFromWorkout,
  updateSet,
} from "../database/repositories/setRepository";
import { WorkoutType } from "../types/workout";
import { formatSelectedDate, getLocalDate } from "../utils/date";

const Workout: React.FC = () => {
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [selectedDate, setSelectedDate] = useState(getLocalDate());

  useEffect(() => {
    getWorkoutDetailsByDate(selectedDate).then(async (details) => {
      if (
        details &&
        details.workout.status === "planned" &&
        details.workout.date <= getLocalDate()
      ) {
        await updateWorkoutStatus(details.workout.id, "completed");
        const updated = await getWorkoutDetailsByDate(selectedDate);
        setWorkout(updated);
      } else {
        setWorkout(details);
      }
    });
    getAllWorkouts().then(setWorkouts);
  }, [selectedDate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshAfterMutation = async () => {
    const [details, all] = await Promise.all([
      getWorkoutDetailsByDate(selectedDate),
      getAllWorkouts(),
    ]);
    setWorkout(details);
    setWorkouts(all);
  };

  async function handleAddExercise(exercise: ExerciseWithLastWeight) {
    let workoutId = workout?.workout.id;

    if (!workoutId) {
      const newWorkout = await createWorkout(selectedDate);

      if (!newWorkout?.id) return;

      workoutId = newWorkout.id;
    }

    await addExerciseToWorkout(workoutId, exercise);
    await refreshAfterMutation();
    setIsModalOpen(false);
  }

  const handleAddSet = async (exercise: ExerciseWorkoutCard) => {
    const lastSet = exercise.sets[exercise.sets.length - 1];

    console.log(lastSet);
    await addSet({
      exerciseId: exercise.exercise.id,
      workoutId: workout!.workout.id,
      reps: lastSet.reps,
      usedWeight: exercise.exercise.isUsesWeight
        ? lastSet
          ? lastSet.usedWeight
          : exercise.exercise.defaultWeight
        : null,
    });
    await refreshAfterMutation();
  };

  const handleUpdateSet = async (setId: number, changes: UpdateSetInput) => {
    await updateSet(setId, changes);
    await refreshAfterMutation();
  };

  const handleDeleteSet = async (setId: number) => {
    await deleteSetFromWorkout(setId);
    await refreshAfterMutation();
  };
  const isToday = selectedDate === getLocalDate();
  const monthPrefix = selectedDate.slice(0, 7);
  const workoutsThisMonth = workouts.filter((w) =>
    w.date.startsWith(monthPrefix),
  ).length;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Workouts</IonTitle>
          <div slot="end" className={styles["logged-exercises"]}>
            {workoutsThisMonth} logged
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <main className={styles["workout-page"]}>
          <Calendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            workouts={workouts}
          />
          <div className={styles["day-info"]}>
            <h2 className={styles["selected-day"]}>
              {isToday ? "Today" : formatSelectedDate(selectedDate)}
            </h2>
            <span className={styles["count-exercises"]}>
              {workout?.exercises.length ?? 0} exercises
            </span>
          </div>
          {workout?.exercises.map((data) => (
            <SetCard
              key={data.exercise.id}
              data={data}
              onAddSet={handleAddSet}
              onUpdateSet={handleUpdateSet}
              onDeleteSet={handleDeleteSet}
            />
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
