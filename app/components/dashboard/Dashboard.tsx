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

  const planCount = membershipPlans.length;
  const memberCount = useMemo(
    () => membershipPlans.reduce((sum, plan) => sum + plan.patients, 0),
    [],
  );
  const monthlyRevenue = useMemo(
    () => membershipPlans.reduce((sum, plan) => sum + plan.patients * plan.monthlyPrice, 0),
    [],
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
            <MembershipsTable plans={membershipPlans} />
          ) : (
            <MembersTable members={members} />
          )}
        </section>
      </div>
    </main>
  );
}
