import { ExerciseWithLastWeight } from "../../types/workoutCard";
import styles from "./exerciseCard.module.css";

type ExerciseCardProps = {
  data: ExerciseWithLastWeight;
};

const ExerciseCard = ({ data }: ExerciseCardProps) => {
  return (
    <div className={styles["exercise-card"]}>
      <div className={styles["exercise-info"]}>
        <h3 className={styles["exercise-name"]}>{data.name}</h3>
        <span className={styles["category"]}>{data.categoryName}</span>
      </div>
      {data.isUsesWeight ? (
        <div className={styles["info"]}>
          <div className={styles["weight-info"]}>
            <span className={styles["last-used"]}>last used</span>
            <span className={styles["used-weight"]}>
              {data.lastWeight}
              <span className={styles["unit"]}>
                {data.lastWeight ? " kg" : "-"}
              </span>
            </span>
          </div>
          <div className={styles["weight-info"]}>
            <span className={styles["last-used"]}>default</span>
            <span className={styles["used-weight"]}>
              {data.defaultWeight}
              <span className={styles["unit"]}>kg</span>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExerciseCard;
