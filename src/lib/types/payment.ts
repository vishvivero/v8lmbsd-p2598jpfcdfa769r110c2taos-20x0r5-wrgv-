export interface PaymentAllocation {
  [debtId: string]: number;
}

export interface AllocationResult {
  allocations: PaymentAllocation;
  remainingPayment: number;
}

export interface OneTimeFunding {
  payment_date: string;
  amount: number;
  notes?: string | null;
  is_applied?: boolean;
  currency_symbol?: string;
}