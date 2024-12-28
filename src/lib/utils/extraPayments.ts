import { Debt } from "../types/debt";

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: { [key: string]: number },
  remainingPayment: number
): { [key: string]: number } => {
  console.log('Starting extra payment allocation with remaining payment:', remainingPayment);
  
  const allocations = { ...initialAllocations };
  let currentPayment = remainingPayment;
  let activeDebts = [...debts];
  let totalAvailablePayment = currentPayment;

  while (totalAvailablePayment > 0 && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id];
    const remainingDebtBalance = currentBalance - currentAllocation;

    console.log(`Processing debt ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance: remainingDebtBalance,
      availablePayment: totalAvailablePayment,
      activeDebtsCount: activeDebts.length
    });

    // Skip if debt is already paid off
    if (remainingDebtBalance <= 0.01) {
      console.log(`${currentDebt.name} is already paid off, rolling over minimum payment:`, currentDebt.minimumPayment);
      // Add minimum payment to available payment pool
      totalAvailablePayment += currentDebt.minimumPayment;
      console.log(`Total available payment increased to:`, totalAvailablePayment);
      activeDebts = activeDebts.slice(1);
      continue;
    }

    // Calculate payment for current debt
    const paymentForDebt = Math.min(totalAvailablePayment, remainingDebtBalance);
    allocations[currentDebt.id] += paymentForDebt;
    totalAvailablePayment = Math.max(0, totalAvailablePayment - paymentForDebt);

    console.log(`Added ${paymentForDebt} to ${currentDebt.name}, remaining available: ${totalAvailablePayment}`);

    // Check if current debt is now paid off
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is now fully paid off`);
      if (activeDebts.length > 1) {
        // Roll over the minimum payment to available pool
        totalAvailablePayment += currentDebt.minimumPayment;
        console.log(`Added minimum payment (${currentDebt.minimumPayment}) to available pool, new total: ${totalAvailablePayment}`);
      }
      activeDebts = activeDebts.slice(1);
    }
  }

  console.log('Final payment allocations:', allocations);
  return allocations;
};