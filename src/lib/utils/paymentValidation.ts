import { Debt } from "../types/debt";
import { PaymentAllocation } from "../types/payment";

export const validateAllocations = (
  debts: Debt[],
  allocations: PaymentAllocation,
  totalPayment: number
): void => {
  console.log('Starting allocation validation...');
  
  const totalAllocated = Object.values(allocations).reduce((sum, amount) => Number(sum) + Number(amount), 0);
  
  console.log('Validation:', {
    totalAllocated,
    shouldEqual: totalPayment,
    difference: Math.abs(Number(totalAllocated) - totalPayment)
  });

  // Check if total allocated matches total payment (allowing for small floating point differences)
  if (Math.abs(Number(totalAllocated) - totalPayment) > 0.01) {
    console.warn('Payment allocation mismatch:', {
      totalAllocated,
      totalPayment,
      difference: Math.abs(Number(totalAllocated) - totalPayment)
    });
  }

  // Check for over-allocation
  debts.forEach(debt => {
    const allocation = allocations[debt.id] || 0;
    if (Number(allocation) > Number(debt.balance)) {
      const excess = Number(allocation) - Number(debt.balance);
      allocations[debt.id] = Number(debt.balance);
      console.warn(`Corrected over-allocation for ${debt.name}:`, {
        original: Number(allocation) + excess,
        corrected: allocations[debt.id],
        excess
      });
    }
  });

  console.log('Allocation validation completed');
};