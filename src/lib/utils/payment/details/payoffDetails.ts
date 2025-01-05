import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus } from "../types/PaymentTypes";
import { RedistributionManager } from "../redistributionManager";
import { MonthlyCalculator } from "../monthlyCalculator";
import { addMonths } from "date-fns";
import { calculateMonthlyInterest } from "../interestCalculations";

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: { payment_date: string; amount: number }[] = []
): { [key: string]: DebtStatus } => {
  console.log('🔄 Starting payoff calculation:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name
  });

  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  const redistributionManager = new RedistributionManager();
  const monthlyCalculator = new MonthlyCalculator(
    debts,
    monthlyPayment,
    strategy,
    redistributionManager
  );

  // Initialize tracking
  debts.forEach(debt => {
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
    balances.set(debt.id, debt.balance);
  });

  let currentMonth = 0;
  const maxMonths = 1200;
  let remainingDebts = [...debts];
  const startDate = new Date();

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    
    // Process monthly payments and interest
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      const payment = monthlyCalculator.calculateMonthlyPayments(currentMonth).payments.get(debt.id);
      
      if (!payment) continue;

      // Calculate total payment including any redistributions
      const totalPayment = Math.min(
        payment.baseAmount + payment.redistributedAmount,
        currentBalance + monthlyInterest
      );

      // Update balance and track interest
      const newBalance = Math.max(0, currentBalance + monthlyInterest - totalPayment);
      balances.set(debt.id, newBalance);
      results[debt.id].totalInterest += monthlyInterest;

      console.log(`Month ${currentMonth + 1} calculation for ${debt.name}:`, {
        startingBalance: currentBalance,
        interest: monthlyInterest,
        basePayment: payment.baseAmount,
        redistributed: payment.redistributedAmount,
        totalPayment,
        newBalance,
        isLastPayment: newBalance <= 0.01
      });
    }

    // Check for paid off debts and handle redistribution
    const newRemainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);

        // Calculate final payment and redistribution amount
        const finalMonthlyInterest = calculateMonthlyInterest(debt.balance, debt.interest_rate);
        const finalPaymentNeeded = currentBalance + finalMonthlyInterest;
        
        // Calculate redistribution as the difference between minimum payment and final payment needed
        const redistributionAmount = Math.max(0, debt.minimum_payment - finalPaymentNeeded);

        console.log(`Debt ${debt.name} paid off in month ${currentMonth + 1}:`, {
          finalBalance: currentBalance,
          finalInterest: finalMonthlyInterest,
          finalPaymentNeeded,
          minimumPayment: debt.minimum_payment,
          redistributionAmount
        });

        // When a debt is paid off, redistribute its minimum payment
        if (remainingDebts.length > 1 && redistributionAmount > 0) {
          const nextDebt = strategy.calculate(
            remainingDebts.filter(d => d.id !== debt.id)
          )[0];

          if (nextDebt) {
            console.log(`Redistributing payment from ${debt.name} to ${nextDebt.name}:`, {
              minimumPayment: debt.minimum_payment,
              finalPayment: finalPaymentNeeded,
              redistributionAmount,
              month: currentMonth + 1
            });

            redistributionManager.trackRedistribution(
              debt.id,
              nextDebt.id,
              redistributionAmount,
              currentMonth + 2 // Add 2 because redistribution starts next month
            );
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

  // Apply redistribution history to results
  redistributionManager.applyToResults(results);

  return results;
};