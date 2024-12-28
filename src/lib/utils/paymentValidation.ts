import { Debt, PaymentAllocation } from "../types/debt";

export const validateAllocations = (
  debts: Debt[],
  allocations: PaymentAllocation,
  totalPayment: number
): void => {
  console.log('Starting allocation validation...');
  
  const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
  
  console.log('Validation:', {
    totalAllocated,
    shouldEqual: totalPayment,
    difference: Math.abs(totalAllocated - totalPayment)
  });

  // Check if total allocated matches total payment (allowing for small floating point differences)
  if (Math.abs(totalAllocated - totalPayment) > 0.01) {
    console.warn('Payment allocation mismatch:', {
      totalAllocated,
      totalPayment,
      difference: Math.abs(totalAllocated - totalPayment)
    });
  }

  // Check for over-allocation
  debts.forEach(debt => {
    if (allocations[debt.id] > debt.balance) {
      const excess = allocations[debt.id] - debt.balance;
      allocations[debt.id] = debt.balance;
      console.warn(`Corrected over-allocation for ${debt.name}:`, {
        original: allocations[debt.id] + excess,
        corrected: allocations[debt.id],
        excess
      });
    }
  });

  console.log('Allocation validation completed');
};