import Link from "next/link";
import type { MembershipPlan } from "./types";
import styles from "./dashboard.module.css";

type MembershipsTableProps = {
  plans: MembershipPlan[];
  pendingPlanId?: string | null;
  onTogglePlanStatus: (plan: MembershipPlan) => void;
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

export function MembershipsTable({
  plans,
  pendingPlanId = null,
  onTogglePlanStatus,
}: MembershipsTableProps) {
  return (
    <>
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
                <tr key={plan.id} className={!plan.isActive ? styles.inactiveRow : undefined}>
                  <td>
                    <div className={styles.tableIdentity}>
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
                        <li key={inclusion.id}>{inclusion.label}</li>
                      ))}
                    </ul>
                  </td>
                  <td className={styles.numeric}>{plan.patients}</td>
                  <td className={styles.numeric}>{formatCurrency(plan.monthlyPrice)}</td>
                  <td className={styles.numeric}>{formatCurrency(revenue)}</td>
                  <td>
                    <div className={styles.actionRow}>
                      <button
                        className={`${styles.actionPill} ${
                          plan.isActive ? styles.actionPillPause : styles.actionPillResume
                        }`}
                        type="button"
                        title={plan.isActive ? "Pause membership" : "Resume membership"}
                        onClick={() => onTogglePlanStatus(plan)}
                        disabled={pendingPlanId === plan.id}
                      >
                        <span aria-hidden="true" className={styles.actionIcon}>
                          {plan.isActive ? "⏸" : "↺"}
                        </span>
                        <span>{plan.isActive ? "Pause" : "Resume"}</span>
                        <span className={styles.srOnly}>
                          {plan.isActive ? "Pause membership" : "Resume membership"}
                        </span>
                      </button>
                      <Link
                        className={styles.actionPill}
                        href={`/memberships/${plan.id}`}
                        title="Edit membership"
                      >
                        <span aria-hidden="true" className={styles.actionIcon}>
                          ✎
                        </span>
                        <span>Edit</span>
                        <span className={styles.srOnly}>Edit membership</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileCards}>
        {plans.map((plan) => {
          const revenue = plan.patients * plan.monthlyPrice;

          return (
            <article
              key={`card-${plan.id}`}
              className={`${styles.mobileCard} ${!plan.isActive ? styles.mobileCardInactive : ""}`}
            >
              <div className={styles.mobileCardHeader}>
                <div className={styles.mobileIdentity}>
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
                <div className={styles.mobileActions}>
                  <button
                    className={`${styles.actionPill} ${
                      plan.isActive ? styles.actionPillPause : styles.actionPillResume
                    }`}
                    type="button"
                    onClick={() => onTogglePlanStatus(plan)}
                    disabled={pendingPlanId === plan.id}
                  >
                    <span aria-hidden="true" className={styles.actionIcon}>
                      {plan.isActive ? "⏸" : "↺"}
                    </span>
                    <span>{plan.isActive ? "Pause" : "Resume"}</span>
                  </button>
                  <Link className={styles.actionPill} href={`/memberships/${plan.id}`}>
                    <span aria-hidden="true" className={styles.actionIcon}>
                      ✎
                    </span>
                    <span>Edit</span>
                  </Link>
                </div>
              </div>

              <dl className={styles.mobileMetaGrid}>
                <div className={styles.mobileMetaItem}>
                  <dt>Patients</dt>
                  <dd>{plan.patients}</dd>
                </div>
                <div className={styles.mobileMetaItem}>
                  <dt>Price</dt>
                  <dd>{formatCurrency(plan.monthlyPrice)}</dd>
                </div>
                <div className={styles.mobileMetaItem}>
                  <dt>Revenue</dt>
                  <dd>{formatCurrency(revenue)}</dd>
                </div>
              </dl>

              <div className={styles.mobileSection}>
                <p className={styles.mobileSectionLabel}>Inclusions</p>
                <ul className={styles.mobileList}>
                  {plan.inclusions.map((inclusion) => (
                    <li key={`mobile-${plan.id}-${inclusion.id}`}>{inclusion.label}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
