import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding, RedistributionEntry } from "./types";
import { calculateMonthlyInterest } from "./interestCalculations";
import { recordPaymentRedistribution } from "./paymentRedistribution";
import { addMonths } from "date-fns";

const initializeRedistributionHistory = () => {
  return new Map<string, RedistributionEntry[]>();
};

const trackRedistribution = (
  redistributionHistory: Map<string, RedistributionEntry[]>,
  fromDebtId: string,
  toDebtId: string,
  amount: number,
  month: number
) => {
  const existingHistory = redistributionHistory.get(toDebtId) || [];
  existingHistory.push({
    fromDebtId,
    amount,
    month
  });
  redistributionHistory.set(toDebtId, existingHistory);
  
  console.log(`Tracked redistribution:`, {
    from: fromDebtId,
    to: toDebtId,
    amount,
    month
  });
};

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): { [key: string]: DebtStatus } => {
  console.log('Starting payoff calculation with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name,
    oneTimeFundings
  });

  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();
  let releasedPayments = 0;
  const redistributionHistory = initializeRedistributionHistory();

  // Initialize results
  debts.forEach(debt => {
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
    balances.set(debt.id, debt.balance);
  });

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment + releasedPayments;

    // Add one-time funding for this month
    const currentDate = addMonths(startDate, currentMonth);
    const applicableFundings = oneTimeFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return (
        fundingDate.getFullYear() === currentDate.getFullYear() &&
        fundingDate.getMonth() === currentDate.getMonth()
      );
    });

    if (applicableFundings.length > 0) {
      const additionalPayment = applicableFundings.reduce((sum, funding) => sum + funding.amount, 0);
      availablePayment += additionalPayment;
    }

    // Calculate interest and minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, currentBalance + monthlyInterest);
    }

    // Allocate payments
    let remainingMonthlyPayment = availablePayment;
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(debt.minimum_payment, currentBalance);
      
      if (remainingMonthlyPayment >= minPayment) {
        balances.set(debt.id, currentBalance - minPayment);
        remainingMonthlyPayment -= minPayment;
      }
    }

    // Allocate extra payment to highest priority debt
    if (remainingMonthlyPayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(remainingMonthlyPayment, currentBalance);
      
      if (extraPayment > 0) {
        balances.set(targetDebt.id, currentBalance - extraPayment);
      }
    }

    // Check for paid off debts and handle redistribution
    const newRemainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        const releasedAmount = debt.minimum_payment;
        releasedPayments += releasedAmount;
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
        
        // Update debt status and record redistribution
        updateDebtStatus(debt.id).catch(console.error);
        
        // Record redistribution if there's a next debt
        if (remainingDebts.length > 1) {
          const nextDebt = remainingDebts[1];
          trackRedistribution(
            redistributionHistory,
            debt,
            nextDebt.id,
            releasedAmount,
            currentMonth + 1
          );

          recordPaymentRedistribution({
            fromDebtId: debt.id,
            toDebtId: nextDebt.id,
            amount: releasedAmount
          }).catch(console.error);
        }
        
        return false;
      }
      return true;
    });

    if (newRemainingDebts.length < remainingDebts.length) {
      remainingDebts = strategy.calculate([...newRemainingDebts]);
    } else {
      remainingDebts = newRemainingDebts;
    }

    currentMonth++;
  }

  // Handle debts that couldn't be paid off
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    }
  });

  // Add redistribution history to results
  Object.keys(results).forEach(debtId => {
    results[debtId].redistributionHistory = redistributionHistory.get(debtId) || [];
  });

  return results;
};

export const calculatePayoffTimeline = (
  debt: Debt,
  extraPayment: number = 0
): Array<{ date: string; balance: number; balanceWithExtra?: number }> => {
  const timeline: Array<{ date: string; balance: number; balanceWithExtra?: number }> = [];
  let currentBalance = debt.balance;
  let currentBalanceWithExtra = debt.balance;
  let currentDate = new Date();

  for (let month = 0; month < 360 && (currentBalance > 0 || currentBalanceWithExtra > 0); month++) {
    const date = addMonths(currentDate, month);
    
    // Calculate regular balance
    if (currentBalance > 0) {
      const monthlyInterest = (currentBalance * (debt.interest_rate / 100)) / 12;
      currentBalance += monthlyInterest;
      currentBalance = Math.max(0, currentBalance - debt.minimum_payment);
    }

    // Calculate balance with extra payment
    if (currentBalanceWithExtra > 0 && extraPayment > 0) {
      const monthlyInterest = (currentBalanceWithExtra * (debt.interest_rate / 100)) / 12;
      currentBalanceWithExtra += monthlyInterest;
      currentBalanceWithExtra = Math.max(0, currentBalanceWithExtra - (debt.minimum_payment + extraPayment));
    }

    timeline.push({
      date: date.toISOString(),
      balance: Number(currentBalance.toFixed(2)),
      ...(extraPayment > 0 && { balanceWithExtra: Number(currentBalanceWithExtra.toFixed(2)) })
    });

    // Break if both balances are paid off
    if (currentBalance <= 0 && currentBalanceWithExtra <= 0) break;
  }

  return timeline;
};
