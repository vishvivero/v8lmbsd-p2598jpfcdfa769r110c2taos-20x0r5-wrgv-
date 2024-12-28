export const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  const monthlyRate = annualRate / 1200; // Convert annual rate to monthly decimal
  return Number((balance * monthlyRate).toFixed(2));
};

export const calculatePayoffDate = (monthsToPayoff: number): Date => {
  const today = new Date();
  const payoffDate = new Date(today);
  payoffDate.setMonth(today.getMonth() + monthsToPayoff);
  return payoffDate;
};