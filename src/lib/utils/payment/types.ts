import { Debt } from "@/lib/types";

export interface RedistributionEvent {
  month: number;
  amount: number;
  fromDebt: string;
}

export interface DebtStatus {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  redistributionHistory?: RedistributionEvent[];
}

export interface PaymentRedistribution {
  fromDebtId: string;
  toDebtId: string;
  amount: number;
}

export interface PaymentAllocation {
  [key: string]: number;
}