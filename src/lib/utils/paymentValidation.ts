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
    throw new Error(`Payment allocation mismatch: allocated ${totalAllocated}, expected ${totalPayment}`);
  }

  // Check for over-allocation
  debts.forEach(debt => {
    if (allocations[debt.id] > debt.balance) {
      throw new Error(`Over-allocation detected for ${debt.name}: allocated ${allocations[debt.id]}, balance ${debt.balance}`);
    }
  });

  console.log('Allocation validation completed successfully');
};