import { Debt } from "./types/debt";

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
  for (const debt of debts) {
    const minPayment = Math.min(debt.minimum_payment, debt.balance);
    if (remainingPayment >= minPayment) {
      allocations[debt.id] = minPayment;
      remainingPayment -= minPayment;
      console.log(`Allocated minimum payment for ${debt.name}:`, {
        minPayment,
        remainingPayment
      });
    } else {
      console.log(`Insufficient funds for minimum payment of ${debt.name}`);
      break;
    }
  }

  return { allocations, remainingPayment };
};

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: { [key: string]: number },
  remainingPayment: number
): { [key: string]: number } => {
  console.log('Starting extra payment allocation with:', {
    remainingPayment,
    initialAllocations
  });
  
  const allocations = { ...initialAllocations };
  let availablePayment = remainingPayment;
  let activeDebts = [...debts];

  while (availablePayment > 0.01 && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id] || 0;
    const remainingBalance = Math.max(0, currentBalance - currentAllocation);

    console.log(`Processing debt ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance,
      availablePayment
    });

    if (remainingBalance <= 0.01) {
      // If this debt is paid off, move to next debt and add its minimum payment
      // to the available payment pool
      const releasedPayment = currentDebt.minimum_payment;
      availablePayment += releasedPayment;
      console.log(`${currentDebt.name} is paid off, releasing minimum payment:`, {
        releasedPayment,
        newAvailablePayment: availablePayment
      });
      activeDebts.shift();
      continue;
    }

    // Calculate how much we can pay towards this debt
    const paymentAmount = Math.min(availablePayment, remainingBalance);
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentAmount;
    availablePayment -= paymentAmount;

    console.log(`Payment allocated to ${currentDebt.name}:`, {
      paymentAmount,
      totalAllocation: allocations[currentDebt.id],
      remainingPayment: availablePayment
    });

    // If this debt is now paid off, move to next debt
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is now fully paid off`);
      activeDebts.shift();
    }
  }

  return allocations;
};