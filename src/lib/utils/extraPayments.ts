import { Debt, PaymentAllocation } from "../types/debt";

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: PaymentAllocation,
  remainingPayment: number
): PaymentAllocation => {
  console.log('Starting extra payment allocation with remaining payment:', remainingPayment);
  
  const allocations = { ...initialAllocations };
  let currentPayment = remainingPayment;
  let activeDebts = [...debts];
  let releasedPayments = 0;

  while ((currentPayment > 0 || releasedPayments > 0) && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id];
    const remainingDebtBalance = currentBalance - currentAllocation;

    console.log(`Processing debt ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance: remainingDebtBalance,
      availablePayment: currentPayment,
      releasedPayments,
      activeDebtsCount: activeDebts.length
    });

    if (remainingDebtBalance <= 0.01) { // Using threshold for floating point comparison
      console.log(`${currentDebt.name} is already paid off, releasing minimum payment:`, currentDebt.minimumPayment);
      // Release minimum payment for reallocation if there are remaining debts
      if (activeDebts.length > 1) {
        releasedPayments += currentDebt.minimumPayment;
        console.log(`Released payments pool is now:`, releasedPayments);
      }
      activeDebts = activeDebts.slice(1);
      continue;
    }

    // Combine current payment and released payments for allocation
    const totalAvailablePayment = currentPayment + releasedPayments;
    console.log(`Total available for allocation:`, totalAvailablePayment);
    releasedPayments = 0; // Reset after combining

    // Calculate how much extra we can apply to this debt
    const extraPayment = Math.min(totalAvailablePayment, remainingDebtBalance);
    allocations[currentDebt.id] += extraPayment;
    currentPayment = Math.max(0, totalAvailablePayment - extraPayment);

    console.log(`Added ${extraPayment} to ${currentDebt.name}, remaining payment: ${currentPayment}`);

    // If this debt is now paid off, remove it and prepare for next iteration
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is now fully paid off`);
      if (activeDebts.length > 1) {
        // Release the minimum payment for reallocation
        releasedPayments += currentDebt.minimumPayment;
        console.log(`Released minimum payment for reallocation: ${releasedPayments}`);
      }
      activeDebts = activeDebts.slice(1);
    }
  }

  console.log('Final allocations:', allocations);
  return allocations;
};