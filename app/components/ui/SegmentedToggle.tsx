import styles from "./ui.module.css";

type Option<T extends string> = {
  id: T;
  label: string;
};

type SegmentedToggleProps<T extends string> = {
  ariaLabel: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedToggle<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: SegmentedToggleProps<T>) {
  return (
    <div className={styles.segmented} role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={option.id === value}
          className={option.id === value ? styles.segmentedActive : styles.segmentedButton}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
