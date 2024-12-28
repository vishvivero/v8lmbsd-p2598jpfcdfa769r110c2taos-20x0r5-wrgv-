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

    // If this debt is already paid off, move to next debt
    if (remainingBalance <= 0.01) {
      // Add minimum payment back to available pool for next debt
      availablePayment += currentDebt.minimumPayment;
      console.log(`${currentDebt.name} is paid off, releasing payment:`, {
        releasedMinPayment: currentDebt.minimumPayment,
        newAvailablePayment: availablePayment
      });
      activeDebts.shift();
      continue;
    }

    // Calculate how much we can pay towards this debt
    const paymentAmount = Math.min(availablePayment, remainingBalance);
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentAmount;
    availablePayment = Math.max(0, availablePayment - paymentAmount);

    console.log(`Payment allocated to ${currentDebt.name}:`, {
      paymentAmount,
      totalAllocation: allocations[currentDebt.id],
      remainingAvailable: availablePayment
    });

    // If this debt is now paid off, move to next debt
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is now fully paid off`);
      // Add its minimum payment to available pool for next debt
      availablePayment += currentDebt.minimumPayment;
      activeDebts.shift();
    }
  }

  console.log('Final extra payment allocations:', {
    allocations,
    remainingPayment: availablePayment
  });

  return allocations;
};