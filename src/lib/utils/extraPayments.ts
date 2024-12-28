import { Debt, PaymentAllocation } from "../types/debt";
import { strategies } from "../strategies";

const EPSILON = 0.01; // Threshold for floating point comparisons

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: PaymentAllocation,
  remainingPayment: number,
  strategyId: string = 'avalanche' // Default to avalanche if not specified
): PaymentAllocation => {
  console.log('Starting extra payment allocation with:', {
    remainingPayment,
    initialAllocations,
    strategyId
  });

  const allocations = { ...initialAllocations };
  let availablePayment = remainingPayment;
  let activeDebts = [...debts];

  // Get the sorting strategy
  const strategy = strategies.find(s => s.id === strategyId) || strategies[0];

  while (availablePayment > EPSILON && activeDebts.length > 0) {
    // Re-sort active debts according to strategy on each iteration
    activeDebts = strategy.calculate(activeDebts);
    
    const currentDebt = activeDebts[0];
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

    // Check if debt is effectively paid off (accounting for floating point)
    if (remainingBalance <= EPSILON) {
      // Release minimum payment back to available pool
      const releasedPayment = currentDebt.minimumPayment;
      availablePayment += releasedPayment;
      
      console.log(`${currentDebt.name} is paid off, releasing payment:`, {
        releasedPayment,
        newAvailablePayment: availablePayment
      });
      
      // Remove paid debt from active list
      activeDebts = activeDebts.filter(d => d.id !== currentDebt.id);
      continue;
    }

    // Calculate payment amount (considering floating point precision)
    const paymentAmount = Math.min(
      availablePayment,
      remainingBalance + EPSILON // Add small epsilon to ensure full payoff
    );

    // Update allocation
    allocations[currentDebt.id] = Number(
      (currentAllocation + paymentAmount).toFixed(2)
    );
    
    // Update available payment (with precision handling)
    availablePayment = Number(
      (availablePayment - paymentAmount).toFixed(2)
    );

    console.log(`Payment allocated to ${currentDebt.name}:`, {
      paymentAmount,
      totalAllocation: allocations[currentDebt.id],
      remainingAvailable: availablePayment
    });

    // Check if current debt is now paid off
    if (allocations[currentDebt.id] >= currentBalance - EPSILON) {
      console.log(`${currentDebt.name} is now fully paid off`);
      // Release minimum payment for redistribution
      availablePayment += currentDebt.minimumPayment;
      // Remove from active debts
      activeDebts = activeDebts.filter(d => d.id !== currentDebt.id);
    }
  }

  console.log('Final extra payment allocations:', {
    allocations,
    remainingPayment: availablePayment,
    activeDebtsRemaining: activeDebts.length
  });

  return allocations;
};