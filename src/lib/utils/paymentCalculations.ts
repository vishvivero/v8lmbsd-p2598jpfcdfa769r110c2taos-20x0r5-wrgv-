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
  
  // Initialize balances and minimum payments
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

  // Calculate total minimum payments required
  const totalMinPayments = Array.from(minimumPayments.values()).reduce((sum, payment) => sum + payment, 0);
  console.log('Total minimum payments required:', totalMinPayments);

  // If we can't cover minimum payments, distribute proportionally
  if (monthlyPayment < totalMinPayments) {
    console.warn('Insufficient funds for minimum payments, distributing proportionally');
    debts.forEach(debt => {
      const proportion = debt.minimum_payment / totalMinPayments;
      const allocatedPayment = Number((monthlyPayment * proportion).toFixed(2));
      results[debt.id].proposedPayment = allocatedPayment;
      console.log(`Proportional allocation for ${debt.name}:`, allocatedPayment);
    });
    remainingPayment = 0;
  } else {
    // First allocate minimum payments
    debts.forEach(debt => {
      const minPayment = Math.min(minimumPayments.get(debt.id) || 0, balances.get(debt.id) || 0);
      results[debt.id].proposedPayment = minPayment;
      remainingPayment -= minPayment;
      console.log(`Allocated minimum payment of ${minPayment} to ${debt.name}, remaining: ${remainingPayment}`);
    });
  }

  // Sort debts according to strategy for extra payment allocation
  let activeDebts = strategy.calculate([...debts]);
  
  // Allocate extra payments
  while (remainingPayment > 0.01 && activeDebts.length > 0) {
    const priorityDebt = activeDebts[0];
    const currentBalance = balances.get(priorityDebt.id) || 0;
    const currentPayment = results[priorityDebt.id].proposedPayment;
    
    // Calculate how much more this debt can receive
    const maxAdditionalPayment = Math.max(0, currentBalance - currentPayment);
    const extraPayment = Math.min(remainingPayment, maxAdditionalPayment);
    
    if (extraPayment > 0) {
      results[priorityDebt.id].proposedPayment += extraPayment;
      remainingPayment -= extraPayment;
      console.log(`Allocated extra payment of ${extraPayment} to priority debt ${priorityDebt.name}`);
      
      // If this debt will be paid off, remove it and redistribute its minimum payment
      if (results[priorityDebt.id].proposedPayment >= currentBalance) {
        const releasedPayment = minimumPayments.get(priorityDebt.id) || 0;
        remainingPayment += releasedPayment;
        console.log(`${priorityDebt.name} will be paid off, releasing minimum payment: ${releasedPayment}`);
        activeDebts = strategy.calculate(activeDebts.filter(d => d.id !== priorityDebt.id));
      }
    } else {
      // Move to next debt if current one doesn't need more payment
      activeDebts = strategy.calculate(activeDebts.filter(d => d.id !== priorityDebt.id));
    }
  }

  // Calculate months to payoff and total interest for each debt
  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap
  let unpaidDebts = new Set(debts.map(d => d.id));
  
  while (unpaidDebts.size > 0 && currentMonth < maxMonths) {
    for (const debt of debts) {
      if (!unpaidDebts.has(debt.id)) continue;

      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200; // Convert annual rate to monthly
      const payment = results[debt.id].proposedPayment;
      
      const monthlyInterest = Number((currentBalance * monthlyRate).toFixed(2));
      results[debt.id].totalInterest += monthlyInterest;
      
      const newBalance = Number((currentBalance + monthlyInterest - payment).toFixed(2));
      
      if (newBalance <= 0.01) {
        // Debt is paid off
        unpaidDebts.delete(debt.id);
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + currentMonth + 1);
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = payoffDate;
        console.log(`${debt.name} will be paid off in ${currentMonth + 1} months`);
      } else {
        balances.set(debt.id, newBalance);
      }
    }
    currentMonth++;
  }

  console.log('Final payment allocations:', results);
  return results;
};