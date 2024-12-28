import { Debt } from "./strategies";

export const calculateMinimumPayments = (
  debts: Debt[],
  totalPayment: number
): { allocations: { [key: string]: number }; remainingPayment: number } => {
  const allocations: { [key: string]: number } = {};
  let remainingPayment = totalPayment;

  // Initialize allocations
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
  const allocations = { ...initialAllocations };
  let currentPayment = remainingPayment;
  const activeDebts = [...debts];

  while (currentPayment > 0 && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentAllocation = allocations[currentDebt.id];
    const remainingDebtBalance = currentDebt.balance - currentAllocation;

    console.log(`Processing ${currentDebt.name}:`, {
      currentAllocation,
      remainingBalance: remainingDebtBalance,
      availablePayment: currentPayment
    });

    if (remainingDebtBalance <= 0) {
      console.log(`${currentDebt.name} is paid off, moving to next debt`);
      activeDebts.shift();
      continue;
    }

    const extraPayment = Math.min(currentPayment, remainingDebtBalance);
    allocations[currentDebt.id] += extraPayment;
    currentPayment -= extraPayment;

    console.log(`Added ${extraPayment} to ${currentDebt.name}, remaining payment: ${currentPayment}`);

    if (allocations[currentDebt.id] >= currentDebt.balance) {
      console.log(`${currentDebt.name} is now fully paid off`);
      activeDebts.shift();
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

  if (Math.abs(totalAllocated - totalPayment) > 0.01) {
    console.error('Payment allocation mismatch');
  }

  debts.forEach(debt => {
    if (allocations[debt.id] > debt.balance) {
      console.error(`Over-allocation detected for ${debt.name}`);
    }
  });
};