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

    // If this debt is already paid off, move to next debt and add its minimum payment
    // to the released payments pool
    if (remainingBalance <= 0.01) {
      const minPayment = currentDebt.minimumPayment;
      releasedMinPayments += minPayment;
      availablePayment += minPayment; // Add minimum payment back to available pool
      console.log(`${currentDebt.name} is paid off, releasing payment:`, {
        releasedMinPayment: minPayment,
        newAvailablePayment: availablePayment,
        newReleasedTotal: releasedMinPayments
      });
      activeDebts.shift();
      continue;
    }

    // Calculate total available payment
    const totalAvailable = availablePayment + releasedMinPayments;
    
    // Calculate how much we can pay towards this debt
    const paymentAmount = Math.min(totalAvailable, remainingBalance);
    
    // Update allocation for current debt
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentAmount;
    
    // Deduct payment from available funds
    const newTotal = totalAvailable - paymentAmount;
    if (newTotal <= releasedMinPayments) {
      releasedMinPayments = newTotal;
      availablePayment = 0;
    } else {
      availablePayment = newTotal - releasedMinPayments;
      releasedMinPayments = 0;
    }

    console.log(`Payment allocated to ${currentDebt.name}:`, {
      paymentAmount,
      totalAllocation: allocations[currentDebt.id],
      remainingAvailable: availablePayment,
      remainingReleased: releasedMinPayments
    });

    // If this debt is now paid off, move to next debt
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is now fully paid off`);
      // Add its minimum payment to both pools when moving to next debt
      const minPayment = currentDebt.minimumPayment;
      releasedMinPayments += minPayment;
      availablePayment += minPayment;
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