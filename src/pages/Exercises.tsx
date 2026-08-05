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
  useIonViewWillEnter,
} from "@ionic/react";
import { trash } from "ionicons/icons";

import styles from "./exercises.module.css";
import CategoryBar from "../components/categoryBar/CategoryBar";
import { useCallback, useEffect, useState } from "react";
import ExerciseCard from "../components/exerciseCard/ExerciseCard";
import Button from "../components/button/Button";
import ExerciseForm from "../components/exerciseForm/ExerciseForm";
import { ExerciseWithLastWeight } from "../types/workoutCard";
// import { DebugDatabase } from "../components/debugScreen";
import {
  createExercise,
  deleteExercise,
  editExercise,
  getExercisesWithLastWeight,
} from "../database/repositories/exerciseRepository";
import { CreateExerciseInput } from "../types/exercise";
import { Category, Exercise } from "../types/workout";
import { getCategories } from "../database/repositories/categoryRepository";

const Exercises: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<ExerciseWithLastWeight[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [isAddNewExercise, setIsAddNewExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useIonViewWillEnter(() => {
    loadCategories();
    loadExercises();
  });

  async function loadCategories() {
    const data = await getCategories();
    console.log("categories loaded:", data);
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
  const handleAddExercise = async (newExercise: CreateExerciseInput) => {
    await createExercise(newExercise);

    await loadExercises();

    setIsAddNewExercise(false);
  };
  const exerciseLength = exercises.length;

  const handleEditExercise = async (editedExercise: CreateExerciseInput) => {
    if (!editingExercise) return;

    await editExercise(editingExercise.id, editedExercise);

    await loadExercises();

    setEditingExercise(null);
  };

  async function handleDeleteExercise(id: number) {
    await deleteExercise(id);
    await loadExercises();
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
        <main className={styles["exercise-page"]}>
          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            showAllOption={true}
          />
          {exercises.map((exercise) => (
            <IonItemSliding key={exercise.id}>
              <IonItem
                className={styles["ion-item"]}
                onClick={() => setEditingExercise(exercise)}
              >
                <ExerciseCard data={exercise} />
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  className={styles["button-trash"]}
                  color="danger"
                  onClick={() => handleDeleteExercise(exercise.id)}
                >
                  <IonIcon slot="icon-only" icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
          {editingExercise ? (
            <ExerciseForm
              mode="edit"
              initialValues={editingExercise}
              onSubmit={handleEditExercise}
              onClose={() => setEditingExercise(null)}
            />
          ) : isAddNewExercise ? (
            <ExerciseForm
              mode="create"
              initialValues={{
                categoryId: selectedCategory,
                name: "",
                isUsesWeight: false,
                defaultWeight: null,
              }}
              onSubmit={handleAddExercise}
              onClose={() => setIsAddNewExercise(false)}
            />
          ) : (
            <Button
              variant="add-exercise"
              onClick={() => setIsAddNewExercise(true)}
            >
              + NEW EXERCISE
            </Button>
          )}
        </main>
        {/* <DebugDatabase /> */}
      </IonContent>
    </IonPage>
  );
};

export default Exercises;
