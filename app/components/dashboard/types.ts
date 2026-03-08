export type Inclusion = {
  id: string;
  label: string;
};

export type MembershipPlan = {
  id: string;
  name: string;
  inclusions: Inclusion[];
  patients: number;
  monthlyPrice: number;
  isActive: boolean;
  minimumCommitmentMonths: number;
  noticePeriodDays: number;
  cancellationFee: number;
};

export type MemberActivityType = "benefit" | "membership-payment" | "additional-payment";

export type MemberActivity = {
  id: string;
  type: MemberActivityType;
  title: string;
  description: string;
  date: string;
  amount?: number;
};

export type MemberBenefitKind =
  | "banked-units"
  | "monthly-inclusion"
  | "discount"
  | "perk";

export type MemberBenefitCarryover = "accrues" | "resets" | "non-stacking";

export type MemberBenefit = {
  id: string;
  inclusionId: string;
  kind: MemberBenefitKind;
  carryover: MemberBenefitCarryover;
  summary: string;
  detail: string;
  available: string;
  used?: string;
  nextReset?: string;
  lastRedeemedDate?: string | null;
};

export type MemberRecord = {
  id: string;
  patientName: string;
  email: string;
  planId: string;
  planName: string;
  membershipStatus: "active" | "paused" | "cancelled";
  nextPaymentDate: string;
  paidToDate: number;
  term: string;
  membershipStartDate: string;
  membershipEndDate: string | null;
  renewalDate: string;
  additionalRevenue: number;
  lifetimeValue: number;
  cardOnFile: {
    brand: string;
    last4: string;
    expiry: string;
  };
  pausedUntil: string | null;
  benefits: MemberBenefit[];
  activity: MemberActivity[];
};
