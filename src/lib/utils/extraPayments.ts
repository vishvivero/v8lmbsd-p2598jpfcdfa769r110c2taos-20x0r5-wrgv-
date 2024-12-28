import { Debt, PaymentAllocation } from "../types/debt";

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: PaymentAllocation,
  remainingPayment: number
): PaymentAllocation => {
  console.log('Starting extra payment allocation with:', {
    remainingPayment,
    initialAllocations,
  });

  const allocations = { ...initialAllocations };
  let availablePayment = remainingPayment;
  let activeDebts = [...debts];

  // Sort debts dynamically based on priority (e.g., highest interest rate or smallest balance)
  activeDebts.sort((a, b) => b.interestRate - a.interestRate); // Example for Avalanche method

  while (activeDebts.length > 0 && availablePayment > 0.01) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id] || 0;
    const remainingDebtBalance = Math.max(0, currentBalance - currentAllocation);

    console.log(`Processing ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance: remainingDebtBalance,
      availablePayment,
    });

    if (remainingDebtBalance <= 0.01) {
      console.log(`${currentDebt.name} is already paid off. Moving to next debt.`);
      activeDebts.shift();
      continue;
    }

    // Calculate how much of the available payment can be applied to this debt
    const paymentTowardsDebt = Math.min(availablePayment, remainingDebtBalance);
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentTowardsDebt;
    availablePayment -= paymentTowardsDebt;

    console.log(`Allocated $${paymentTowardsDebt} to ${currentDebt.name}.`, {
      newAllocation: allocations[currentDebt.id],
      remainingPayment: availablePayment,
    });

    // If this debt is now paid off, release its minimum payment and reprioritize
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is fully paid off.`);
      activeDebts.shift(); // Remove the paid-off debt

      if (activeDebts.length > 0) {
        // Release the minimum payment of the paid-off debt to the payment pool
        availablePayment += currentDebt.minimumPayment;
        console.log(`Released minimum payment ($${currentDebt.minimumPayment}) for next debt.`, {
          newAvailablePayment: availablePayment,
        });
      }
    }
  }

  console.log('Final payment allocations:', allocations);
  return allocations;
};
