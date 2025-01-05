import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding } from "./types";
import { calculateMonthlyInterest } from "./interestCalculations";
import { recordPaymentRedistribution } from "./paymentRedistribution";
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
  const maxMonths = 1200; // 100 years cap
  const startDate = new Date();
  let availableExtraPayment = 0;

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
  
  // If monthly payment is less than total minimum payments, we can't make progress
  if (monthlyPayment < totalMinimumPayments) {
    console.warn('Monthly payment insufficient to cover minimum payments');
    debts.forEach(debt => {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    });
    return results;
  }

  // Extra payment available after minimum payments
  let extraPayment = monthlyPayment - totalMinimumPayments;
  console.log('Extra payment available:', extraPayment);

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    
    // Reset available payment for this month
    let monthlyAvailable = monthlyPayment + availableExtraPayment;
    availableExtraPayment = 0;

    // Add any one-time funding for this month
    const currentDate = addMonths(startDate, currentMonth);
    const monthlyFunding = oneTimeFundings
      .filter(funding => {
        const fundingDate = new Date(funding.payment_date);
        return fundingDate.getMonth() === currentDate.getMonth() &&
               fundingDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, funding) => sum + funding.amount, 0);
    
    monthlyAvailable += monthlyFunding;

    console.log(`📅 Month ${currentMonth + 1} calculation:`, {
      availablePayment: monthlyAvailable,
      oneTimeFunding: monthlyFunding,
      activeDebts: remainingDebts.length
    });

    // First, allocate minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, currentBalance);
      
      if (monthlyAvailable >= minPayment) {
        const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
        results[debt.id].totalInterest += monthlyInterest;
        
        // Apply minimum payment
        const newBalance = Math.max(0, currentBalance + monthlyInterest - minPayment);
        balances.set(debt.id, newBalance);
        monthlyAvailable -= minPayment;

        console.log(`💰 Applied minimum payment for ${debt.name}:`, {
          minPayment,
          interest: monthlyInterest,
          newBalance,
          remainingAvailable: monthlyAvailable
        });
      }
    }

    // Then, apply extra payment to highest priority debt
    if (monthlyAvailable > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(monthlyAvailable, currentBalance);
      
      if (extraPayment > 0) {
        const newBalance = Math.max(0, currentBalance - extraPayment);
        balances.set(targetDebt.id, newBalance);
        monthlyAvailable -= extraPayment;

        console.log(`⭐ Applied extra payment to ${targetDebt.name}:`, {
          extraPayment,
          newBalance,
          remainingAvailable: monthlyAvailable
        });
      }
    }

    // Check for paid off debts
    const newRemainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        // Debt is paid off
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        availableExtraPayment += releasedPayment;
        
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);

        // Record redistribution if there are remaining debts
        if (remainingDebts.length > 1) {
          const nextDebt = remainingDebts.find(d => d.id !== debt.id);
          if (nextDebt) {
            trackRedistribution(
              results,
              debt.id,
              nextDebt.id,
              releasedPayment,
              currentMonth + 1
            );

            console.log(`♻️ Redistributing payment from ${debt.name}:`, {
              amount: releasedPayment,
              toDebt: nextDebt.name,
              month: currentMonth + 1
            });
          }
        }
        
        return false;
      }
      return true;
    });

    remainingDebts = newRemainingDebts;
    currentMonth++;
  }

  // Handle debts that couldn't be paid off
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    }
  });

  // Log final results
  console.log('📊 Final payoff results:', Object.entries(results).map(([debtId, details]) => {
    const debt = debts.find(d => d.id === debtId);
    return {
      debtName: debt?.name,
      months: details.months,
      totalInterest: details.totalInterest,
      payoffDate: details.payoffDate,
      redistributions: details.redistributionHistory?.length || 0
    };
  }));

  return results;
};