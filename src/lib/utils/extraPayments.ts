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

    // Skip if debt is already paid off
    if (remainingDebtBalance <= 0.01) {
      console.log(`${currentDebt.name} is already paid off, releasing minimum payment:`, currentDebt.minimumPayment);
      if (activeDebts.length > 1) {
        // Add minimum payment to released payments pool
        releasedPayments += currentDebt.minimumPayment;
        console.log(`Released payments pool increased to:`, releasedPayments);
      }
      activeDebts = activeDebts.slice(1);
      continue;
    }

    // Calculate total available payment (current + released)
    const totalAvailablePayment = currentPayment + releasedPayments;
    console.log(`Total available for allocation:`, totalAvailablePayment);

    // Calculate payment for current debt
    const paymentForDebt = Math.min(totalAvailablePayment, remainingDebtBalance);
    allocations[currentDebt.id] += paymentForDebt;
    
    // Update remaining payment amount
    const remainingAfterPayment = totalAvailablePayment - paymentForDebt;
    currentPayment = remainingAfterPayment;
    releasedPayments = 0; // Reset released payments as they've been used

    console.log(`Added ${paymentForDebt} to ${currentDebt.name}, remaining payment: ${currentPayment}`);

    // Check if current debt is now paid off
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} is now fully paid off`);
      if (activeDebts.length > 1) {
        // Release minimum payment for next debt
        releasedPayments += currentDebt.minimumPayment;
        console.log(`Released minimum payment (${currentDebt.minimumPayment}) for next debt, total released: ${releasedPayments}`);
        
        // Add any remaining payment to released payments
        if (currentPayment > 0) {
          releasedPayments += currentPayment;
          currentPayment = 0;
          console.log(`Added remaining payment to released pool, new total: ${releasedPayments}`);
        }
      }
      activeDebts = activeDebts.slice(1);
    }
  }

  console.log('Final payment allocations:', allocations);
  return allocations;
};