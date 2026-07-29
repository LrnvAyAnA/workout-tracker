import { useState } from "react";
import { ExerciseWorkoutCard } from "../../types/workoutCard";
import Button from "../button/Button";
import InlineNumberInput from "../inlineNumberInput/InlineNumberInput";
import styles from "./setCard.module.css";
import CheckMark from "../../assets/icons/checkMark.svg?react";
import { trash } from "ionicons/icons";
import { Set } from "../../types/workout";
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from "@ionic/react";

interface SetCardProps {
  data: ExerciseWorkoutCard;
}

type EditingField = {
  setId: number;
  field: "reps" | "weight";
  value: number;
};

const SetCard = ({ data }: SetCardProps) => {
  const [sets, setSets] = useState<Set[]>(data.sets);

  const [editing, setEditing] = useState<EditingField | null>(null);
  const [invalidSetId, setInvalidSetId] = useState<number | null>(null);
  const handleUpdateReps = (setId: number, newReps: number) => {
    console.log("newReps", newReps);
    setSets((prev) =>
      prev.map((set) => (set.id === setId ? { ...set, reps: newReps } : set)),
    );
  };

  const handleUpdateWeight = (setId: number, newWeight: number) => {
    setSets((prev) =>
      prev.map((set) =>
        set.id === setId ? { ...set, usedWeight: newWeight } : set,
      ),
    );
    console.log("newWeight", newWeight);
  };

  const handleAddSet = () => {
    const lastSet = sets.at(-1);

    const initialWeight = data.exercise.defaultWeight;
    console.log(data.exercise);
    const initialReps = lastSet?.reps ?? 0;

    const newSet: Set = {
      id: Date.now(),
      exerciseId: data.exercise.id,
      workoutId: lastSet?.workoutId ?? 0,
      reps: initialReps,
      usedWeight: initialWeight ?? 0,
    };

    setSets((prevSets) => [...prevSets, newSet]);
  };

  const handleDeleteSet = (setId: number) => {
    setSets((prevSets) => prevSets.filter((s) => s.id !== setId));
  };

  const handleSave = (editing: EditingField | null) => {
    if (editing) {
      if (editing.field == "reps") {
        handleUpdateReps(editing.setId, editing.value);
      } else {
        handleUpdateWeight(editing.setId, editing.value);
      }
    }
    setEditing(null);
  };

  return (
    <div className={styles["exercise-card"]}>
      <div className={styles["header-card"]}>
        <div className={styles["header-card-info"]}>
          <h3>{data.exercise.name}</h3>
          <span className={styles["category"]}>{data.category.name}</span>
        </div>
        <div className={styles["header-card-weights"]}>
          <span>
            max cur weight <span className="unit"> kg</span>
          </span>
          <span>
            max prev weight <span className="unit"> kg</span>
          </span>
        </div>
      </div>
      <div className={styles["card-content"]}>
        <div className={styles["sets-list"]}>
          {sets.map((set) => (
            <IonItemSliding key={set.id}>
              <IonItem className={styles["set-item"]}>
                <div className={styles["card-field"]}>
                  <div className={styles["set-reps"]}>
                    <span className={styles["number-reps"]}>
                      <InlineNumberInput
                        value={
                          editing?.setId === set.id && editing.field === "reps"
                            ? editing.value
                            : set.reps
                        }
                        isVisible={
                          editing?.setId === set.id && editing.field === "reps"
                        }
                        onFocus={() =>
                          setEditing({
                            setId: set.id,
                            field: "reps",
                            value: set.reps,
                          })
                        }
                        onBlur={() => {
                          setTimeout(() => {
                            setEditing(null);
                          }, 150);
                        }}
                        onChange={(newValue) =>
                          setEditing({
                            setId: set.id,
                            field: "reps",
                            value: newValue,
                          })
                        }
                      />
                    </span>
                    <span className={styles["text-reps"]}>
                      {editing?.setId === set.id && editing.field === "reps" ? (
                        <Button
                          variant="icon"
                          onClick={() => handleSave(editing)}
                        >
                          <CheckMark width={16} height={16} />
                        </Button>
                      ) : (
                        "reps"
                      )}
                    </span>
                  </div>
                  {data.exercise.isUsesWeight ? (
                    <div className={styles["set-weight"]}>
                      <span className={styles["number-weight"]}>
                        <InlineNumberInput
                          value={
                            editing?.setId === set.id &&
                            editing.field === "weight"
                              ? editing.value
                              : set.usedWeight
                          }
                          isVisible={
                            editing?.setId === set.id &&
                            editing.field === "weight"
                          }
                          onFocus={() => {
                            setEditing({
                              setId: set.id,
                              field: "weight",
                              value: set.usedWeight,
                            });
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setEditing(null);
                            }, 150);
                          }}
                          onChange={(newValue) =>
                            setEditing({
                              setId: set.id,
                              value: newValue,
                              field: "weight",
                            })
                          }
                        />
                      </span>
                      <span className={styles["text-weight"]}>
                        {editing?.setId === set.id &&
                        editing.field === "weight" ? (
                          <Button
                            variant="icon"
                            onClick={() => handleSave(editing)}
                          >
                            <CheckMark width={16} height={16} />
                          </Button>
                        ) : (
                          "kg"
                        )}
                      </span>
                    </div>
                  ) : null}
                </div>
              </IonItem>

              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={() => handleDeleteSet(set.id)}
                >
                  <IonIcon slot="icon-only" icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </div>
        <div className={styles["button-bar"]}>
          <Button
            variant="add-set"
            children="+ add set"
            onClick={handleAddSet}
          />
        </div>
      </div>
    </div>
  );
};

export default SetCard;
