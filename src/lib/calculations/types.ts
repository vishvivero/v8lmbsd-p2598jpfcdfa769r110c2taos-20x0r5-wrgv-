import { Debt } from "@/lib/types/debt";

export interface PayoffDetails {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  redistributionHistory?: RedistributionEntry[];
}

export interface RedistributionEntry {
  fromDebtId: string;
  amount: number;
  month: number;
}

export interface AmortizationEntry {
  date: Date;
  startingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  calculate: (debts: Debt[]) => Debt[];
}

export interface PaymentAllocation {
  [debtId: string]: number;
}

export interface AllocationResult {
  allocations: Map<string, number>;
  payoffDetails: { [key: string]: PayoffDetails };
}