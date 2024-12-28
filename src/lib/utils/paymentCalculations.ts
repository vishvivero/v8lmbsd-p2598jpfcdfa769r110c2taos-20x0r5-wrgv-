import { Debt } from "../types/debt";
import { Strategy } from "../strategies";

interface PaymentDetails {
  months: number;
  totalInterest: number;
  proposedPayment: number;
  payoffDate: Date;
}

export const calculatePayoffDetails = (
  debts: Debt[],
  monthlyPayment: number,
  strategy: Strategy
): { [key: string]: PaymentDetails } => {
  console.log('Starting payoff calculation with:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategy: strategy.name
  });

  const results: { [key: string]: PaymentDetails } = {};
  const balances = new Map<string, number>();
  const minimumPayments = new Map<string, number>();
  let remainingPayment = monthlyPayment;
  
  // Initialize balances and results
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      proposedPayment: 0,
      payoffDate: new Date()
    };
  });

  // First, allocate minimum payments to all debts
  let totalMinPayments = 0;
  debts.forEach(debt => {
    const minPayment = Math.min(minimumPayments.get(debt.id) || 0, balances.get(debt.id) || 0);
    totalMinPayments += minPayment;
  });

  // If we can't cover minimum payments, distribute proportionally
  if (monthlyPayment < totalMinPayments) {
    console.warn('Insufficient funds for all minimum payments, distributing proportionally');
    debts.forEach(debt => {
      const proportion = debt.minimum_payment / totalMinPayments;
      const allocatedPayment = Number((monthlyPayment * proportion).toFixed(2));
      results[debt.id].proposedPayment = allocatedPayment;
      remainingPayment = 0;
    });
  } else {
    // Allocate minimum payments if we have enough funds
    debts.forEach(debt => {
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, balances.get(debt.id) || 0);
      results[debt.id].proposedPayment = minPayment;
      remainingPayment -= minPayment;
      console.log(`Allocated minimum payment of ${minPayment} to ${debt.name}, remaining: ${remainingPayment}`);
    });
  }

  // Sort debts according to strategy for extra payment allocation
  let prioritizedDebts = strategy.calculate([...debts]);
  
  // Calculate months to payoff and total interest for each debt
  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap
  
  while (balances.size > 0 && currentMonth < maxMonths) {
    // Allocate any remaining payment to highest priority debt
    if (remainingPayment > 0) {
      const priorityDebt = prioritizedDebts.find(d => balances.has(d.id));
      if (priorityDebt) {
        const currentBalance = balances.get(priorityDebt.id) || 0;
        const currentPayment = results[priorityDebt.id].proposedPayment;
        const extraPayment = Math.min(remainingPayment, currentBalance);
        results[priorityDebt.id].proposedPayment += extraPayment;
        remainingPayment -= extraPayment;
        console.log(`Allocated extra payment of ${extraPayment} to priority debt ${priorityDebt.name}`);
      }
    }

    // Process payments and update balances for each debt
    for (const debt of prioritizedDebts) {
      if (!balances.has(debt.id)) continue;

      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200;
      const payment = results[debt.id].proposedPayment;
      
      const monthlyInterest = Number((currentBalance * monthlyRate).toFixed(2));
      results[debt.id].totalInterest += monthlyInterest;
      
      const newBalance = Number((currentBalance + monthlyInterest - payment).toFixed(2));
      
      if (newBalance <= 0.01) {
        // Debt is paid off
        balances.delete(debt.id);
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + currentMonth + 1);
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = payoffDate;
        
        console.log(`${debt.name} paid off after ${currentMonth + 1} months`);
        
        // Reallocate this debt's minimum payment and any extra payments
        const releasedPayment = payment;
        remainingPayment += releasedPayment;
        console.log(`Released payment of ${releasedPayment} from ${debt.name} for reallocation`);
        
        // Re-sort remaining debts according to strategy
        prioritizedDebts = strategy.calculate(prioritizedDebts.filter(d => balances.has(d.id)));
      } else {
        balances.set(debt.id, newBalance);
      }
    }
    currentMonth++;
  }

  console.log('Final payoff details:', results);
  return results;
};