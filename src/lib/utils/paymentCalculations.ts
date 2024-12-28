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
  debts.forEach(debt => {
    const minPayment = Math.min(minimumPayments.get(debt.id) || 0, balances.get(debt.id) || 0);
    if (remainingPayment >= minPayment) {
      remainingPayment -= minPayment;
      results[debt.id].proposedPayment = minPayment;
      console.log(`Allocated minimum payment of ${minPayment} to ${debt.name}, remaining: ${remainingPayment}`);
    } else {
      console.warn(`Insufficient funds for minimum payment of ${minPayment} for debt ${debt.name}`);
    }
  });

  // Sort debts according to strategy for extra payment allocation
  const prioritizedDebts = strategy.calculate([...debts]);
  
  // Allocate any remaining payment to highest priority debt
  if (remainingPayment > 0) {
    const priorityDebt = prioritizedDebts[0];
    if (priorityDebt) {
      const currentBalance = balances.get(priorityDebt.id) || 0;
      const currentPayment = results[priorityDebt.id].proposedPayment;
      const extraPayment = Math.min(remainingPayment, currentBalance - currentPayment);
      results[priorityDebt.id].proposedPayment += extraPayment;
      console.log(`Allocated extra payment of ${extraPayment} to priority debt ${priorityDebt.name}`);
    }
  }

  // Calculate months to payoff and total interest for each debt
  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap
  
  while (balances.size > 0 && currentMonth < maxMonths) {
    // Process payments and update balances for each debt
    for (const debt of prioritizedDebts) {
      if (!balances.has(debt.id)) continue;

      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200;
      const payment = results[debt.id].proposedPayment;
      
      const monthlyInterest = currentBalance * monthlyRate;
      results[debt.id].totalInterest += monthlyInterest;
      
      const newBalance = currentBalance + monthlyInterest - payment;
      
      if (newBalance <= 0.01) {
        // Debt is paid off
        balances.delete(debt.id);
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + currentMonth + 1);
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = payoffDate;
        
        console.log(`${debt.name} paid off after ${currentMonth + 1} months`);
        
        // Reallocate this debt's minimum payment to the next highest priority debt
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        const nextDebt = prioritizedDebts.find(d => balances.has(d.id));
        if (nextDebt && releasedPayment > 0) {
          results[nextDebt.id].proposedPayment += releasedPayment;
          console.log(`Reallocated ${releasedPayment} from ${debt.name} to ${nextDebt.name}`);
        }
      } else {
        balances.set(debt.id, newBalance);
      }
    }
    currentMonth++;
  }

  console.log('Final payoff details:', results);
  return results;
};