import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

export interface PayoffDetails {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  redistributionHistory?: {
    fromDebtId: string;
    amount: number;
    month: number;
  }[];
}

export interface PaymentAllocation {
  debtId: string;
  amount: number;
  isExtra: boolean;
}

export const calculateMonthlyInterest = (balance: number, interestRate: number): number => {
  return Number(((balance * (interestRate / 100)) / 12).toFixed(2));
};

export const calculateDebtPayoff = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy,
  oneTimeFundings: OneTimeFunding[] = []
) => {
  console.log('Starting unified debt calculation:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name,
    oneTimeFundings: oneTimeFundings.map(f => ({
      date: f.payment_date,
      amount: f.amount
    }))
  });

  const results: { [key: string]: PayoffDetails } = {};
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

  const monthlyAllocations: PaymentAllocation[][] = [];

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment + releasedPayments;
    releasedPayments = 0;

    const currentDate = new Date(startDate.getTime() + (currentMonth * 30 * 24 * 60 * 60 * 1000));
    const currentAllocations: PaymentAllocation[] = [];

    // Add one-time funding for this month
    const monthlyFunding = oneTimeFundings.find(funding => {
      const fundingDate = new Date(funding.payment_date);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });

    if (monthlyFunding) {
      console.log(`Adding one-time funding for month ${currentMonth}:`, monthlyFunding.amount);
      availablePayment += monthlyFunding.amount;
    }

    // First handle minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
      results[debt.id].totalInterest += monthlyInterest;
      
      balances.set(debt.id, currentBalance + monthlyInterest);
      
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, currentBalance + monthlyInterest);
      if (availablePayment >= minPayment) {
        balances.set(debt.id, (balances.get(debt.id) || 0) - minPayment);
        availablePayment -= minPayment;
        currentAllocations.push({
          debtId: debt.id,
          amount: minPayment,
          isExtra: false
        });
      }
    }

    // Then apply extra payments according to strategy
    if (availablePayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(availablePayment, currentBalance);
      
      if (extraPayment > 0) {
        balances.set(targetDebt.id, currentBalance - extraPayment);
        currentAllocations.push({
          debtId: targetDebt.id,
          amount: extraPayment,
          isExtra: true
        });
        console.log(`Applied extra payment to ${targetDebt.name}:`, {
          amount: extraPayment,
          newBalance: currentBalance - extraPayment
        });
      }
    }

    monthlyAllocations.push(currentAllocations);

    // Check for paid off debts
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = new Date(startDate.getTime() + ((currentMonth + 1) * 30 * 24 * 60 * 60 * 1000));
        
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        releasedPayments += releasedPayment;

        // Track redistribution
        const nextDebt = remainingDebts.find(d => d.id !== debt.id && (balances.get(d.id) || 0) > 0);
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
      results[debt.id].payoffDate = new Date(startDate.getTime() + (maxMonths * 30 * 24 * 60 * 60 * 1000));
    }
  });

  console.log('Payoff calculation completed:', {
    totalMonths: currentMonth,
    finalBalances: Object.fromEntries(balances),
    payoffDates: Object.fromEntries(
      Object.entries(results).map(([id, detail]) => [
        id,
        detail.payoffDate.toISOString()
      ])
    )
  });

  return { results, monthlyAllocations };
};