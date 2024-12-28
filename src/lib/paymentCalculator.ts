import { Debt, PaymentAllocation } from "./types/debt";
import { calculateMinimumPayments } from "./utils/minimumPayments";
import { calculateExtraPayments } from "./utils/extraPayments";
import { validateAllocations } from "./utils/paymentValidation";

export const calculateMonthlyAllocation = (
  debts: Debt[],
  monthlyPayment: number
): PaymentAllocation => {
  console.log('Starting monthly allocation calculation...');
  
  // Calculate minimum payments first
  const { allocations: initialAllocations, remainingPayment } = calculateMinimumPayments(
    debts,
    monthlyPayment
  );

  // Allocate extra payments based on strategy order
  const finalAllocations = calculateExtraPayments(
    debts,
    initialAllocations,
    remainingPayment
  );

  // Validate the final allocations
  validateAllocations(debts, finalAllocations, monthlyPayment);

  console.log('Final allocations:', finalAllocations);
  return finalAllocations;
};

export const calculatePayoffTime = (
  debt: Debt,
  availablePayment: number
): number => {
  if (availablePayment <= 0) return Infinity;
  
  const monthlyRate = debt.interestRate / 1200;
  const balance = debt.balance;
  
  if (monthlyRate === 0) {
    return Math.ceil(balance / availablePayment);
  }
  
  const months = Math.ceil(
    -Math.log(1 - (monthlyRate * balance) / availablePayment) / Math.log(1 + monthlyRate)
  );
  
  return isNaN(months) || months <= 0 ? Infinity : months;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};