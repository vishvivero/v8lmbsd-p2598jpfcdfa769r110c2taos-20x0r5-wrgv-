import { Debt, PaymentAllocation } from "../types/debt";

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: PaymentAllocation,
  remainingPayment: number
): PaymentAllocation => {
  console.log('Starting extra payment allocation with:', {
    remainingPayment,
    initialAllocations
  });
  
  const allocations = { ...initialAllocations };
  let availablePayment = remainingPayment;
  let activeDebts = [...debts];

  while (activeDebts.length > 0 && availablePayment > 0.01) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id] || 0;
    const remainingDebtBalance = Math.max(0, currentBalance - currentAllocation);

    console.log(`Processing ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance: remainingDebtBalance,
      availablePayment
    });

    if (remainingDebtBalance <= 0.01) {
      // If debt is paid off, release its minimum payment to next debt
      const releasedPayment = currentDebt.minimumPayment;
      availablePayment += releasedPayment;
      
      console.log(`${currentDebt.name} paid off, releasing payment:`, {
        releasedPayment,
        newAvailablePayment: availablePayment
      });
      
      activeDebts.shift();
      continue;
    }

    // Calculate how much we can pay towards this debt
    const paymentTowardsDebt = Math.min(availablePayment, remainingDebtBalance);
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentTowardsDebt;
    availablePayment -= paymentTowardsDebt;

    console.log(`Payment allocated to ${currentDebt.name}:`, {
      payment: paymentTowardsDebt,
      newAllocation: allocations[currentDebt.id],
      remainingPayment: availablePayment
    });

    // If this debt is now paid off, move to next debt
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} will be paid off`);
      
      // Release minimum payment for next debt if there are more debts
      if (activeDebts.length > 1) {
        availablePayment += currentDebt.minimumPayment;
        console.log(`Released minimum payment for next debt:`, {
          amount: currentDebt.minimumPayment,
          newAvailablePayment: availablePayment
        });
      }
      
      activeDebts.shift();
    }
  }

  console.log('Final payment allocations:', allocations);
  return allocations;
};