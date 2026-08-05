import { useEffect, useRef, useState } from "react";
import { ExerciseWorkoutCard, UpdateSetInput } from "../../types/workoutCard";
import Button from "../button/Button";
import InlineNumberInput from "../inlineNumberInput/InlineNumberInput";
import styles from "./setCard.module.css";
import CheckMark from "../../assets/icons/checkMark.svg?react";
import { trash } from "ionicons/icons";
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from "@ionic/react";

interface SetCardProps {
  data: ExerciseWorkoutCard;
  onAddSet: (exercise: ExerciseWorkoutCard) => void;
  onDeleteSet: (id: number) => void;
  onUpdateSet: (id: number, changes: UpdateSetInput) => void;
}

type EditingField =
  | {
      setId: number;
      field: "reps";
      value: number;
    }
  | {
      setId: number;
      field: "weight";
      value: number | null;
    };

const SetCard = ({
  data,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
}: SetCardProps) => {
  const [editing, setEditing] = useState<EditingField | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setEditing(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSave = (editing: EditingField | null) => {
    if (!editing) return;

    if (editing.field === "reps") {
      onUpdateSet(editing.setId, {
        reps: editing.value,
      });
    } else {
      onUpdateSet(editing.setId, {
        usedWeight: editing.value,
      });
    }

    setEditing(null);
  };

  return (
    <div className={styles["exercise-card"]} ref={cardRef}>
      <div className={styles["header-card"]}>
        <div className={styles["header-card-info"]}>
          <h3>{data.exercise.name}</h3>
          <span className={styles["category"]}>{data.category.name}</span>
        </div>
        {data.exercise.isUsesWeight ? (
          <div className={styles["header-card-weights"]}>
            <div className={styles["weight-stat"]}>
              <span className={styles["stat-label"]}>PR </span>
              <span className={styles["stat-value"]}>
                {data.maxWeight !== null ? `${data.maxWeight}kg` : "-"}
              </span>
            </div>
            <div className={styles["weight-stat"]}>
              <span className={styles["stat-label"]}>last used </span>
              <span className={styles["stat-value"]}>
                {data.lastUsedWeight !== null
                  ? `${data.lastUsedWeight} kg`
                  : "-"}
              </span>
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles["card-content"]}>
        <div className={styles["sets-list"]}>
          {data.sets.map((set) => (
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
                        onEnter={() => handleSave(editing)}
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
                          onEnter={() => handleSave(editing)}
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
                  onClick={() => onDeleteSet(set.id)}
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
            onClick={() => onAddSet(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default SetCard;
