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
  let remainingDebts = [...debts];
  
  // Initialize results and balances
  debts.forEach(debt => {
    balances.set(debt.id, debt.balance);
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      proposedPayment: debt.minimum_payment,
      payoffDate: new Date()
    };
  });

  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap
  let availablePayment = monthlyPayment;
  let totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    console.log(`Month ${currentMonth + 1}: Processing ${remainingDebts.length} debts with ${availablePayment} available`);
    
    // First, allocate minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(debt.minimum_payment, currentBalance);
      
      if (availablePayment >= minPayment) {
        results[debt.id].proposedPayment = minPayment;
        availablePayment -= minPayment;
      } else {
        console.warn(`Insufficient funds for minimum payment of ${debt.name}`);
        break;
      }
    }

    // Then, allocate extra payments according to strategy priority
    if (availablePayment > 0) {
      for (const debt of remainingDebts) {
        const currentBalance = balances.get(debt.id) || 0;
        const currentPayment = results[debt.id].proposedPayment;
        const maxAdditionalPayment = Math.max(0, currentBalance - currentPayment);
        const extraPayment = Math.min(availablePayment, maxAdditionalPayment);
        
        if (extraPayment > 0) {
          results[debt.id].proposedPayment += extraPayment;
          availablePayment -= extraPayment;
          
          if (availablePayment <= 0) break;
        }
      }
    }

    // Process payments and update balances
    const paidOffDebts: string[] = [];
    
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200;
      const payment = results[debt.id].proposedPayment;
      
      const monthlyInterest = Number((currentBalance * monthlyRate).toFixed(2));
      results[debt.id].totalInterest += monthlyInterest;
      
      const newBalance = Number((currentBalance + monthlyInterest - payment).toFixed(2));
      
      if (newBalance <= 0.01) {
        // Debt is paid off
        paidOffDebts.push(debt.id);
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + currentMonth + 1);
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = payoffDate;
        
        // Release minimum payment for redistribution
        availablePayment += debt.minimum_payment;
        totalMinPayments -= debt.minimum_payment;
        console.log(`${debt.name} paid off in month ${currentMonth + 1}. Released payment: ${debt.minimum_payment}`);
      } else {
        balances.set(debt.id, newBalance);
      }
    }

    // Remove paid off debts
    if (paidOffDebts.length > 0) {
      remainingDebts = remainingDebts.filter(debt => !paidOffDebts.includes(debt.id));
      
      // Recalculate proposed payments for remaining debts
      for (const debt of remainingDebts) {
        const currentBalance = balances.get(debt.id) || 0;
        if (currentBalance > 0) {
          // Reset to minimum payment first
          results[debt.id].proposedPayment = debt.minimum_payment;
        }
      }
      
      console.log(`${paidOffDebts.length} debts paid off, ${remainingDebts.length} remaining. Available: ${availablePayment}`);
    }

    currentMonth++;
  }

  console.log('Payoff calculation results:', results);
  return results;
};