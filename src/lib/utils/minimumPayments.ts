import { Debt, AllocationResult } from "../types/debt";

export const calculateMinimumPayments = (
  debts: Debt[],
  totalPayment: number
): AllocationResult => {
  console.log('Starting minimum payment allocation with total payment:', totalPayment);
  
  const allocations: { [key: string]: number } = {};
  let remainingPayment = totalPayment;
  let releasedMinPayments = 0;

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
    const totalAvailable = remainingPayment + releasedMinPayments;
    
    if (minPayment > totalAvailable) {
      console.warn(`Insufficient funds for minimum payment of ${minPayment} for debt ${debt.name}`);
      const allocation = totalAvailable;
      allocations[debt.id] = allocation;
      remainingPayment = 0;
      releasedMinPayments = 0;
      break;
    }
    
    // Use released payments first, then remaining payment
    if (minPayment <= releasedMinPayments) {
      allocations[debt.id] = minPayment;
      releasedMinPayments -= minPayment;
    } else {
      const fromReleased = releasedMinPayments;
      const fromRemaining = minPayment - releasedMinPayments;
      allocations[debt.id] = minPayment;
      releasedMinPayments = 0;
      remainingPayment -= fromRemaining;
    }
    
    // If debt is fully paid with minimum payment, release its minimum payment
    if (allocations[debt.id] >= debt.balance) {
      releasedMinPayments += debt.minimumPayment;
    }
    
    console.log(`Allocated minimum payment for ${debt.name}:`, {
      minPayment,
      remainingPayment,
      releasedMinPayments
    });
  }

  console.log('Final minimum payment allocations:', {
    allocations,
    remainingPayment,
    releasedMinPayments
  });

  // Add any remaining released payments to the remaining payment pool
  remainingPayment += releasedMinPayments;

  return { allocations, remainingPayment };
};