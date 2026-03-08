"use client";

import { useState } from "react";
import { SegmentedToggle } from "../ui/SegmentedToggle";
import type { MemberActivity, MemberBenefit, MemberRecord } from "./types";
import { getMembershipPlanById } from "./sample-data";
import styles from "./dashboard.module.css";

type MemberDetailPaneProps = {
  member: MemberRecord;
  initialMode?: DrawerMode;
  onClose?: () => void;
};

type PaymentActivity = Exclude<MemberActivity["type"], "benefit">;
type DrawerMode = "snapshot" | "manage";

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const drawerModes: { id: DrawerMode; label: string }[] = [
  { id: "snapshot", label: "Snapshot" },
  { id: "manage", label: "Manage" },
];

const activityBadgeCopy: Record<PaymentActivity, string> = {
  "membership-payment": "Membership payment",
  "additional-payment": "Additional spend",
};

const activityBadgeClass: Record<PaymentActivity, string> = {
  "membership-payment": styles.activityMembership,
  "additional-payment": styles.activityAdditional,
};

const carryoverCopy: Record<MemberBenefit["carryover"], string> = {
  accrues: "Carries forward",
  resets: "Resets each cycle",
  "non-stacking": "Does not stack",
};

const carryoverTooltip: Record<MemberBenefit["carryover"], string> = {
  accrues: "Unused balance keeps building until it is redeemed or the membership ends.",
  resets: "Unused entitlement does not roll over and becomes available again on the next cycle.",
  "non-stacking": "This benefit stays active, but it does not accumulate into a larger balance or discount.",
};

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function parseDisplayDate(value: string) {
  return new Date(`${value} 12:00:00`);
}

function getElapsedWholeMonths(startDateLabel: string) {
  const startDate = parseDisplayDate(startDateLabel);
  const today = new Date();

  let months =
    (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());

  if (today.getDate() < startDate.getDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
}

function getBenefitState(benefit: MemberBenefit) {
  if (benefit.kind === "banked-units") {
    return "Available";
  }

  if (benefit.available.toLowerCase().includes("used")) {
    return "Redeemed";
  }

  return "Available";
}

function getBenefitStateClass(benefit: MemberBenefit) {
  return getBenefitState(benefit) === "Redeemed" ? styles.benefitRedeemed : styles.benefitAvailable;
}

function getBenefitAvailableCopy(benefit: MemberBenefit) {
  if (benefit.kind === "banked-units") {
    return benefit.available.replace(/\s+available$/i, "");
  }

  if (benefit.kind === "discount") {
    return benefit.available.replace(/\s+active$/i, "");
  }

  if (benefit.kind === "perk") {
    return benefit.available.replace(/^active\s+/i, "");
  }

  return benefit.available;
}

function getBenefitNextCopy(benefit: MemberBenefit) {
  if (benefit.carryover === "accrues") {
    return "Accumulates monthly and stays available for the duration of membership.";
  }

  if (benefit.carryover === "resets") {
    return benefit.nextReset ?? "Renews next cycle.";
  }

  return "Active while membership is active. Does not accumulate.";
}

export function MemberDetailPane({
  member,
  initialMode = "snapshot",
  onClose,
}: MemberDetailPaneProps) {
  const plan = getMembershipPlanById(member.planId);
  const elapsedMonths = getElapsedWholeMonths(member.membershipStartDate);
  const minimumTermMet = elapsedMonths >= plan.minimumCommitmentMonths;
  const remainingCommitmentMonths = Math.max(plan.minimumCommitmentMonths - elapsedMonths, 0);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(initialMode);
  const [cardLast4, setCardLast4] = useState(member.cardOnFile.last4);
  const [cardExpiry, setCardExpiry] = useState(member.cardOnFile.expiry);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isSendingPaymentLink, setIsSendingPaymentLink] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiryInput, setCardExpiryInput] = useState(member.cardOnFile.expiry);
  const [cardCvc, setCardCvc] = useState("");
  const [paymentLinkEmail, setPaymentLinkEmail] = useState(member.email);
  const [membershipStatus, setMembershipStatus] = useState(member.membershipStatus);
  const [applyNoticePeriod, setApplyNoticePeriod] = useState(true);
  const [applyCancellationFee, setApplyCancellationFee] = useState(
    !minimumTermMet && plan.cancellationFee > 0,
  );

  const lifetimeValue = member.lifetimeValue || 1;
  const splitMembership = member.paidToDate / lifetimeValue;
  const splitAdditional = member.additionalRevenue / lifetimeValue;
  const payments = member.activity.filter(
    (item): item is MemberActivity & { type: PaymentActivity } => item.type !== "benefit",
  );
  const recentPayments = payments.slice(0, 5);

  return (
    <aside className={styles.memberPane} aria-label={`${member.patientName} membership details`}>
      <div className={styles.memberPaneHeader}>
        <div className={styles.memberIdentity}>
          <p className={styles.memberPaneEyebrow}>
            {drawerMode === "snapshot" ? "Member Snapshot" : "Manage Membership"}
          </p>
          <h2>{member.patientName}</h2>
          <div className={styles.memberIdentityMeta}>
            <span className={styles.mobilePlanBadge}>{member.planName}</span>
            <span className={styles.memberMiniMeta}>Started {member.membershipStartDate}</span>
            <span
              className={`${styles.statusPill} ${
                membershipStatus === "paused" ? styles.statusInactive : styles.statusActive
              }`}
            >
              {membershipStatus === "paused" ? "Paused" : "Active"}
            </span>
          </div>
        </div>
        {onClose ? (
          <button type="button" className={styles.memberPaneClose} onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>

      <div className={styles.memberPaneScrollArea}>
        <SegmentedToggle
          ariaLabel="Member drawer views"
          options={drawerModes}
          value={drawerMode}
          onChange={setDrawerMode}
        />

        {drawerMode === "snapshot" ? (
          <>
            <section className={styles.memberPaneSection}>
              <div className={styles.memberSectionHeader}>
                <div>
                  <p className={styles.memberPaneEyebrow}>Overview</p>
                  <h3>Current membership</h3>
                </div>
              </div>
              <dl className={styles.memberFactGrid}>
                <div className={styles.memberFactCard}>
                  <dt>Plan</dt>
                  <dd>{member.planName}</dd>
                </div>
                <div className={styles.memberFactCard}>
                  <dt>Current plan paid</dt>
                  <dd>{formatCurrency(member.paidToDate)}</dd>
                </div>
                <div className={styles.memberFactCard}>
                  <dt>Next payment</dt>
                  <dd>{member.nextPaymentDate}</dd>
                </div>
                <div className={styles.memberFactCard}>
                  <dt>Term</dt>
                  <dd>{member.term}</dd>
                  {member.membershipEndDate ? (
                    <span className={styles.memberFactSubtext}>Ends {member.membershipEndDate}</span>
                  ) : null}
                </div>
              </dl>
            </section>

            <section className={styles.memberPaneSection}>
              <div className={styles.memberSectionHeader}>
                <div>
                  <p className={styles.memberPaneEyebrow}>Inclusions</p>
                  <h3>Benefits available</h3>
                </div>
              </div>
              <div className={styles.redemptionTableWrap}>
                <table className={styles.redemptionTable}>
                  <thead>
                    <tr>
                      <th>Inclusion</th>
                      <th>Available</th>
                      <th>Next</th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.benefits.map((benefit) => (
                      <tr key={benefit.id}>
                        <td>
                          <div className={styles.redemptionNameCell}>
                            <strong>
                              {plan.inclusions.find((inclusion) => inclusion.id === benefit.inclusionId)?.label ??
                                benefit.inclusionId}
                            </strong>
                            <span title={carryoverTooltip[benefit.carryover]}>
                              {carryoverCopy[benefit.carryover]}
                            </span>
                            <small>
                              {benefit.lastRedeemedDate
                                ? `Last used ${benefit.lastRedeemedDate}`
                                : "Not yet used"}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className={styles.redemptionValueCell}>
                            <span
                              className={`${styles.benefitBadge} ${getBenefitStateClass(benefit)}`}
                              title={benefit.detail || benefit.summary}
                            >
                              {getBenefitState(benefit)}
                            </span>
                            <strong>{getBenefitAvailableCopy(benefit)}</strong>
                          </div>
                        </td>
                        <td className={styles.redemptionNextCell}>{getBenefitNextCopy(benefit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={styles.memberPaneSection}>
              <div className={styles.memberSectionHeader}>
                <div>
                  <p className={styles.memberPaneEyebrow}>Spend</p>
                  <h3>Recent transactions</h3>
                </div>
              </div>
              <div className={styles.revenueSummaryRow}>
                <div className={styles.revenueStat}>
                  <dt>Lifetime value</dt>
                  <dd>{formatCurrency(member.lifetimeValue)}</dd>
                </div>
                <div className={styles.revenueStat}>
                  <dt>Current plan paid</dt>
                  <dd>{formatCurrency(member.paidToDate)}</dd>
                </div>
                <div className={styles.revenueStat}>
                  <dt>Additional</dt>
                  <dd>{formatCurrency(member.additionalRevenue)}</dd>
                </div>
              </div>
              <div className={styles.valueSplitBar} aria-hidden="true">
                <span style={{ width: `${splitMembership * 100}%` }} />
                <span style={{ width: `${splitAdditional * 100}%` }} />
              </div>
              <div className={styles.paymentList}>
                {recentPayments.map((item) => (
                  <div key={item.id} className={styles.paymentRow}>
                    <div>
                      <span className={`${styles.activityBadge} ${activityBadgeClass[item.type]}`}>
                        {activityBadgeCopy[item.type]}
                      </span>
                      <p>{item.title}</p>
                      <small>{item.date}</small>
                    </div>
                    {item.amount ? <strong>{formatCurrency(item.amount)}</strong> : null}
                  </div>
                ))}
              </div>
              <button type="button" className={styles.memberSecondaryAction}>
                View more
              </button>
            </section>

            <section className={styles.memberPaneSection}>
              <div className={styles.memberSectionHeader}>
                <div>
                  <p className={styles.memberPaneEyebrow}>Actions</p>
                  <h3>Actions</h3>
                </div>
              </div>
              <div className={styles.memberActionStack}>
                <button type="button" className={styles.memberPrimaryAction}>
                  Checkout
                </button>
                <button
                  type="button"
                  className={styles.memberSecondaryAction}
                  onClick={() => setDrawerMode("manage")}
                >
                  Manage membership
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className={styles.memberPaneSection}>
              <div className={styles.memberSectionHeader}>
                <div>
                  <p className={styles.memberPaneEyebrow}>Billing</p>
                  <h3>Payment method</h3>
                </div>
              </div>
              <div className={styles.manageCard}>
                <div className={styles.cardOnFilePanel}>
                  <div className={styles.cardOnFileVisual}>
                    <div className={styles.cardOnFileTopRow}>
                      <span className={styles.cardOnFileChip}>Card on file</span>
                    </div>
                    <p className={styles.cardOnFileDigits}>•••• •••• •••• {cardLast4}</p>
                    <div className={styles.cardOnFileFooter}>
                      <span>Expires {cardExpiry}</span>
                      <span>Default payment method</span>
                    </div>
                  </div>
                  <div className={styles.manageCardRow}>
                    <div>
                      <p className={styles.manageCardLabel}>Billing card</p>
                      <h4>Ending in {cardLast4}</h4>
                      <p className={styles.manageCardMeta}>
                        Update it here, or send the customer a secure link to update it themselves.
                      </p>
                    </div>
                  </div>
                  <div className={styles.manageInlineActions}>
                    <button
                      type="button"
                      className={styles.memberSecondaryAction}
                      onClick={() => {
                        setIsSendingPaymentLink(false);
                        setIsEditingCard((current) => !current);
                      }}
                    >
                      {isEditingCard ? "Cancel" : "Update"}
                    </button>
                    <button
                      type="button"
                      className={styles.memberPrimaryAction}
                      onClick={() => {
                        setIsEditingCard(false);
                        setIsSendingPaymentLink(true);
                      }}
                    >
                      Send link to update
                    </button>
                  </div>
                </div>
                {isSendingPaymentLink ? (
                  <div className={styles.manageLinkFlow}>
                    <label className={`${styles.manageField} ${styles.manageFieldWide}`}>
                      Confirmation email
                      <input
                        type="email"
                        value={paymentLinkEmail}
                        placeholder="name@example.com"
                        onChange={(event) => setPaymentLinkEmail(event.target.value)}
                      />
                    </label>
                    <div className={styles.manageFormActions}>
                      <button type="button" className={styles.memberPrimaryAction}>
                        Send
                      </button>
                      <button
                        type="button"
                        className={styles.memberSecondaryAction}
                        onClick={() => setIsSendingPaymentLink(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
                {isEditingCard ? (
                  <div className={styles.manageFieldGrid}>
                    <label className={`${styles.manageField} ${styles.manageFieldWide}`}>
                      Card number
                      <input
                        value={cardNumber}
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        onChange={(event) =>
                          setCardNumber(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16)
                              .replace(/(\d{4})(?=\d)/g, "$1 "),
                          )
                        }
                      />
                    </label>
                    <label className={styles.manageField}>
                      Expiry
                      <input
                        value={cardExpiryInput}
                        inputMode="numeric"
                        placeholder="MM/YY"
                        onChange={(event) =>
                          setCardExpiryInput(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4)
                              .replace(/(\d{2})(?=\d)/, "$1/"),
                          )
                        }
                      />
                    </label>
                    <label className={styles.manageField}>
                      CVC
                      <input
                        value={cardCvc}
                        inputMode="numeric"
                        placeholder="123"
                        onChange={(event) => setCardCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
                      />
                    </label>
                    <div className={styles.manageFormActions}>
                      <button
                        type="button"
                        className={styles.memberPrimaryAction}
                        onClick={() => {
                          const digitsOnly = cardNumber.replace(/\D/g, "");
                          if (digitsOnly.length >= 4) {
                            setCardLast4(digitsOnly.slice(-4));
                          }

                          if (cardExpiryInput.trim()) {
                            setCardExpiry(cardExpiryInput);
                          }

                          setCardCvc("");
                          setIsEditingCard(false);
                        }}
                      >
                        Save details
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            <section className={styles.memberPaneSection}>
              <div className={styles.memberSectionHeader}>
                <div>
                  <p className={styles.memberPaneEyebrow}>Pause</p>
                  <h3>Pause membership</h3>
                </div>
              </div>
              <div className={styles.manageCard}>
                <p className={styles.manageCardMeta}>
                  {membershipStatus === "paused"
                    ? member.pausedUntil
                      ? `Currently paused until ${member.pausedUntil}.`
                      : "Currently paused until manually resumed."
                    : "Pause stops the next scheduled membership charges while keeping the member record intact."}
                </p>
                <div className={styles.memberActionStack}>
                  {membershipStatus === "paused" ? (
                    <button
                      type="button"
                      className={styles.memberPrimaryAction}
                      onClick={() => setMembershipStatus("active")}
                    >
                      Resume membership
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.memberSecondaryAction}
                      onClick={() => setMembershipStatus("paused")}
                    >
                      Pause membership
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className={styles.memberPaneSection}>
              <div className={styles.memberSectionHeader}>
                <div>
                  <p className={styles.memberPaneEyebrow}>Cancellation</p>
                  <h3>Cancel membership</h3>
                </div>
              </div>
              <div className={styles.manageCard}>
                <div className={styles.managePolicyRow}>
                  <span
                    className={`${styles.policyPill} ${
                      minimumTermMet ? styles.policyPillSuccess : styles.policyPillDanger
                    }`}
                  >
                    {minimumTermMet
                      ? "Membership term met"
                      : `Membership term not met · ${remainingCommitmentMonths} month${
                          remainingCommitmentMonths === 1 ? "" : "s"
                        } remaining`}
                  </span>
                  <span>{plan.minimumCommitmentMonths} month minimum term</span>
                  <span>{plan.noticePeriodDays} day notice</span>
                  <span>
                    {plan.cancellationFee > 0
                      ? `${formatCurrency(plan.cancellationFee)} cancellation fee`
                      : "No cancellation fee"}
                  </span>
                </div>
                <div className={styles.manageOptionStack}>
                  <label className={styles.manageToggleRow}>
                    <span>Apply notice period</span>
                    <input
                      type="checkbox"
                      checked={applyNoticePeriod}
                      onChange={() => setApplyNoticePeriod((current) => !current)}
                    />
                  </label>
                  <label className={styles.manageToggleRow}>
                    <span>Apply cancellation fee</span>
                    <input
                      type="checkbox"
                      checked={minimumTermMet ? false : applyCancellationFee}
                      disabled={minimumTermMet || plan.cancellationFee === 0}
                      onChange={() => setApplyCancellationFee((current) => !current)}
                    />
                  </label>
                </div>
                <div className={styles.manageCancellationSummary}>
                  <p>
                    {applyNoticePeriod
                      ? `Cancellation will respect the ${plan.noticePeriodDays} day notice period.`
                      : "Cancellation will take effect immediately."}
                  </p>
                  <p>
                    {minimumTermMet
                      ? "Minimum term already served, so no cancellation fee will be charged."
                      : applyCancellationFee && plan.cancellationFee > 0
                      ? `${formatCurrency(plan.cancellationFee)} will be charged on cancellation.`
                      : "No cancellation fee will be charged."}
                  </p>
                </div>
                <button type="button" className={styles.memberDangerAction}>
                  Cancel membership
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  );
}
