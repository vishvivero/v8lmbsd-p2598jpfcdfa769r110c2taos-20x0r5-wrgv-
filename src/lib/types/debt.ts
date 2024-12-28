export interface Debt {
  id: string;
  name: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number;
  banker_name: string;
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