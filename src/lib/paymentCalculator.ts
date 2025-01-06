import { Debt } from "./types/debt";
import { PaymentAllocation } from "./types/payment";
import { calculateMinimumPayments } from "./utils/minimumPayments";
import { calculateExtraPayments } from "./utils/extraPayments";
import { validateAllocations } from "./utils/paymentValidation";

export const calculateMonthlyAllocation = (
  debts: Debt[],
  monthlyPayment: number,
  strategyId: string = 'avalanche'
): PaymentAllocation => {
  console.log('Starting monthly allocation calculation with:', {
    payment: monthlyPayment,
    strategyId,
    totalDebts: debts.length
  });
  
  const { allocations: initialAllocations, remainingPayment } = calculateMinimumPayments(
    debts,
    monthlyPayment
  );

  const finalAllocations = calculateExtraPayments(
    debts,
    initialAllocations,
    remainingPayment,
    strategyId
  );

  validateAllocations(debts, finalAllocations, monthlyPayment);

  console.log('Final monthly allocations:', finalAllocations);
  return finalAllocations;
};

export const calculatePayoffTime = (
  debt: Debt,
  monthlyPayment: number
): number => {
  if (monthlyPayment <= 0) return Infinity;
  
  let balance = debt.balance;
  let months = 0;
  const monthlyRate = debt.interest_rate / 1200;

  while (balance > 0.01 && months < 1200) {
    const interest = balance * monthlyRate;
    
    if (monthlyPayment <= interest) {
      console.log(`Payment cannot cover interest for ${debt.name}`);
      return Infinity;
    }

    const principalPayment = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPayment);
    months++;
  }

  return months >= 1200 ? Infinity : months;
};

export const formatCurrency = (amount: number, currencySymbol: string = '£'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};