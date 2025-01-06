export * from './core/interestCalculator';
export * from './core/paymentCalculator';
export * from './payoff/payoffCalculator';
export * from './types';

// Utility functions
export const formatCurrency = (amount: number, currencySymbol: string = '£') => {
  return `${currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const calculateAmortizationSchedule = (
  debt: Debt,
  monthlyPayment: number
): AmortizationEntry[] => {
  const schedule: AmortizationEntry[] = [];
  let balance = debt.balance;
  let currentDate = new Date();
  const monthlyRate = debt.interest_rate / 1200;

  while (balance > 0) {
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);
    const payment = principal + interest;
    
    schedule.push({
      date: new Date(currentDate),
      startingBalance: balance,
      payment,
      principal,
      interest,
      endingBalance: balance - principal
    });

    balance -= principal;
    currentDate.setMonth(currentDate.getMonth() + 1);

    if (schedule.length > 360) break; // Safety limit of 30 years
  }

  return schedule;
};