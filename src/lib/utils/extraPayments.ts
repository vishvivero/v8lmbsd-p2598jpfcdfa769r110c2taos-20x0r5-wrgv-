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

  while (currentPayment > 0 && activeDebts.length > 0) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id];
    const remainingDebtBalance = currentBalance - currentAllocation;

    console.log(`Processing debt ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingBalance: remainingDebtBalance,
      availablePayment: currentPayment
    });

    if (remainingDebtBalance <= 0) {
      console.log(`${currentDebt.name} is already paid off, moving to next debt`);
      activeDebts = activeDebts.slice(1);
      continue;
    }

    // Calculate and apply extra payment
    const extraPayment = Math.min(currentPayment, remainingDebtBalance);
    allocations[currentDebt.id] += extraPayment;
    currentPayment = Math.max(0, currentPayment - extraPayment);

    console.log(`Added ${extraPayment} to ${currentDebt.name}, remaining payment: ${currentPayment}`);

    // If this debt is now paid off, move to next debt
    if (allocations[currentDebt.id] >= currentBalance) {
      console.log(`${currentDebt.name} is now fully paid off`);
      activeDebts = activeDebts.slice(1);
    }
  }

  return allocations;
};