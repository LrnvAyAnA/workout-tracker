import { IonButton, IonDatetime, IonIcon } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import "./calendar.css";
import { useState } from "react";
// type Props = {}

function Calendar() {
  const [value, setValue] = useState(new Date().toISOString());

  const currentDate = new Date(value);
  const monthLabel = currentDate.toLocaleDateString("en-EN", {
    month: "long",
    year: "numeric",
  });

  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setValue(newDate.toISOString());
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setValue(newDate.toISOString());
  };

  return (
    <div className="calendar">
      <div className="custom-calendar-header">
        <IonButton
          fill="clear"
          className="calendar-btn"
          onClick={goToPrevMonth}
        >
          <IonIcon icon={chevronBack} slot="icon-only" />
        </IonButton>
        <span className="calendar-month-label">{monthLabel}</span>
        <IonButton
          fill="clear"
          className="calendar-btn"
          onClick={goToNextMonth}
        >
          <IonIcon icon={chevronForward} slot="icon-only" />
        </IonButton>
      </div>
      <IonDatetime
        presentation="date"
        locale="en-EN"
        mode="md"
        highlightedDates={[
          {
            date: "2026-07-12",
            border: "1px dashed var(--color-accent)",
          },
        ]}
        value={value}
        onIonChange={(e) => setValue(String(e.detail.value))}
      ></IonDatetime>
    </div>
  );
}

export default Calendar;
