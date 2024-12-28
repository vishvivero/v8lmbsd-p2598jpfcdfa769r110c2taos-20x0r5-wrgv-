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

  // Continue allocating payments while there's money available and debts to pay
  while ((availablePayment > 0.01 || releasedMinPayments > 0.01) && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id] || 0;
    const remainingBalance = Math.max(0, currentBalance - currentAllocation);

    console.log(`Processing debt ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance,
      availablePayment,
      releasedMinPayments,
      totalAvailable: availablePayment + releasedMinPayments
    });

    // If this debt is already paid off, move to next debt and release its minimum payment
    if (remainingBalance <= 0.01) {
      releasedMinPayments += currentDebt.minimumPayment;
      console.log(`${currentDebt.name} is paid off, releasing minimum payment:`, {
        releasedPayment: currentDebt.minimumPayment,
        newReleasedTotal: releasedMinPayments
      });
      activeDebts.shift();
      continue;
    }

    // Calculate total available payment including released minimum payments
    const totalAvailable = availablePayment + releasedMinPayments;
    
    // Calculate how much we can pay towards this debt
    const paymentAmount = Math.min(totalAvailable, remainingBalance);
    
    // Update allocation for current debt
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentAmount;
    
    // Deduct payment from available funds, using released payments first
    if (paymentAmount <= releasedMinPayments) {
      releasedMinPayments -= paymentAmount;
    } else {
      const fromReleased = releasedMinPayments;
      const fromAvailable = paymentAmount - releasedMinPayments;
      releasedMinPayments = 0;
      availablePayment = Math.max(0, availablePayment - fromAvailable);
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
      // Don't forget to release its minimum payment for the next iteration
      releasedMinPayments += currentDebt.minimumPayment;
      activeDebts.shift();
    }
  }

  console.log('Final extra payment allocations:', {
    allocations,
    remainingPayment: availablePayment,
    remainingReleased: releasedMinPayments
  });

  return allocations;
};