import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding } from "./types";
import { calculateMonthlyInterest } from "./interestCalculations";
import { recordPaymentRedistribution } from "./paymentRedistribution";
import { trackRedistribution } from "./redistributionTracking";
import { addMonths } from "date-fns";

const calculateInitialState = (debts: Debt[]) => {
  const results: { [key: string]: DebtStatus } = {};
  const balances = new Map<string, number>();
  const minimumPayments = new Map<string, number>();
  const cascadedPayments = new Map<string, number>();

  debts.forEach(debt => {
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
    cascadedPayments.set(debt.id, 0);
  });

  return { results, balances, minimumPayments, cascadedPayments };
};

const processMonthlyPayments = (
  debt: Debt,
  currentBalance: number,
  monthlyAvailable: number,
  monthlyRate: number
) => {
  const monthlyInterest = currentBalance * monthlyRate;
  const minPayment = Math.min(debt.minimum_payment, currentBalance);
  
  if (monthlyAvailable >= minPayment) {
    const newBalance = Math.max(0, currentBalance + monthlyInterest - minPayment);
    return {
      newBalance,
      monthlyInterest,
      paymentMade: minPayment,
      remainingAvailable: monthlyAvailable - minPayment
    };
  }

  return {
    newBalance: currentBalance + monthlyInterest,
    monthlyInterest,
    paymentMade: 0,
    remainingAvailable: monthlyAvailable
  };
};

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

  const { results, balances, minimumPayments, cascadedPayments } = calculateInitialState(debts);
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();
  let availableExtraPayment = 0;

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
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

    // Process payments for each debt
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200;
      const cascadedAmount = cascadedPayments.get(debt.id) || 0;

      const {
        newBalance,
        monthlyInterest,
        paymentMade,
        remainingAvailable
      } = processMonthlyPayments(debt, currentBalance, monthlyAvailable + cascadedAmount, monthlyRate);

      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, newBalance);
      monthlyAvailable = remainingAvailable;

      // Check if debt is paid off
      if (newBalance <= 0.01) {
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        const totalRedistributed = releasedPayment + cascadedAmount;
        availableExtraPayment += totalRedistributed;
        
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
              currentMonth + 1,
              cascadedAmount
            );

            // Update cascaded payments for next debt
            cascadedPayments.set(nextDebt.id, (cascadedPayments.get(nextDebt.id) || 0) + totalRedistributed);

            console.log(`♻️ Redistributing payment from ${debt.name}:`, {
              baseAmount: releasedPayment,
              cascadedAmount,
              totalRedistributed,
              toDebt: nextDebt.name,
              month: currentMonth + 1
            });

            recordPaymentRedistribution({
              fromDebtId: debt.id,
              toDebtId: nextDebt.id,
              amount: totalRedistributed,
              userId: debt.user_id,
              currencySymbol: debt.currency_symbol
            }).catch(console.error);
          }
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
