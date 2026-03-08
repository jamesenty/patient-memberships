import type { MembershipPlan } from "./types";
import styles from "./dashboard.module.css";

type MembershipsTableProps = {
  plans: MembershipPlan[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);

const planAccentClass: Record<string, string> = {
  gold: styles.tierDotGold,
  silver: styles.tierDotSilver,
  bronze: styles.tierDotBronze,
};

export function MembershipsTable({ plans }: MembershipsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Membership Name</th>
            <th>Inclusions</th>
            <th>Patients</th>
            <th>Price</th>
            <th>Monthly Revenue</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => {
            const revenue = plan.patients * plan.monthlyPrice;

            return (
              <tr key={plan.id}>
                <td>
                  <div className={styles.nameCell}>
                    <div className={styles.planNameRow}>
                      <span
                        className={`${styles.tierDot} ${planAccentClass[plan.id] ?? styles.tierDotGold}`}
                        aria-hidden="true"
                      />
                      <span>{plan.name}</span>
                    </div>
                    <span
                      className={`${styles.statusPill} ${plan.isActive ? styles.statusActive : styles.statusInactive}`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td>
                  <ul className={styles.dotList}>
                    {plan.inclusions.map((inclusion) => (
                      <li key={inclusion}>{inclusion}</li>
                    ))}
                  </ul>
                </td>
                <td className={styles.numeric}>{plan.patients}</td>
                <td className={styles.numeric}>{formatCurrency(plan.monthlyPrice)}</td>
                <td className={styles.numeric}>{formatCurrency(revenue)}</td>
                <td>
                  <div className={styles.actionRow}>
                    <button className={styles.actionButton} type="button" title="Set inactive">
                      <span aria-hidden="true">↻</span>
                      <span className={styles.srOnly}>Set inactive</span>
                    </button>
                    <button className={styles.actionButton} type="button" title="Edit membership">
                      <span aria-hidden="true">✎</span>
                      <span className={styles.srOnly}>Edit membership</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
