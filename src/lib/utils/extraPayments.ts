import { Debt } from "../types/debt";

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: { [key: string]: number },
  remainingPayment: number
): { [key: string]: number } => {
  console.log('Starting extra payment allocation with remaining payment:', remainingPayment);
  
  const allocations = { ...initialAllocations };
  let availablePayment = remainingPayment;
  let activeDebts = [...debts];

  // Track total available payment including released minimum payments
  let totalAvailableForAllocation = availablePayment;
  
  while (activeDebts.length > 0 && totalAvailableForAllocation > 0.01) {
    const currentDebt = activeDebts[0];
    const currentBalance = currentDebt.balance;
    const currentAllocation = allocations[currentDebt.id] || 0;
    const remainingDebtBalance = Math.max(0, currentBalance - currentAllocation);

    console.log(`Processing debt ${currentDebt.name}:`, {
      currentBalance,
      currentAllocation,
      remainingDebtBalance,
      totalAvailableForAllocation,
      activeDebtsCount: activeDebts.length
    });

    if (remainingDebtBalance <= 0.01) {
      // Debt is already paid off, release its minimum payment
      console.log(`${currentDebt.name} is already paid off, releasing minimum payment:`, currentDebt.minimumPayment);
      totalAvailableForAllocation += currentDebt.minimumPayment;
      activeDebts = activeDebts.slice(1);
      continue;
    }

    // Calculate how much we can allocate to this debt
    const paymentToAllocate = Math.min(totalAvailableForAllocation, remainingDebtBalance);
    allocations[currentDebt.id] = (allocations[currentDebt.id] || 0) + paymentToAllocate;
    totalAvailableForAllocation -= paymentToAllocate;

    console.log(`Allocated ${paymentToAllocate} to ${currentDebt.name}`, {
      newAllocation: allocations[currentDebt.id],
      remainingAvailable: totalAvailableForAllocation
    });

    // Check if this allocation fully pays off the debt
    if (allocations[currentDebt.id] >= currentBalance - 0.01) {
      console.log(`${currentDebt.name} will be paid off with this allocation`);
      
      // Release minimum payment for next debt if there are more debts
      if (activeDebts.length > 1) {
        totalAvailableForAllocation += currentDebt.minimumPayment;
        console.log(`Released ${currentDebt.minimumPayment} from ${currentDebt.name} for next debt. New total available: ${totalAvailableForAllocation}`);
      }
      
      activeDebts = activeDebts.slice(1);
    } else if (totalAvailableForAllocation <= 0.01) {
      // No more payment available, stop processing
      break;
    }
  }

  console.log('Final allocations:', allocations);
  return allocations;
};