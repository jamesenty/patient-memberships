"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MembersTable } from "./MembersTable";
import { MembershipsTable } from "./MembershipsTable";
import { members, membershipPlans } from "./sample-data";
import { MetricCard } from "../ui/MetricCard";
import { SegmentedToggle } from "../ui/SegmentedToggle";
import styles from "./dashboard.module.css";

type TabId = "memberships" | "members";

const tabs: { id: TabId; label: string }[] = [
  { id: "memberships", label: "Memberships" },
  { id: "members", label: "Members" },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("memberships");
  const [plans, setPlans] = useState(membershipPlans);
  const [pendingPlan, setPendingPlan] = useState<(typeof membershipPlans)[number] | null>(null);

  const planCount = plans.length;
  const memberCount = useMemo(
    () => plans.filter((plan) => plan.isActive).reduce((sum, plan) => sum + plan.patients, 0),
    [plans],
  );
  const monthlyRevenue = useMemo(
    () =>
      plans
        .filter((plan) => plan.isActive)
        .reduce((sum, plan) => sum + plan.patients * plan.monthlyPrice, 0),
    [plans],
  );

  const formattedMonthlyRevenue = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(monthlyRevenue);

  const metrics = [
    { id: "plans", label: "Membership Plans", value: planCount, tone: "plans", icon: "plans" },
    {
      id: "patients",
      label: "Patients on Plans",
      value: memberCount,
      tone: "patients",
      icon: "patients",
    },
    {
      id: "revenue",
      label: "Monthly Membership Revenue",
      value: formattedMonthlyRevenue,
      tone: "revenue",
      icon: "revenue",
    },
  ] as const;

  const confirmTogglePlanStatus = () => {
    if (!pendingPlan) {
      return;
    }

    setPlans((current) =>
      current.map((plan) =>
        plan.id === pendingPlan.id ? { ...plan, isActive: !plan.isActive } : plan,
      ),
    );
    setPendingPlan(null);
  };

  return (
    <main className={styles.page}>
      <div className={styles.surface}>
        <header className={styles.header}>
          <div>
            <h1>Membership Builder</h1>
            <p>Define membership offerings and monitor active members.</p>
          </div>
          <Link className={styles.ctaButton} href="/memberships/new">
            Create Membership
          </Link>
        </header>

        <section className={styles.metaRow} aria-label="Overview metrics">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              tone={metric.tone}
              icon={metric.icon}
            />
          ))}
        </section>

        <section className={styles.tabSection}>
          <SegmentedToggle
            ariaLabel="Membership and member records"
            options={tabs}
            value={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === "memberships" ? (
            <MembershipsTable
              plans={plans}
              pendingPlanId={pendingPlan?.id ?? null}
              onTogglePlanStatus={setPendingPlan}
            />
          ) : (
            <MembersTable members={members} />
          )}
        </section>
      </div>

      {pendingPlan ? (
        <div className={styles.confirmOverlay} role="dialog" aria-modal="true" aria-label="Confirm membership status change">
          <div className={styles.confirmCard}>
            <div className={styles.confirmHeader}>
              <p className={styles.confirmEyebrow}>Membership Status</p>
              <h2>{pendingPlan.isActive ? "Pause this membership?" : "Resume this membership?"}</h2>
            </div>
            <p className={styles.confirmText}>
              {pendingPlan.isActive
                ? `Patients on ${pendingPlan.name} will keep their current history, but future membership charges and renewals will stop until you turn it back on.`
                : `${pendingPlan.name} will start accepting recurring membership charges again and return to your active membership totals.`}
            </p>
            <div className={styles.confirmMeta}>
              <span>{pendingPlan.patients} patients</span>
              <span>
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD",
                  maximumFractionDigits: 0,
                }).format(pendingPlan.monthlyPrice)}
                {" / month"}
              </span>
            </div>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmSecondary} onClick={() => setPendingPlan(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmPrimary}
                onClick={confirmTogglePlanStatus}
              >
                {pendingPlan.isActive ? "Pause Membership" : "Resume Membership"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
