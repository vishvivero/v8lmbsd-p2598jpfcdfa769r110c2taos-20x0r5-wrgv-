import { Debt } from "../types/debt";
import { Strategy } from "../strategies";

interface PaymentDetails {
  months: number;
  totalInterest: number;
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
      payoffDate: new Date()
    };
  });

  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    
    let availablePayment = monthlyPayment;
    console.log(`Month ${currentMonth + 1}: Processing ${remainingDebts.length} debts with ${availablePayment} available`);
    
    // Process minimum payments and extra payments
    const paidOffDebts: string[] = [];
    
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200;
      const payment = Math.min(availablePayment, currentBalance + (currentBalance * monthlyRate));
      
      const monthlyInterest = Number((currentBalance * monthlyRate).toFixed(2));
      results[debt.id].totalInterest += monthlyInterest;
      
      const newBalance = Number((currentBalance + monthlyInterest - payment).toFixed(2));
      
      console.log(`Processing ${debt.name}:`, {
        currentBalance,
        monthlyInterest,
        payment,
        newBalance
      });
      
      if (newBalance <= 0.01) {
        paidOffDebts.push(debt.id);
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + currentMonth + 1);
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = payoffDate;
        
        console.log(`${debt.name} paid off in month ${currentMonth + 1}`);
      } else {
        balances.set(debt.id, newBalance);
      }
      
      availablePayment = Math.max(0, availablePayment - payment);
    }

    // Remove paid off debts
    if (paidOffDebts.length > 0) {
      remainingDebts = remainingDebts.filter(debt => !paidOffDebts.includes(debt.id));
      console.log(`${paidOffDebts.length} debts paid off, ${remainingDebts.length} remaining`);
    }

    currentMonth++;
  }

  console.log('Payoff calculation results:', results);
  return results;
};