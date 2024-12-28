import { Debt, AllocationResult } from "../types/debt";

const EPSILON = 0.01;

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

  // For chart projections, allow zero payments
  if (totalPayment === 0) {
    console.log('Zero payment mode - skipping minimum payment requirements');
    return { allocations, remainingPayment: 0 };
  }

  let totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // If total payment can't cover minimum payments, distribute proportionally
  if (totalPayment < totalMinPayments) {
    console.warn('Insufficient funds for all minimum payments, distributing proportionally');
    debts.forEach(debt => {
      const proportion = debt.minimumPayment / totalMinPayments;
      allocations[debt.id] = Number((totalPayment * proportion).toFixed(2));
    });
    return { allocations, remainingPayment: 0 };
  }

  // Allocate minimum payments
  for (const debt of debts) {
    const minPayment = Math.min(debt.minimumPayment, debt.balance);
    
    if (minPayment > remainingPayment) {
      console.warn(`Insufficient funds for minimum payment of ${minPayment} for debt ${debt.name}`);
      break;
    }

    allocations[debt.id] = minPayment;
    remainingPayment = Number((remainingPayment - minPayment).toFixed(2));
    
    console.log(`Allocated minimum payment for ${debt.name}:`, {
      minPayment,
      remainingPayment
    });
  }

  console.log('Final minimum payment allocations:', {
    allocations,
    remainingPayment
  });

  return { allocations, remainingPayment };
};