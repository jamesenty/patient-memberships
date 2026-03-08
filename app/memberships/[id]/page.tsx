import { notFound } from "next/navigation";
import {
  CreateMembershipFlow,
  type MembershipFlowInitialData,
} from "@/app/components/membership-form/CreateMembershipFlow";
import { membershipPlans } from "@/app/components/dashboard/sample-data";

const membershipEditSeeds: Record<string, MembershipFlowInitialData> = {
  gold: {
    membershipName: "Gold Tier",
    description: "Premium plan for patients booking injectables and skin treatments on a regular cadence.",
    price: "349",
    frequency: "Monthly",
    salesTax: true,
    duration: "ongoing",
    durationMonths: "12",
    minimumCommitment: "3",
    noticePeriod: "30",
    cancellationFee: "99",
    inclusions: [
      {
        id: "service-gold-1",
        kind: "service",
        category: "Anti-wrinkle treatments",
        targetType: "specific",
        targetLabel: "Botox",
        quantity: 15,
        unit: "units",
        cadence: "Every 3 months",
      },
      {
        id: "service-gold-2",
        kind: "service",
        category: "Skin resurfacing",
        targetType: "specific",
        targetLabel: "Chemical peel",
        quantity: 1,
        unit: "session",
        cadence: "Every month",
      },
      {
        id: "discount-gold-1",
        kind: "discount",
        appliesTo: "all",
        targetLabel: "All skincare retail",
        amountType: "percent",
        amount: 10,
      },
    ],
  },
  silver: {
    membershipName: "Silver Tier",
    description: "Balanced recurring plan built for monthly maintenance treatments and lighter retail incentives.",
    price: "229",
    frequency: "Monthly",
    salesTax: true,
    duration: "timebound",
    durationMonths: "6",
    minimumCommitment: "2",
    noticePeriod: "21",
    cancellationFee: "49",
    inclusions: [
      {
        id: "discount-silver-1",
        kind: "discount",
        appliesTo: "category",
        targetLabel: "Anti-wrinkle treatments category",
        amountType: "percent",
        amount: 15,
      },
      {
        id: "service-silver-1",
        kind: "service",
        category: "Facials",
        targetType: "specific",
        targetLabel: "HydraFacial",
        quantity: 1,
        unit: "session",
        cadence: "Every month",
      },
      {
        id: "discount-silver-2",
        kind: "discount",
        appliesTo: "all",
        targetLabel: "All skincare retail",
        amountType: "percent",
        amount: 5,
      },
    ],
  },
  bronze: {
    membershipName: "Bronze Tier",
    description: "Entry plan focused on accessible monthly value, small injectable savings, and loyalty perks.",
    price: "149",
    frequency: "Monthly",
    salesTax: false,
    duration: "ongoing",
    durationMonths: "12",
    minimumCommitment: "1",
    noticePeriod: "14",
    cancellationFee: "0",
    inclusions: [
      {
        id: "discount-bronze-1",
        kind: "discount",
        appliesTo: "category",
        targetLabel: "Anti-wrinkle treatments category",
        amountType: "percent",
        amount: 10,
      },
      {
        id: "service-bronze-1",
        kind: "service",
        category: "Skin rejuvenation",
        targetType: "specific",
        targetLabel: "LED session",
        quantity: 1,
        unit: "session",
        cadence: "Every month",
      },
      {
        id: "perk-bronze-1",
        kind: "perk",
        label: "Priority booking",
        cadence: "Always",
      },
    ],
  },
};

export default async function EditMembershipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = membershipPlans.find((entry) => entry.id === id);

  if (!plan || !membershipEditSeeds[id]) {
    notFound();
  }

  return <CreateMembershipFlow mode="edit" initialData={membershipEditSeeds[id]} backHref="/" />;
}
