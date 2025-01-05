import { Debt } from "@/lib/types";

export interface OneTimeFunding {
  amount: number;
  payment_date: Date;
}

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
  currencySymbol: string;
  userId: string;
}

export interface PaymentAllocation {
  [key: string]: number;
}