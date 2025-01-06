export const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  return Number((balance * (annualRate / 1200)).toFixed(2));
};