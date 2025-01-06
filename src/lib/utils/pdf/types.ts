import { Debt } from '@/lib/types/debt';
import { Strategy } from '@/lib/strategies';

export interface PaymentRow {
  month: string;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
  releasedPayment?: number;
  redistributedFrom: string[];
}

export interface DebtPayoffSchedule {
  debtName: string;
  schedule: PaymentRow[];
}