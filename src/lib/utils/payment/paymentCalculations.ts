import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, MonthlyCalculation } from "./types/PaymentTypes";
import { RedistributionManager } from "./redistributionManager";
import { MonthlyCalculator } from "./monthlyCalculator";
import { addMonths, format } from "date-fns";
import { calculateMonthlyInterest } from "./interestCalculations";

export const calculatePayoffTimeline = (debt: Debt, extraPayment: number = 0): { date: string; balance: number }[] => {
  console.log('Calculating payoff timeline for debt:', {
    debtName: debt.name,
    startingBalance: debt.balance,
    extraPayment,
    minimumPayment: debt.minimum_payment
  });

  const timeline: { date: string; balance: number }[] = [];
  let currentBalance = debt.balance;
  const startDate = new Date();
  let currentDate = startDate;
  
  // Continue until debt is paid off or max iterations reached
  for (let month = 0; month < 360 && currentBalance > 0; month++) {
    const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
    const totalPayment = debt.minimum_payment + extraPayment;
    
    currentBalance = Math.max(0, currentBalance + monthlyInterest - totalPayment);
    currentDate = addMonths(startDate, month);
    
    timeline.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      balance: Number(currentBalance.toFixed(2))
    });

    if (currentBalance === 0) break;
  }

  console.log('Payoff timeline calculated:', {
    totalMonths: timeline.length,
    finalBalance: timeline[timeline.length - 1].balance
  });

  return timeline;
};

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
    // Calculate payments for this month
    const monthlyCalc = monthlyCalculator.calculateMonthlyPayments(currentMonth);
    
    // Process each debt's payment and interest
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      const payment = monthlyCalc.payments.get(debt.id);
      
      if (!payment) continue;

      const totalPayment = payment.baseAmount + payment.redistributedAmount;
      const newBalance = Math.max(0, currentBalance + monthlyInterest - totalPayment);
      
      balances.set(debt.id, newBalance);
      results[debt.id].totalInterest += monthlyInterest;

      console.log(`Month ${currentMonth + 1} calculation for ${debt.name}:`, {
        startingBalance: currentBalance,
        interest: monthlyInterest,
        payment: totalPayment,
        redistributed: payment.redistributedAmount,
        newBalance,
        isLastPayment: newBalance <= 0.01
      });
    }

    // Check for paid off debts
    const newRemainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);

        // When a debt is paid off, redistribute its minimum payment
        if (remainingDebts.length > 1) {
          const nextDebt = strategy.calculate(
            remainingDebts.filter(d => d.id !== debt.id)
          )[0];

          if (nextDebt) {
            redistributionManager.trackRedistribution(
              debt.id,
              nextDebt.id,
              debt.minimum_payment,
              currentMonth + 1
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