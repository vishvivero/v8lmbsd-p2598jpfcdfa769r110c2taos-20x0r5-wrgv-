import { Debt } from "@/lib/types";

export const calculateMinimumPayments = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.minimum_payment, 0);
};

export const calculatePaymentAllocation = (
  debts: Debt[],
  totalPayment: number,
  minimumPayments: { [key: string]: number }
): { [key: string]: number } => {
  const allocations: { [key: string]: number } = {};
  let remainingPayment = totalPayment;

  // First allocate minimum payments
  debts.forEach(debt => {
    const minPayment = minimumPayments[debt.id] || debt.minimum_payment;
    allocations[debt.id] = minPayment;
    remainingPayment -= minPayment;
  });

  // Allocate remaining payment to first debt
  if (remainingPayment > 0 && debts.length > 0) {
    allocations[debts[0].id] += remainingPayment;
  }

  return allocations;
};