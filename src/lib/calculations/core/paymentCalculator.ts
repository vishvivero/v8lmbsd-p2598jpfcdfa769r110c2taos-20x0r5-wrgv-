import { Debt } from "@/lib/types";
import { calculateMonthlyInterest } from "./interestCalculator";

export const calculateMinimumPayments = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.minimum_payment, 0);
};

export const calculateMonthsToPayoff = (
  balance: number,
  annualRate: number,
  monthlyPayment: number
): number => {
  if (monthlyPayment <= 0) return Infinity;
  
  let remainingBalance = balance;
  let months = 0;
  const monthlyRate = annualRate / 1200;
  
  while (remainingBalance > 0.01 && months < 1200) {
    const monthlyInterest = calculateMonthlyInterest(remainingBalance, annualRate);
    
    if (monthlyPayment <= monthlyInterest) {
      return Infinity;
    }

    const principalPayment = Math.min(
      monthlyPayment - monthlyInterest,
      remainingBalance
    );
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
    months++;
  }

  return months >= 1200 ? Infinity : months;
};

export const calculatePaymentAllocation = (
  debts: Debt[],
  totalPayment: number
): Map<string, number> => {
  const allocations = new Map<string, number>();
  let remainingPayment = totalPayment;
  
  // First allocate minimum payments
  debts.forEach(debt => {
    const minPayment = Math.min(debt.minimum_payment, debt.balance);
    allocations.set(debt.id, minPayment);
    remainingPayment -= minPayment;
  });

  // If there's remaining payment, allocate to highest priority debt
  if (remainingPayment > 0 && debts.length > 0) {
    const highestPriorityDebt = debts[0];
    const currentAllocation = allocations.get(highestPriorityDebt.id) || 0;
    allocations.set(
      highestPriorityDebt.id,
      currentAllocation + remainingPayment
    );
  }

  return allocations;
};