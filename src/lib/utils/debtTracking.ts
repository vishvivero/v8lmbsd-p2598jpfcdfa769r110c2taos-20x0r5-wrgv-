import { Debt } from "../types/debt";

export interface DebtStatus {
  months: number;
  totalInterest: number;
  payoffDate: Date;
}

export const initializeDebtTracking = (debts: Debt[]): Map<string, number> => {
  const balances = new Map<string, number>();
  debts.forEach(debt => balances.set(debt.id, debt.balance));
  return balances;
};

export const createDebtStatus = (
  months: number,
  totalInterest: number,
  payoffDate: Date
): DebtStatus => ({
  months,
  totalInterest,
  payoffDate
});