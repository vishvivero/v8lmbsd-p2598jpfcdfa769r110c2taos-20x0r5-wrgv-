import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding } from "./types";
import { calculateMonthlyInterest } from "./calculations/interestCalculator";
import { trackRedistribution } from "./redistributionTracking";
import { addMonths } from "date-fns";

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): { [key: string]: DebtStatus } => {
  console.log('🔄 Starting payoff calculation:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name,
    totalMinPayments: debts.reduce((sum, d) => sum + d.minimum_payment, 0)
  });

  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  const minimumPayments = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();

  // Initialize tracking
  debts.forEach(debt => {
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
  });

  // Calculate total minimum payments required
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  
  if (monthlyPayment < totalMinimumPayments) {
    console.warn('Monthly payment insufficient to cover minimum payments');
    debts.forEach(debt => {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    });
    return results;
  }

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let monthlyAvailable = monthlyPayment;

    const currentDate = addMonths(startDate, currentMonth);
    
    // Process one-time fundings for this month
    const monthlyFundings = oneTimeFundings
      .filter(funding => {
        const fundingDate = new Date(funding.payment_date);
        return fundingDate.getMonth() === currentDate.getMonth() &&
               fundingDate.getFullYear() === currentDate.getFullYear();
      });

    // Apply one-time fundings with rollover
    let extraPayment = monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);
    console.log(`Month ${currentMonth}: Processing one-time fundings:`, {
      totalFunding: extraPayment,
      numberOfFundings: monthlyFundings.length
    });

    // First handle minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, currentBalance);
      
      if (monthlyAvailable >= minPayment) {
        const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
        results[debt.id].totalInterest += monthlyInterest;
        
        const newBalance = Math.max(0, currentBalance + monthlyInterest - minPayment);
        balances.set(debt.id, newBalance);
        monthlyAvailable -= minPayment;
      }
    }

    // Then apply extra payments (including rollovers) according to strategy
    while (extraPayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      
      if (currentBalance <= 0) {
        remainingDebts.shift();
        continue;
      }

      const monthlyInterest = calculateMonthlyInterest(currentBalance, targetDebt.interest_rate);
      const requiredToPayoff = currentBalance + monthlyInterest;
      const payment = Math.min(extraPayment, requiredToPayoff);
      
      console.log(`Applying extra payment to ${targetDebt.name}:`, {
        currentBalance,
        payment,
        remainingExtra: extraPayment - payment
      });

      const newBalance = Math.max(0, currentBalance + monthlyInterest - payment);
      balances.set(targetDebt.id, newBalance);
      extraPayment -= payment;

      if (newBalance <= 0) {
        console.log(`${targetDebt.name} paid off, rolling over ${extraPayment} to next debt`);
        const nextDebt = remainingDebts[1];
        if (nextDebt) {
          trackRedistribution(
            results,
            targetDebt.id,
            nextDebt.id,
            extraPayment,
            currentMonth + 1
          );
        }
        remainingDebts.shift();
      }
    }

    // Check for paid off debts and handle redistributions
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
        
        // Release minimum payment for redistribution
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        monthlyAvailable += releasedPayment;

        const nextDebt = remainingDebts.find(d => d.id !== debt.id && (balances.get(d.id) || 0) > 0);
        if (nextDebt) {
          trackRedistribution(
            results,
            debt.id,
            nextDebt.id,
            releasedPayment,
            currentMonth + 1
          );
        }
        
        return false;
      }
      return true;
    });

    currentMonth++;
  }

  // Handle debts that couldn't be paid off
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    }
  });

  return results;
};

export { calculateAmortizationSchedule } from './calculations/amortizationCalculator';
export type { AmortizationEntry } from './calculations/amortizationCalculator';
export { calculatePayoffSummary } from './calculations/payoffCalculator';
export type { PayoffSummary } from './calculations/payoffCalculator';