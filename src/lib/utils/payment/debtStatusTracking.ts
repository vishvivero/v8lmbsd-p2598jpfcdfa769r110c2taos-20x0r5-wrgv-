import { Debt } from "@/lib/types";
import { addMonths } from "date-fns";

export const initializeDebtTracking = (debts: Debt[]): Map<string, number> => {
  const balances = new Map<string, number>();
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
  });
  return balances;
};

export const createDebtStatus = (
  months: number,
  totalInterest: number,
  payoffDate: Date
) => ({
  months,
  totalInterest,
  payoffDate
});

export const calculatePayoffDate = (months: number): Date => {
  return addMonths(new Date(), months);
};