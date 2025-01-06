import { Debt } from "@/lib/types/debt";

export interface PayoffDetails {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  redistributionHistory?: RedistributionEntry[];
  schedule?: PaymentScheduleEntry[];
}

export interface RedistributionEntry {
  fromDebtId: string;
  amount: number;
  month: number;
}

export interface PaymentScheduleEntry {
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  redistributedAmount?: number;
  hasRedistribution?: boolean;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  calculate: (debts: Debt[]) => Debt[];
}

export interface AllocationResult {
  allocations: Map<string, number>;
  payoffDetails: { [key: string]: PayoffDetails };
}