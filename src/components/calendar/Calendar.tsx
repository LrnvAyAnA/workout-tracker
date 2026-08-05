import { IonDatetime } from "@ionic/react";
import "./calendar.css";
import { WorkoutType } from "../../types/workout";
type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  workouts: WorkoutType[];
};

function Calendar({ selectedDate, onDateChange, workouts }: Props) {
  // const currentDate = new Date(selectedDate);
  // const monthLabel = currentDate.toLocaleDateString("en-EN", {
  //   month: "long",
  //   year: "numeric",
  // });

  // const goToPrevMonth = () => {
  //   const newDate = new Date(currentDate);
  //   newDate.setMonth(newDate.getMonth() - 1);
  //   onDateChange(newDate.toISOString().split("T")[0]);
  // };

  // const goToNextMonth = () => {
  //   const newDate = new Date(currentDate);
  //   newDate.setMonth(newDate.getMonth() + 1);
  //   onDateChange(newDate.toISOString().split("T")[0]);
  // };

  const highlightedDates = workouts.map((w) => ({
    date: w.date,
    border: "1px dashed var(--color-accent)",
  }));

  return (
    <div className="calendar">
      <IonDatetime
        presentation="date"
        locale="en-EN"
        mode="md"
        highlightedDates={highlightedDates}
        value={selectedDate}
        onIonChange={(e) => {
          const val = String(e.detail.value);
          if (val) onDateChange(val.split("T")[0]);
        }}
      ></IonDatetime>
    </div>
  );
}

export default Calendar;
