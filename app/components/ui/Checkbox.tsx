import styles from "./ui.module.css";

type CheckboxProps = {
  checked: boolean;
  ariaLabel: string;
  onChange: () => void;
};

export function Checkbox({ checked, ariaLabel, onChange }: CheckboxProps) {
  return (
    <label className={styles.checkboxRoot} aria-label={ariaLabel}>
      <input type="checkbox" checked={checked} onChange={onChange} className={styles.checkboxInput} />
      <span className={styles.checkboxControl} aria-hidden="true" />
    </label>
  );
}
