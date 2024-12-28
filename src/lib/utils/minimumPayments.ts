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

  // For chart projections, allow zero payments
  if (totalPayment === 0) {
    console.log('Zero payment mode - skipping minimum payment requirements');
    return { allocations, remainingPayment: 0 };
  }

  // Allocate minimum payments
  for (const debt of debts) {
    const minPayment = Math.min(debt.minimumPayment, debt.balance);
    
    if (minPayment > remainingPayment) {
      console.warn(`Insufficient funds for minimum payment of ${minPayment} for debt ${debt.name}`);
      allocations[debt.id] = remainingPayment;
      remainingPayment = 0;
      break;
    }
    
    allocations[debt.id] = minPayment;
    remainingPayment = Math.max(0, remainingPayment - minPayment);
    
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