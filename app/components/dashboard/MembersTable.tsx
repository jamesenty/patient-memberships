import type { MemberRecord } from "./types";
import styles from "./dashboard.module.css";

type MembersTableProps = {
  members: MemberRecord[];
};

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.membersTable}`}>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Plan Name</th>
            <th>Next Payment Date</th>
            <th>Paid to Date</th>
            <th>Term</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.patientName}</td>
              <td>{member.planName}</td>
              <td>{member.nextPaymentDate}</td>
              <td>{formatCurrency(member.paidToDate)}</td>
              <td>{member.term}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
