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

  // Continue until all debts are paid or we hit the cap
  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    // Sort debts according to strategy at the start of each month
    remainingDebts = strategy.calculate([...remainingDebts]);
    
    let availablePayment = monthlyPayment;
    console.log(`Month ${currentMonth + 1}: Processing ${remainingDebts.length} debts with ${availablePayment} available`);

    // First, allocate minimum payments
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const minPayment = Math.min(debt.minimum_payment, currentBalance);
      
      if (availablePayment >= minPayment) {
        availablePayment -= minPayment;
      } else {
        console.log(`Insufficient funds for minimum payments in month ${currentMonth + 1}`);
        return results; // Return early if we can't make minimum payments
      }
    }

    // Then, allocate remaining payment to highest priority debt
    if (availablePayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0];
      const extraPayment = Math.min(
        availablePayment,
        balances.get(targetDebt.id) || 0
      );
      availablePayment -= extraPayment;
    }

    // Process payments and calculate interest
    const paidOffDebts: string[] = [];
    
    for (const debt of remainingDebts) {
      const currentBalance = balances.get(debt.id) || 0;
      const monthlyRate = debt.interest_rate / 1200; // Convert annual rate to monthly
      
      // Calculate this month's interest
      const monthlyInterest = Number((currentBalance * monthlyRate).toFixed(2));
      results[debt.id].totalInterest += monthlyInterest;

      // Calculate payment for this debt
      let payment = Math.min(debt.minimum_payment, currentBalance);
      if (debt.id === remainingDebts[0].id) {
        payment += Math.min(availablePayment, currentBalance - payment);
      }

      // Apply interest and payment
      const newBalance = Math.max(0, 
        Number((currentBalance + monthlyInterest - payment).toFixed(2))
      );
      
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
    }

    // Remove paid off debts
    if (paidOffDebts.length > 0) {
      remainingDebts = remainingDebts.filter(debt => !paidOffDebts.includes(debt.id));
      console.log(`${paidOffDebts.length} debts paid off, ${remainingDebts.length} remaining`);
    }

    currentMonth++;
  }

  // Handle debts that couldn't be paid off within maxMonths
  remainingDebts.forEach(debt => {
    if (!results[debt.id].payoffDate || results[debt.id].months === 0) {
      results[debt.id].months = maxMonths;
      const infiniteDate = new Date();
      infiniteDate.setFullYear(infiniteDate.getFullYear() + 100);
      results[debt.id].payoffDate = infiniteDate;
    }
  });

  console.log('Payoff calculation results:', results);
  return results;
};