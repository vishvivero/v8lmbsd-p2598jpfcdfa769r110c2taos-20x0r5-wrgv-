export interface DebtStatus {
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

export interface PaymentRedistribution {
  fromDebtId: string;
  toDebtId: string;
  amount: number;
  userId: string;
  currencySymbol: string;
}

export interface OneTimeFunding {
  payment_date: string;
  amount: number;
}