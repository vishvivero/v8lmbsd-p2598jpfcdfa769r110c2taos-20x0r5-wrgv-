export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  bankerName: string;
  currency_symbol: string;
  user_id?: string;
}

export interface PaymentHistory {
  id: string;
  total_payment: number;
  payment_date: string;
  currency_symbol: string;
  user_id?: string;
}

export interface PaymentAllocation {
  [debtId: string]: number;
}

export interface AllocationResult {
  allocations: PaymentAllocation;
  remainingPayment: number;
}