import { Debt, PaymentAllocation } from "./types/debt";
import { calculateMinimumPayments } from "./utils/minimumPayments";
import { calculateExtraPayments } from "./utils/extraPayments";
import { validateAllocations } from "./utils/paymentValidation";

export const calculateMonthlyAllocation = (
  debts: Debt[],
  monthlyPayment: number
): PaymentAllocation => {
  console.log('Starting monthly allocation calculation with payment:', monthlyPayment);
  
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
  monthlyPayment: number
): number => {
  if (monthlyPayment <= 0) return Infinity;
  
  let balance = debt.balance;
  let months = 0;
  const monthlyRate = debt.interestRate / 1200;

  console.log(`Calculating payoff time for ${debt.name}:`, {
    initialBalance: balance,
    monthlyPayment,
    monthlyRate
  });

  while (balance > 0.01 && months < 1200) {
    const interest = balance * monthlyRate;
    
    if (monthlyPayment <= interest) {
      console.log(`Payment cannot cover interest for ${debt.name}`);
      return Infinity;
    }

    const principalPayment = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPayment);
    months++;

    console.log(`Month ${months} for ${debt.name}:`, {
      startingBalance: balance + principalPayment,
      interest,
      principalPayment,
      newBalance: balance
    });
  }

  return months >= 1200 ? Infinity : months;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};