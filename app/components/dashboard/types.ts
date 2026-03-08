export type Inclusion = string;

export type MembershipPlan = {
  id: string;
  name: string;
  inclusions: Inclusion[];
  patients: number;
  monthlyPrice: number;
  isActive: boolean;
};

export type MemberRecord = {
  id: string;
  patientName: string;
  planName: string;
  nextPaymentDate: string;
  paidToDate: number;
  term: string;
};
