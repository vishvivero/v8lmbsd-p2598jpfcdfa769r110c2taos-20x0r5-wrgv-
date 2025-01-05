import { Debt } from "@/lib/types";

export interface RedistributionEntry {
  fromDebtId: string;
  amount: number;
  month: number;
}

export interface DebtStatus {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  redistributionHistory?: RedistributionEntry[];
}

export interface PaymentAllocation {
  debtId: string;
  baseAmount: number;
  redistributedAmount: number;
}

export interface MonthlyCalculation {
  date: Date;
  payments: Map<string, PaymentAllocation>;
  redistributions: RedistributionEntry[];
}