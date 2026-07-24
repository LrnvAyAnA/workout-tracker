// import Button from "../button/Button";
import styles from "./inlineNumberInput.module.css";
// import CheckMark from "../../assets/icons/checkMark.svg?react";

type Props = {
  value: number;
  onFocus?: () => void;
  isVisible: boolean;
  onBlur: () => void;
  onChange: (value: number) => void;
};

const InlineNumberInput = ({
  value,
  isVisible,
  onChange,
  onFocus,
  onBlur,
}: Props) => {
  return (
    <div className={styles["edit-field"]}>
      <div
        className={`${styles["input-value"]} ${isVisible ? styles["active"] : ""}`}
      >
        <input
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) {
              onChange(Number(raw));
            }
          }}
          onFocus={onFocus}
          inputMode="numeric"
          onBlur={onBlur}
        />
      </div>
    </div>
  );
};

export default InlineNumberInput;
