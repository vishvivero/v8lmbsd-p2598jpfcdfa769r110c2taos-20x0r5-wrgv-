import { Debt } from "../types/debt";

export const calculatePayoffTimeWithCascading = (debts: Debt[], monthlyPayment: number): { [key: string]: number } => {
  console.log('Starting payoff time calculation with:', {
    totalDebts: debts.length,
    monthlyPayment
  });
  
  const payoffMonths: { [key: string]: number } = {};
  let remainingDebts = [...debts];
  let currentPayment = monthlyPayment;
  let months = 0;
  
  while (remainingDebts.length > 0 && months < 1200) {
    months++;
    const activeDebt = remainingDebts[0];
    
    // Calculate minimum payments for all remaining debts
    const totalMinPayments = remainingDebts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
    console.log(`Month ${months} - Total min payments:`, totalMinPayments);
    
    // Calculate extra payment for the focus debt
    const extraPayment = Math.max(0, currentPayment - totalMinPayments);
    const focusDebtPayment = activeDebt.minimum_payment + extraPayment;
    
    console.log(`Month ${months} - Debt ${activeDebt.name}:`, {
      minimumPayment: activeDebt.minimum_payment,
      extraPayment,
      totalPayment: focusDebtPayment
    });
    
    // Calculate interest and new balance
    const monthlyRate = activeDebt.interest_rate / 1200;
    const interest = activeDebt.balance * monthlyRate;
    const principalPayment = Math.min(focusDebtPayment - interest, activeDebt.balance);
    const newBalance = Math.max(0, activeDebt.balance - principalPayment);
    
    console.log(`Month ${months} - Balance calculation:`, {
      startingBalance: activeDebt.balance,
      interest,
      principalPayment,
      newBalance
    });
    
    // If debt is paid off
    if (newBalance <= 0.01) {
      console.log(`Month ${months} - Debt ${activeDebt.name} paid off`);
      payoffMonths[activeDebt.id] = months;
      remainingDebts.shift();
      // Release minimum payment back to the pool
      currentPayment = monthlyPayment;
      continue;
    }
    
    activeDebt.balance = newBalance;
  }
  
  console.log('Final payoff months:', payoffMonths);
  return payoffMonths;
};

export const calculateTotalInterest = (debt: Debt, monthlyPayment: number): number => {
  if (monthlyPayment <= 0) return 0;

  let balance = debt.balance;
  let totalInterest = 0;
  const monthlyRate = debt.interest_rate / 1200;

  while (balance > 0) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    
    const principalPayment = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(0, balance - principalPayment);

    if (monthlyPayment <= interest) break;
  }

  return totalInterest;
};

export const calculatePayoffDate = (months: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};