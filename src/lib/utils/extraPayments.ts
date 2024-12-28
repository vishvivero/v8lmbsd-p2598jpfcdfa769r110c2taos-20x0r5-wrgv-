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
  let releasedMinPayments = 0;

  while (availablePayment > 0.01 && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id] || 0;
    const remainingBalance = Math.max(0, currentBalance - currentAllocation);

    console.log(`Processing ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance,
      availablePayment,
      releasedMinPayments
    });

    // Calculate total available payment including released minimum payments
    const totalAvailablePayment = availablePayment + releasedMinPayments;
    
    if (remainingBalance <= 0.01) {
      // If this debt is paid off, release its minimum payment
      releasedMinPayments += currentDebt.minimumPayment;
      console.log(`${currentDebt.name} is paid off, releasing minimum payment:`, {
        releasedPayment: currentDebt.minimumPayment,
        totalReleasedPayments: releasedMinPayments,
        newAvailablePayment: totalAvailablePayment
      });
      activeDebts.shift();
      continue;
    }

    // Calculate how much we can pay towards this debt
    const paymentAmount = Math.min(totalAvailablePayment, remainingBalance);
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentAmount;
    
    // Deduct from available payment and released payments appropriately
    if (paymentAmount <= releasedMinPayments) {
      releasedMinPayments -= paymentAmount;
    } else {
      const fromReleased = releasedMinPayments;
      const fromAvailable = paymentAmount - releasedMinPayments;
      releasedMinPayments = 0;
      availablePayment -= fromAvailable;
    }

    console.log(`Payment allocated to ${currentDebt.name}:`, {
      paymentAmount,
      totalAllocation: allocations[currentDebt.id],
      remainingPayment: availablePayment,
      remainingReleased: releasedMinPayments
    });

    // If this debt is now paid off, move to next debt
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is now fully paid off`);
      activeDebts.shift();
    }
  }

  return allocations;
};