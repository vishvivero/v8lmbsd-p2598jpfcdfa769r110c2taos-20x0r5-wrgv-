export const calculateMonthlyInterest = (balance: number, interestRate: number): number => {
  return Number(((balance * (interestRate / 100)) / 12).toFixed(2));
};

export const calculatePayoffDate = (monthsToPayoff: number): Date => {
  const today = new Date();
  const payoffDate = new Date(today);
  payoffDate.setMonth(today.getMonth() + monthsToPayoff);
  return payoffDate;
};