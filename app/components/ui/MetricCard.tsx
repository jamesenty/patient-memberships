import styles from "./ui.module.css";

type MetricIcon = "plans" | "patients" | "revenue";

type MetricCardProps = {
  label: string;
  value: string | number;
  tone: "plans" | "patients" | "revenue";
  icon: MetricIcon;
};

function MetricIconGlyph({ icon }: { icon: MetricIcon }) {
  if (icon === "plans") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M3 5h14v3H3zm0 5h14v3H3z" />
      </svg>
    );
  }

  if (icon === "patients") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 7a6 6 0 0 1 12 0H4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm1 10H9V7h2v6Z" />
    </svg>
  );
}

export function MetricCard({ label, value, tone, icon }: MetricCardProps) {
  const toneClass =
    tone === "plans"
      ? styles.metricTonePlans
      : tone === "patients"
        ? styles.metricTonePatients
        : styles.metricToneRevenue;

  return (
    <div className={`${styles.metricCard} ${toneClass}`}>
      <div className={styles.metricTop}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricIcon} aria-hidden="true">
          <MetricIconGlyph icon={icon} />
        </span>
      </div>
      <span className={styles.metricValue}>{value}</span>
    </div>
  );
}
