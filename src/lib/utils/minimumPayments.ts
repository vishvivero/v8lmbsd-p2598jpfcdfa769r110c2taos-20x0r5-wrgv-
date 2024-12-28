import { Debt, AllocationResult } from "../types/debt";

export const calculateMinimumPayments = (
  debts: Debt[],
  totalPayment: number
): AllocationResult => {
  console.log('Starting minimum payment allocation with total payment:', totalPayment);
  
  const allocations: { [key: string]: number } = {};
  let remainingPayment = totalPayment;

  // Initialize all allocations to 0
  debts.forEach(debt => {
    allocations[debt.id] = 0;
  });

  // Allocate minimum payments
  debts.forEach(debt => {
    const minPayment = Math.min(debt.minimumPayment, debt.balance);
    if (minPayment > remainingPayment) {
      throw new Error(`Insufficient funds for minimum payments. Need ${minPayment} for ${debt.name}, but only ${remainingPayment} available.`);
    }
    allocations[debt.id] = minPayment;
    remainingPayment = Math.max(0, remainingPayment - minPayment);
  });

  console.log('Minimum payment allocations:', allocations);
  console.log('Remaining after minimum payments:', remainingPayment);

  return { allocations, remainingPayment };
};