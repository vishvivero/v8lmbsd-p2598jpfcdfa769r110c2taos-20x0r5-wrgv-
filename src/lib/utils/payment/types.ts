import { Debt } from "@/lib/types";

export interface OneTimeFunding {
  amount: number;
  payment_date: Date;
}

export interface DebtStatus {
  months: number;
  totalInterest: number;
  payoffDate: Date;
}

export interface PaymentRedistribution {
  fromDebtId: string;
  toDebtId: string;
  amount: number;
  currencySymbol: string;
}