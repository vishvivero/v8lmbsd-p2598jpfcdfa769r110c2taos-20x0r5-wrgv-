import { Debt } from "../types/debt";

export const allocateMinimumPayments = (
  debts: Map<string, number>,
  debtDetails: Debt[],
  availablePayment: number
): { allocations: Map<string, number>; remainingPayment: number } => {
  const allocations = new Map<string, number>();
  let remaining = availablePayment;

  debtDetails.forEach(debt => {
    const currentBalance = debts.get(debt.id) || 0;
    const minPayment = Math.min(debt.minimum_payment, currentBalance);
    
    if (remaining >= minPayment) {
      allocations.set(debt.id, minPayment);
      remaining -= minPayment;
      console.log(`Allocated minimum payment for ${debt.name}:`, {
        minPayment,
        remainingBalance: currentBalance - minPayment
      });
    } else {
      console.log(`Insufficient funds for minimum payment of ${debt.name}`);
    }
  });

  return { allocations, remainingPayment: remaining };
};

export const allocateExtraPayment = (
  targetDebtId: string,
  currentBalance: number,
  availablePayment: number
): number => {
  const payment = Math.min(availablePayment, currentBalance);
  console.log(`Allocating extra payment:`, {
    payment,
    remainingBalance: currentBalance - payment
  });
  return payment;
};