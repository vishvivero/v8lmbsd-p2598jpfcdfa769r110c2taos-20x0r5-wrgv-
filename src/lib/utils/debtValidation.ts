import { Debt } from "../types/debt";

export const validateDebtCalculations = (
  debts: Debt[],
  monthlyPayment: number,
  strategyId: string
) => {
  console.log('Starting debt validation:', {
    totalDebts: debts.length,
    monthlyPayment,
    strategyId
  });

  // Validate total minimum payments
  const totalMinPayments = debts.reduce((sum, debt) => {
    console.log(`Minimum payment for ${debt.name}:`, debt.minimum_payment);
    return sum + debt.minimum_payment;
  }, 0);

  console.log('Validation - Total minimum payments:', {
    totalMinPayments,
    monthlyPayment,
    hasEnoughForMin: monthlyPayment >= totalMinPayments
  });

  // Validate strategy sorting
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategyId === 'avalanche') {
      return b.interest_rate - a.interest_rate;
    } else if (strategyId === 'snowball') {
      return a.balance - b.balance;
    }
    return 0;
  });

  console.log('Validation - Strategy sorting:', {
    strategy: strategyId,
    originalOrder: debts.map(d => ({ name: d.name, value: strategyId === 'avalanche' ? d.interest_rate : d.balance })),
    sortedOrder: sortedDebts.map(d => ({ name: d.name, value: strategyId === 'avalanche' ? d.interest_rate : d.balance }))
  });

  // Validate remaining payment allocation
  const remainingPayment = monthlyPayment - totalMinPayments;
  console.log('Validation - Remaining payment:', {
    monthlyPayment,
    totalMinPayments,
    remainingPayment
  });

  return {
    isValid: monthlyPayment >= totalMinPayments,
    totalMinPayments,
    remainingPayment,
    sortedDebts
  };
};

export const validatePaymentAllocation = (
  allocations: { [key: string]: number },
  monthlyPayment: number
) => {
  const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
  
  console.log('Validation - Payment allocation:', {
    allocations,
    totalAllocated,
    monthlyPayment,
    difference: Math.abs(totalAllocated - monthlyPayment)
  });

  return {
    isValid: Math.abs(totalAllocated - monthlyPayment) < 0.01,
    totalAllocated,
    difference: Math.abs(totalAllocated - monthlyPayment)
  };
};