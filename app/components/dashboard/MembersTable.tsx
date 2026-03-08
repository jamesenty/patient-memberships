import type { MemberRecord } from "./types";
import styles from "./dashboard.module.css";

type MemberDrawerMode = "snapshot" | "manage";

type MembersTableProps = {
  members: MemberRecord[];
  onOpenMember: (memberId: string, mode: MemberDrawerMode) => void;
};

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

function getMemberStatusPresentation(status: MemberRecord["membershipStatus"]) {
  if (status === "paused") {
    return { label: "Paused", className: styles.statusPaused };
  }

  if (status === "cancelled") {
    return { label: "Cancelled", className: styles.statusInactive };
  }

  return { label: "Active", className: styles.statusActive };
}

export function MembersTable({ members, onOpenMember }: MembersTableProps) {
  return (
    <>
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.membersTable}`}>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Plan Name</th>
              <th>Next Payment Date</th>
              <th>Current Plan Paid</th>
              <th>Lifetime Value</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const status = getMemberStatusPresentation(member.membershipStatus);

              return (
                <tr key={member.id}>
                  <td>
                    <div className={styles.tableIdentity}>
                      <span className={styles.tablePrimaryText}>{member.patientName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.tablePrimaryText}>{member.planName}</span>
                  </td>
                  <td>
                    <span className={styles.tablePrimaryText}>{member.nextPaymentDate}</span>
                  </td>
                  <td className={styles.numeric}>{formatCurrency(member.paidToDate)}</td>
                  <td className={styles.numeric}>{formatCurrency(member.lifetimeValue)}</td>
                  <td>
                    <div className={styles.tableIdentity}>
                      <span className={`${styles.statusPill} ${status.className}`}>{status.label}</span>
                      <span className={styles.memberStatusMeta}>{member.term}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionRow}>
                      <button
                        type="button"
                        className={styles.actionPill}
                        onClick={() => onOpenMember(member.id, "snapshot")}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className={styles.actionPill}
                        onClick={() => onOpenMember(member.id, "manage")}
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileCards}>
        {members.map((member) => {
          const status = getMemberStatusPresentation(member.membershipStatus);

          return (
            <article key={`member-card-${member.id}`} className={styles.mobileCard}>
              <div className={styles.mobileCardHeader}>
                <div className={styles.mobileIdentity}>
                  <p className={styles.mobileSectionLabel}>Patient</p>
                  <h3 className={styles.mobileCardTitle}>{member.patientName}</h3>
                  <span className={`${styles.statusPill} ${status.className}`}>{status.label}</span>
                </div>
                <span className={styles.mobilePlanBadge}>{member.planName}</span>
              </div>

              <dl className={styles.mobileMetaGrid}>
                <div className={styles.mobileMetaItem}>
                  <dt>Next Payment</dt>
                  <dd>{member.nextPaymentDate}</dd>
                </div>
                <div className={styles.mobileMetaItem}>
                  <dt>Current Plan Paid</dt>
                  <dd>{formatCurrency(member.paidToDate)}</dd>
                </div>
                <div className={styles.mobileMetaItem}>
                  <dt>Lifetime Value</dt>
                  <dd>{formatCurrency(member.lifetimeValue)}</dd>
                </div>
                <div className={styles.mobileMetaItem}>
                  <dt>Status</dt>
                  <dd>
                    <div className={styles.mobileStatusStack}>
                      <span className={styles.memberStatusMeta}>{member.term}</span>
                    </div>
                  </dd>
                </div>
              </dl>

              <div className={styles.mobileActions}>
                <button
                  type="button"
                  className={styles.memberCardAction}
                  onClick={() => onOpenMember(member.id, "snapshot")}
                >
                  View
                </button>
                <button
                  type="button"
                  className={styles.memberCardAction}
                  onClick={() => onOpenMember(member.id, "manage")}
                >
                  Manage
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
