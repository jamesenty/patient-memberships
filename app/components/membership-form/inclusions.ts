export type InclusionKind = "service" | "discount" | "perk";

export type ServiceCadence =
  | "Every billing cycle"
  | "Every month"
  | "Every 3 months"
  | "Every 6 months"
  | "Once per year";

export type ServiceCatalogItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  defaultQuantity: number;
  defaultUnit: "units" | "session";
};

export type ServiceInclusion = {
  id: string;
  kind: "service";
  category: string;
  targetType: "category" | "specific";
  targetLabel: string;
  quantity: number;
  unit: "units" | "session";
  cadence: ServiceCadence;
};

export type DiscountInclusion = {
  id: string;
  kind: "discount";
  appliesTo: "all" | "category" | "specific";
  targetLabel: string;
  amountType: "percent" | "fixed";
  amount: number;
};

export type PerkInclusion = {
  id: string;
  kind: "perk";
  label: string;
  cadence: "Always" | "Monthly" | "Quarterly";
};

export type MembershipInclusion = ServiceInclusion | DiscountInclusion | PerkInclusion;

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: "botox-15-units",
    category: "Anti-wrinkle treatments",
    name: "Botox",
    price: 0,
    defaultQuantity: 15,
    defaultUnit: "units",
  },
  {
    id: "dysport-30-units",
    category: "Anti-wrinkle treatments",
    name: "Dysport",
    price: 0,
    defaultQuantity: 30,
    defaultUnit: "units",
  },
  {
    id: "chemical-peel",
    category: "Skin resurfacing",
    name: "Chemical peel",
    price: 189,
    defaultQuantity: 1,
    defaultUnit: "session",
  },
  {
    id: "hydrafacial",
    category: "Facials",
    name: "HydraFacial",
    price: 220,
    defaultQuantity: 1,
    defaultUnit: "session",
  },
  {
    id: "led-session",
    category: "Skin rejuvenation",
    name: "LED session",
    price: 75,
    defaultQuantity: 1,
    defaultUnit: "session",
  },
  {
    id: "microneedling",
    category: "Collagen induction",
    name: "Microneedling",
    price: 320,
    defaultQuantity: 1,
    defaultUnit: "session",
  },
];

export const perkLibrary = [
  "Priority booking",
  "Complimentary skin consultation",
  "Birthday treatment credit",
  "Early access to seasonal promos",
];

export const serviceCadenceOptions: ServiceCadence[] = [
  "Every billing cycle",
  "Every month",
  "Every 3 months",
  "Every 6 months",
  "Once per year",
];

export const serviceCategories = Array.from(
  new Set(serviceCatalog.map((item) => item.category)),
);

export function formatInclusionSummary(inclusion: MembershipInclusion): {
  type: string;
  detail: string;
  cadence: string;
} {
  if (inclusion.kind === "service") {
    const target =
      inclusion.targetType === "category"
        ? `${inclusion.category} (any product)`
        : inclusion.targetLabel;

    return {
      type: "Service",
      detail: `${target} · ${inclusion.quantity} ${inclusion.unit}`,
      cadence: inclusion.cadence,
    };
  }

  if (inclusion.kind === "discount") {
    const amount =
      inclusion.amountType === "percent"
        ? `${inclusion.amount}% off`
        : new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: "AUD",
            maximumFractionDigits: 0,
          }).format(inclusion.amount);

    return {
      type: "Discount",
      detail: `${amount} · ${inclusion.targetLabel}`,
      cadence: "Every billing cycle",
    };
  }

  return {
    type: "Perk",
    detail: inclusion.label,
    cadence: inclusion.cadence,
  };
}
