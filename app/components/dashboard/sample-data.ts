import type { MemberRecord, MembershipPlan } from "./types";

export const membershipPlans: MembershipPlan[] = [
  {
    id: "gold",
    name: "Gold Tier",
    inclusions: [
      "20% off anti-wrinkle treatments",
      "1x chemical peel monthly",
      "10% off skincare retail",
    ],
    patients: 58,
    monthlyPrice: 349,
    isActive: true,
  },
  {
    id: "silver",
    name: "Silver Tier",
    inclusions: [
      "15% off anti-wrinkle treatments",
      "1x express facial monthly",
      "5% off skincare retail",
    ],
    patients: 84,
    monthlyPrice: 229,
    isActive: true,
  },
  {
    id: "bronze",
    name: "Bronze Tier",
    inclusions: [
      "10% off injectables",
      "1x LED session monthly",
      "Priority booking access",
    ],
    patients: 111,
    monthlyPrice: 149,
    isActive: true,
  },
];

export const members: MemberRecord[] = [
  {
    id: "member-1",
    patientName: "Emma Clarke",
    planName: "Gold Tier",
    nextPaymentDate: "15 Mar 2026",
    paidToDate: "14 Mar 2026",
    term: "6/12 months",
  },
  {
    id: "member-2",
    patientName: "Sophie Nguyen",
    planName: "Silver Tier",
    nextPaymentDate: "20 Mar 2026",
    paidToDate: "19 Mar 2026",
    term: "3/12 months",
  },
  {
    id: "member-3",
    patientName: "Olivia Hart",
    planName: "Bronze Tier",
    nextPaymentDate: "04 Apr 2026",
    paidToDate: "03 Apr 2026",
    term: "Ongoing",
  },
  {
    id: "member-4",
    patientName: "Mia Bennett",
    planName: "Gold Tier",
    nextPaymentDate: "28 Mar 2026",
    paidToDate: "27 Mar 2026",
    term: "11/12 months",
  },
];
