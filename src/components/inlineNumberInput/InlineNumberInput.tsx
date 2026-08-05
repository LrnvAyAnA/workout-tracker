import styles from "./inlineNumberInput.module.css";

type Props = {
  value: number | null;
  onFocus?: () => void;
  isVisible: boolean;
  onChange: (value: number) => void;
  onEnter?: () => void;
};

const InlineNumberInput = ({
  value,
  isVisible,
  onChange,
  onFocus,
  onEnter,
}: Props) => {
  return (
    <div className={styles["edit-field"]}>
      <div
        className={`${styles["input-value"]} ${isVisible ? styles["active"] : ""}`}
      >
        <input
          value={value ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (/^\d*$/.test(raw)) {
              onChange(Number(raw));
            }
          }}
          onFocus={onFocus}
          inputMode="numeric"
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) {
              e.preventDefault();
              onEnter();
            }
          }}
        />
      </div>
    </div>
  );
};

export default InlineNumberInput;
