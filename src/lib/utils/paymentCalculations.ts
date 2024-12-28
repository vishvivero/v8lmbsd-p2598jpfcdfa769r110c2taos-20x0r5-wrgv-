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
  const today = new Date();

  // Continue until all debts are paid or we hit the cap
  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    let availablePayment = monthlyPayment;

    // First, calculate interest for all debts
    remainingDebts.forEach(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200; // Convert annual rate to monthly
      const monthlyInterest = Number((currentBalance * monthlyRate).toFixed(2));
      
      results[debt.id].totalInterest += monthlyInterest;
      balances.set(debt.id, currentBalance + monthlyInterest);
      
      console.log(`Month ${currentMonth + 1}: ${debt.name} - Balance: ${currentBalance.toFixed(2)}, Interest: ${monthlyInterest.toFixed(2)}`);
    });

    // Then, allocate minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(debt.minimum_payment, currentBalance);
      
      if (availablePayment >= minPayment) {
        const newBalance = currentBalance - minPayment;
        balances.set(debt.id, newBalance);
        availablePayment -= minPayment;
        
        console.log(`Month ${currentMonth + 1}: ${debt.name} - Min Payment: ${minPayment.toFixed(2)}, New Balance: ${newBalance.toFixed(2)}`);
      } else {
        console.log(`Insufficient funds for minimum payments in month ${currentMonth + 1}`);
        return results;
      }
    }

    // Finally, allocate remaining payment to highest priority debt
    if (availablePayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const currentBalance = balances.get(targetDebt.id) || 0;
      const extraPayment = Math.min(availablePayment, currentBalance);
      const newBalance = currentBalance - extraPayment;
      
      balances.set(targetDebt.id, newBalance);
      console.log(`Month ${currentMonth + 1}: ${targetDebt.name} - Extra Payment: ${extraPayment.toFixed(2)}, Final Balance: ${newBalance.toFixed(2)}`);
    }

    // Check which debts are paid off
    remainingDebts = remainingDebts.filter(debt => {
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0.01) {
        const payoffDate = new Date(today);
        payoffDate.setMonth(payoffDate.getMonth() + currentMonth + 1);
        results[debt.id].months = currentMonth + 1;
        results[debt.id].payoffDate = payoffDate;
        
        console.log(`${debt.name} paid off in month ${currentMonth + 1} with total interest: ${results[debt.id].totalInterest.toFixed(2)}`);
        return false;
      }
      return true;
    });

    currentMonth++;
  }

  // Handle debts that couldn't be paid off within maxMonths
  remainingDebts.forEach(debt => {
    if (!results[debt.id].payoffDate || results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      const infiniteDate = new Date(today);
      infiniteDate.setFullYear(infiniteDate.getFullYear() + 100);
      results[debt.id].payoffDate = infiniteDate;
    }
  });

  console.log('Final payoff calculation results:', results);
  return results;
};