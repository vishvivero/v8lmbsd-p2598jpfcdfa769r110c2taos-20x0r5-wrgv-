import { Debt, PaymentAllocation } from "../types/debt";
import { strategies } from "../strategies";

const EPSILON = 0.01; // Threshold for floating point comparisons

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: PaymentAllocation,
  remainingPayment: number,
  strategyId: string = 'avalanche'
): PaymentAllocation => {
  console.log('Starting extra payment allocation with:', {
    remainingPayment,
    initialAllocations,
    strategyId,
    totalDebts: debts.length
  });

  const allocations = { ...initialAllocations };
  let availablePayment = remainingPayment;
  let activeDebts = [...debts];
  const strategy = strategies.find(s => s.id === strategyId) || strategies[0];

  // Track minimum payments that become available after debts are paid off
  let releasedPayments = 0;

  while ((availablePayment > EPSILON || releasedPayments > EPSILON) && activeDebts.length > 0) {
    // Re-sort active debts according to strategy on each iteration
    activeDebts = strategy.calculate(activeDebts);
    
    // Add any released payments back to the available pool
    availablePayment += releasedPayments;
    releasedPayments = 0;

    // Process each debt in priority order
    for (let i = 0; i < activeDebts.length; i++) {
      const currentDebt = activeDebts[i];
      const currentBalance = currentDebt.balance;
      const currentAllocation = allocations[currentDebt.id] || 0;
      const remainingBalance = Math.max(0, currentBalance - currentAllocation);

      console.log(`Processing debt ${currentDebt.name}:`, {
        currentBalance,
        currentAllocation,
        remainingBalance,
        availablePayment,
        strategy: strategy.name
      });

      if (remainingBalance <= EPSILON) {
        // Debt is already paid off, release its minimum payment
        releasedPayments += currentDebt.minimumPayment;
        console.log(`${currentDebt.name} already paid off, releasing:`, {
          minimumPayment: currentDebt.minimumPayment,
          releasedPayments
        });
        activeDebts = activeDebts.filter(d => d.id !== currentDebt.id);
        i--; // Adjust index since we removed an item
        continue;
      }

      // Calculate maximum possible payment for this debt
      const maxPayment = Math.min(
        availablePayment,
        remainingBalance + EPSILON // Add small epsilon to handle floating point
      );

      if (maxPayment > EPSILON) {
        // Update allocation with precise decimal handling
        const newAllocation = Number((currentAllocation + maxPayment).toFixed(2));
        allocations[currentDebt.id] = newAllocation;
        
        // Update available payment pool
        availablePayment = Number((availablePayment - maxPayment).toFixed(2));

        console.log(`Payment allocated to ${currentDebt.name}:`, {
          maxPayment,
          newAllocation,
          remainingAvailable: availablePayment,
          releasedPayments
        });

        // Check if debt is now paid off
        if (newAllocation >= currentBalance - EPSILON) {
          console.log(`${currentDebt.name} is now paid off`);
          releasedPayments += currentDebt.minimumPayment;
          activeDebts = activeDebts.filter(d => d.id !== currentDebt.id);
          i--; // Adjust index since we removed an item
        }
      }
    }
  }

  console.log('Final payment allocations:', {
    allocations,
    remainingPayment: availablePayment,
    releasedPayments,
    activeDebtsRemaining: activeDebts.length
  });

  return allocations;
};