import { Debt } from "../types/debt";
import { PaymentAllocation } from "../types/payment";
import { strategies } from "../strategies";

const EPSILON = 0.01;

export const calculateExtraPayments = (
  debts: Debt[],
  initialAllocations: PaymentAllocation,
  remainingPayment: number,
  strategyId: string = 'avalanche'
): PaymentAllocation => {
  console.log('Starting extra payment allocation with:', {
    remainingPayment,
    initialAllocations,
    strategyId
  });

  const allocations = { ...initialAllocations };
  let availablePayment = remainingPayment;
  let activeDebts = [...debts];
  const strategy = strategies.find(s => s.id === strategyId) || strategies[0];
  let releasedPayments = 0;

  while ((availablePayment > EPSILON || releasedPayments > EPSILON) && activeDebts.length > 0) {
    activeDebts = strategy.calculate(activeDebts);
    availablePayment += releasedPayments;
    releasedPayments = 0;

    for (let i = 0; i < activeDebts.length; i++) {
      const currentDebt = activeDebts[i];
      const currentBalance = currentDebt.balance;
      const currentAllocation = allocations[currentDebt.id] || 0;
      const remainingBalance = Math.max(0, currentBalance - currentAllocation);

      if (remainingBalance <= EPSILON) {
        releasedPayments += currentDebt.minimum_payment;
        activeDebts = activeDebts.filter(d => d.id !== currentDebt.id);
        i--;
        continue;
      }

      const maxPayment = Math.min(
        availablePayment,
        remainingBalance + EPSILON
      );

      if (maxPayment > EPSILON) {
        const newAllocation = Number((currentAllocation + maxPayment).toFixed(2));
        allocations[currentDebt.id] = newAllocation;
        availablePayment = Number((availablePayment - maxPayment).toFixed(2));

        if (newAllocation >= currentBalance - EPSILON) {
          releasedPayments += currentDebt.minimum_payment;
          activeDebts = activeDebts.filter(d => d.id !== currentDebt.id);
          i--;
        }
      }
    }
  }

  return allocations;
};