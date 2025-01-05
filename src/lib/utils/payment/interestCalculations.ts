export const calculateMonthlyInterest = (balance: number, interestRate: number): number => {
  return (balance * (interestRate / 100)) / 12;
};