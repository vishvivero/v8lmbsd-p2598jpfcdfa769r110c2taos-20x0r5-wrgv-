import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/lib/types/payment";
import { addMonths } from "date-fns";

interface PayoffResult {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  monthlyPayments: MonthlyPayment[];
  redistributions: Redistribution[];
}

interface MonthlyPayment {
  date: Date;
  debtId: string;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
  extraPayment: number;
  redistributedAmount: number;
}

interface Redistribution {
  month: number;
  fromDebtId: string;
  toDebtId: string;
  amount: number;
}

export const calculateUnifiedPayoff = (
  debts: Debt[],
  monthlyPayment: number,
  oneTimeFundings: OneTimeFunding[] = []
): { [key: string]: PayoffResult } => {
  if (!debts || debts.length === 0) {
    console.log('No debts provided to unified calculator');
    return {};
  }

  console.log('Starting unified payoff calculation:', {
    numberOfDebts: debts.length,
    monthlyPayment,
    oneTimeFundings: oneTimeFundings.length
  });

  const results: { [key: string]: PayoffResult } = {};
  const balances = new Map<string, number>();
  const minimumPayments = new Map<string, number>();
  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200;
  const startDate = new Date();

  // Initialize tracking
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      monthlyPayments: [],
      redistributions: []
    };
  });

  // Sort one-time fundings by date
  const sortedFundings = [...oneTimeFundings].sort(
    (a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime()
  );

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    const currentDate = addMonths(startDate, currentMonth);
    let availablePayment = monthlyPayment;

    // Add one-time fundings for this month
    const monthlyFundings = sortedFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });

    const oneTimeFundingAmount = monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);
    availablePayment += oneTimeFundingAmount;

    console.log(`Month ${currentMonth}: Processing payments:`, {
      availablePayment,
      oneTimeFundingAmount,
      remainingDebts: remainingDebts.length
    });

    // First handle minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, currentBalance);
      
      if (availablePayment >= minPayment) {
        const monthlyInterest = (debt.interest_rate / 1200) * currentBalance;
        results[debt.id].totalInterest += monthlyInterest;
        
        const payment = Math.min(minPayment, currentBalance + monthlyInterest);
        const principal = payment - monthlyInterest;
        const newBalance = Math.max(0, currentBalance - principal);
        
        balances.set(debt.id, newBalance);
        availablePayment -= payment;

        results[debt.id].monthlyPayments.push({
          date: new Date(currentDate),
          debtId: debt.id,
          payment,
          interest: monthlyInterest,
          principal,
          remainingBalance: newBalance,
          extraPayment: 0,
          redistributedAmount: 0
        });
      }
    }

    // Then apply extra payments according to priority
    if (availablePayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const monthlyInterest = (targetDebt.interest_rate / 1200) * currentBalance;
      
      const extraPayment = Math.min(availablePayment, currentBalance + monthlyInterest);
      const principal = extraPayment;
      const newBalance = Math.max(0, currentBalance - principal);
      
      balances.set(targetDebt.id, newBalance);
      
      const lastPayment = results[targetDebt.id].monthlyPayments[
        results[targetDebt.id].monthlyPayments.length - 1
      ];
      
      if (lastPayment) {
        lastPayment.payment += extraPayment;
        lastPayment.principal += principal;
        lastPayment.remainingBalance = newBalance;
        lastPayment.extraPayment = extraPayment;
      }
    }

    // Check for paid off debts and handle redistributions
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
        
        // Handle redistribution
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        const nextDebt = remainingDebts.find(d => d.id !== debt.id && (balances.get(d.id) || 0) > 0);
        
        if (nextDebt) {
          results[nextDebt.id].redistributions.push({
            month: currentMonth + 1,
            fromDebtId: debt.id,
            toDebtId: nextDebt.id,
            amount: releasedPayment
          });
        }
        
        return false;
      }
      return true;
    });

    currentMonth++;
  }

  // Handle unpaid debts
  remainingDebts.forEach(debt => {
    if (results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      results[debt.id].payoffDate = addMonths(startDate, maxMonths);
    }
  });

  return results;
};