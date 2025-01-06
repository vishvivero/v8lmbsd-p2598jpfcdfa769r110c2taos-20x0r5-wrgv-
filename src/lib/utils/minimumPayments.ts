import { Debt } from "../types/debt";
import { AllocationResult } from "../types/payment";

const EPSILON = 0.01;

export const calculateMinimumPayments = (
  debts: Debt[],
  totalPayment: number
): AllocationResult => {
  console.log('Starting minimum payment allocation with total payment:', totalPayment);
  
  const allocations: { [key: string]: number } = {};
  let remainingPayment = totalPayment;

  debts.forEach(debt => {
    allocations[debt.id] = 0;
  });

  if (totalPayment === 0) {
    console.log('Zero payment mode - skipping minimum payment requirements');
    return { allocations, remainingPayment: 0 };
  }

  let totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  
  if (totalPayment < totalMinPayments) {
    console.warn('Insufficient funds for all minimum payments, distributing proportionally');
    debts.forEach(debt => {
      const proportion = debt.minimum_payment / totalMinPayments;
      allocations[debt.id] = Number((totalPayment * proportion).toFixed(2));
    });
    return { allocations, remainingPayment: 0 };
  }

  for (const debt of debts) {
    const minPayment = Math.min(debt.minimum_payment, debt.balance);
    
    if (minPayment > remainingPayment) {
      console.warn(`Insufficient funds for minimum payment of ${minPayment} for debt ${debt.name}`);
      break;
    }

    allocations[debt.id] = minPayment;
    remainingPayment = Number((remainingPayment - minPayment).toFixed(2));
  }

  return { allocations, remainingPayment };
};