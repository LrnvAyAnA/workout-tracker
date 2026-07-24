import { IonButton } from "@ionic/react";
import styles from "./button.module.css";

type ButtonProps = {
  variant?: "add-exercise" | "add-set" | "icon" | "chip" | "chip-active";
  children: React.ReactNode;
  onClick?: () => void;
};

const Button = ({ variant, children, onClick }: ButtonProps) => {
  return (
    <IonButton onClick={onClick} className={styles[`button-${variant}`]}>
      {children}
    </IonButton>
  );
};

export default Button;
