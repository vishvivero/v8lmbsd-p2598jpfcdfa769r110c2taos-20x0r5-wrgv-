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
  
  // Initialize balances and results
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    minimumPayments.set(debt.id, debt.minimum_payment);
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      proposedPayment: debt.minimum_payment,
      payoffDate: new Date()
    };
  });

  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap
  
  while (balances.size > 0 && currentMonth < maxMonths) {
    let availablePayment = monthlyPayment;
    const activeDebts = strategy.calculate(debts.filter(d => balances.has(d.id)));
    
    // First, allocate minimum payments
    activeDebts.forEach(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, currentBalance);
      
      if (availablePayment >= minPayment) {
        availablePayment -= minPayment;
        results[debt.id].proposedPayment = minPayment;
      } else {
        console.warn(`Insufficient funds for minimum payment of ${minPayment} for debt ${debt.name}`);
      }
    });

    // Then, allocate any extra payment to the highest priority debt
    if (availablePayment > 0 && activeDebts.length > 0) {
      const priorityDebt = activeDebts[0];
      const currentBalance = balances.get(priorityDebt.id) || 0;
      const extraPayment = Math.min(availablePayment, currentBalance - results[priorityDebt.id].proposedPayment);
      results[priorityDebt.id].proposedPayment += extraPayment;
      console.log(`Allocating extra payment of ${extraPayment} to ${priorityDebt.name}`);
    }

    // Process payments and update balances
    activeDebts.forEach(debt => {
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
        
        // Release minimum payment back to available pool for next month
        const releasedPayment = minimumPayments.get(debt.id) || 0;
        console.log(`Releasing minimum payment of ${releasedPayment} from ${debt.name}`);
      } else {
        balances.set(debt.id, newBalance);
      }
    });

    currentMonth++;
  }

  console.log('Final payoff details:', results);
  return results;
};