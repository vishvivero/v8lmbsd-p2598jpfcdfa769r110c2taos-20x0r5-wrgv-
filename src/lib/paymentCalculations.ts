import { Debt } from "./strategies";

interface AllocationResult {
  allocations: { [key: string]: number };
  remainingPayment: number;
}

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
    allocations[debt.id] = minPayment;
    remainingPayment = Math.max(0, remainingPayment - minPayment);
  });

  console.log('Minimum payment allocations:', allocations);
  console.log('Remaining after minimum payments:', remainingPayment);

  return { allocations, remainingPayment };
};

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: { [key: string]: number },
  remainingPayment: number
): { [key: string]: number } => {
  console.log('Starting extra payment allocation with remaining payment:', remainingPayment);
  
  const allocations = { ...initialAllocations };
  let currentPayment = remainingPayment;
  let activeDebts = [...debts];
  let releasedMinPayments = 0; // Track released minimum payments

  while ((currentPayment > 0 || releasedMinPayments > 0) && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id];
    const remainingDebtBalance = currentBalance - currentAllocation;

    console.log(`Processing debt ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance: remainingDebtBalance,
      availablePayment: currentPayment,
      releasedMinPayments
    });

    if (remainingDebtBalance <= 0) {
      console.log(`${currentDebt.name} is already paid off, moving to next debt`);
      activeDebts = activeDebts.slice(1);
      continue;
    }

    // Add any released minimum payments to the current payment pool
    const totalAvailablePayment = currentPayment + releasedMinPayments;
    releasedMinPayments = 0; // Reset after adding to pool

    // Calculate how much extra we can apply to this debt
    const extraPayment = Math.min(totalAvailablePayment, remainingDebtBalance);
    allocations[currentDebt.id] += extraPayment;
    currentPayment = Math.max(0, totalAvailablePayment - extraPayment);

    console.log(`Added ${extraPayment} to ${currentDebt.name}, remaining payment: ${currentPayment}`);

    // If this debt is now paid off, remove it and add its minimum payment to released payments
    if (allocations[currentDebt.id] >= currentBalance) {
      console.log(`${currentDebt.name} is now fully paid off`);
      if (activeDebts.length > 1) {
        // Add the minimum payment to released payments instead of current payment
        releasedMinPayments += Math.min(currentDebt.minimumPayment, currentBalance);
        console.log(`Released minimum payment for reallocation: ${releasedMinPayments}`);
      }
      activeDebts = activeDebts.slice(1);
    }
  }

  return allocations;
};

export const validateAllocations = (
  debts: Debt[],
  allocations: { [key: string]: number },
  totalPayment: number
): void => {
  const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
  
  console.log('Validation:', {
    totalAllocated,
    shouldEqual: totalPayment,
    difference: Math.abs(totalAllocated - totalPayment)
  });

  // Check if total allocated matches total payment
  if (Math.abs(totalAllocated - totalPayment) > 0.01) {
    console.error('Payment allocation mismatch:', {
      totalAllocated,
      totalPayment,
      difference: Math.abs(totalAllocated - totalPayment)
    });
  }

  // Check for over-allocation
  debts.forEach(debt => {
    if (allocations[debt.id] > debt.balance) {
      console.error(`Over-allocation detected for ${debt.name}:`, {
        allocated: allocations[debt.id],
        balance: debt.balance,
        difference: allocations[debt.id] - debt.balance
      });
    }
  });
};