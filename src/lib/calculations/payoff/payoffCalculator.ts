import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus, OneTimeFunding, PayoffSummary } from "./types";
import { addMonths } from "date-fns";

export const calculateMonthlyInterest = (balance: number, interestRate: number): number => {
  return Number(((balance * (interestRate / 100)) / 12).toFixed(2));
};

export const calculateMinimumPayments = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.minimum_payment, 0);
};

export const calculateTotalBalance = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.balance, 0);
};

export const calculatePayoffSummary = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
): PayoffSummary => {
  const payoffDetails = calculatePayoffSchedule(debts, monthlyPayment, strategy, oneTimeFundings);
  
  // Sort debts by payoff date to determine order
  const debtPayoffOrder = Object.entries(payoffDetails)
    .sort((a, b) => a[1].months - b[1].months)
    .map(([debtId]) => debtId);

  const totalMonths = Math.max(...Object.values(payoffDetails).map(detail => detail.months));
  const totalInterest = Object.values(payoffDetails)
    .reduce((sum, detail) => sum + detail.totalInterest, 0);
  
  const finalPayoffDate = Object.values(payoffDetails)
    .reduce((latest, detail) => 
      detail.payoffDate > latest ? detail.payoffDate : latest,
      new Date()
    );

  return {
    totalMonths,
    totalInterest,
    finalPayoffDate,
    debtPayoffOrder,
    monthlyPayments: calculateInitialPayments(debts, monthlyPayment, strategy)
  };
};

const calculateInitialPayments = (
  debts: Debt[],
  totalMonthlyPayment: number,
  strategy: Strategy
) => {
  const sortedDebts = strategy.calculate([...debts]);
  const minimumTotal = calculateMinimumPayments(debts);
  const extraPayment = Math.max(0, totalMonthlyPayment - minimumTotal);
  
  return sortedDebts.map((debt, index) => ({
    debtId: debt.id,
    amount: debt.minimum_payment + (index === 0 ? extraPayment : 0)
  }));
};

export const calculatePayoffSchedule = (
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
  const minimumPayments = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();
  let releasedPayments = 0;

  // Initialize tracking
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      redistributionHistory: []
    };
  });

  // Calculate total minimum payments required
  const totalMinimumPayments = calculateMinimumPayments(debts);
  
  if (monthlyPayment < totalMinimumPayments) {
    console.warn('Monthly payment insufficient to cover minimum payments');
    debts.forEach(debt => {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    });
    return results;
  }

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment + releasedPayments;
    releasedPayments = 0;

    const currentDate = addMonths(startDate, currentMonth);
    
    // Add one-time funding for this month
    const monthlyFundings = oneTimeFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });

    availablePayment += monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);

    // First handle minimum payments and calculate interest
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      results[debt.id].totalInterest += monthlyInterest;
      
      // Update balance with interest
      balances.set(debt.id, currentBalance + monthlyInterest);
      
      // Apply minimum payment if possible
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, currentBalance + monthlyInterest);
      if (availablePayment >= minPayment) {
        balances.set(debt.id, (balances.get(debt.id) || 0) - minPayment);
        availablePayment -= minPayment;
      }
    }

    // Then apply extra payments according to strategy
    if (availablePayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0]; // First debt after sorting is highest priority
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(availablePayment, currentBalance);
      
      if (extraPayment > 0) {
        balances.set(targetDebt.id, currentBalance - extraPayment);
        console.log(`Applied extra payment to ${targetDebt.name}:`, {
          amount: extraPayment,
          newBalance: currentBalance - extraPayment
        });
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
        releasedPayments += releasedPayment;

        // Track redistribution if there are remaining debts
        const nextDebt = remainingDebts.find(d => d.id !== debt.id);
        if (nextDebt && results[nextDebt.id].redistributionHistory) {
          results[nextDebt.id].redistributionHistory?.push({
            fromDebtId: debt.id,
            amount: releasedPayment,
            month: currentMonth + 1
          });
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

  console.log('Payoff calculation completed:', {
    totalMonths: currentMonth,
    finalBalances: Object.fromEntries(balances),
    payoffDates: Object.entries(results).map(([id, detail]) => ({
      debtId: id,
      months: detail.months,
      payoffDate: detail.payoffDate.toISOString()
    }))
  });

  return results;
};