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

export interface PayoffSummary {
  totalMonths: number;
  totalInterest: number;
  finalPayoffDate: Date;
  debtPayoffOrder: string[];
  monthlyPayments: {
    debtId: string;
    amount: number;
  }[];
}

export interface OneTimeFunding {
  payment_date: string;
  amount: number;
}