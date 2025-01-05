export const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  const monthlyRate = annualRate / 1200;
  return Number((balance * monthlyRate).toFixed(2));
};

export const calculateTotalInterest = (
  balance: number,
  monthlyPayment: number,
  annualRate: number
): number => {
  let totalInterest = 0;
  let remainingBalance = balance;
  const monthlyRate = annualRate / 1200;

  while (remainingBalance > 0.01 && monthlyPayment > calculateMonthlyInterest(remainingBalance, annualRate)) {
    const monthlyInterest = calculateMonthlyInterest(remainingBalance, annualRate);
    totalInterest += monthlyInterest;
    remainingBalance = Math.max(0, remainingBalance + monthlyInterest - monthlyPayment);
  }

  return Number(totalInterest.toFixed(2));
};