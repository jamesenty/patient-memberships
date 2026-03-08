import styles from "./ui.module.css";

type CheckboxProps = {
  checked: boolean;
  ariaLabel: string;
  onChange: () => void;
  type?: "checkbox" | "radio";
};

export function Checkbox({ checked, ariaLabel, onChange, type = "checkbox" }: CheckboxProps) {
  return (
    <label className={styles.checkboxRoot} aria-label={ariaLabel}>
      <input type={type} checked={checked} onChange={onChange} className={styles.checkboxInput} />
      <span
        className={type === "radio" ? styles.radioControl : styles.checkboxControl}
        aria-hidden="true"
      />
    </label>
  );
}
