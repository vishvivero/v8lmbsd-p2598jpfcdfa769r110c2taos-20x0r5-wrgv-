import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";

interface PaymentCalculatorProps {
  debts: Debt[];
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
}

export const calculateMonthlyAllocations = (
  debts: Debt[],
  totalMonthlyPayment: number,
  selectedStrategy: Strategy
) => {
  console.log('Starting allocation calculation:', {
    totalDebts: debts.length,
    totalMonthlyPayment,
    strategy: selectedStrategy.name
  });

  const sortedDebts = selectedStrategy.calculate([...debts]);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const payoffDetails = calculatePayoffDetails(sortedDebts, totalMonthlyPayment, selectedStrategy, []);
  const allocations = new Map<string, number>();

  // Initialize with minimum payments
  sortedDebts.forEach(debt => {
    allocations.set(debt.id, debt.minimum_payment);
    console.log(`Initial minimum payment for ${debt.name}:`, {
      debtId: debt.id,
      payment: debt.minimum_payment
    });
  });

  // Distribute remaining payment according to strategy
  let remainingPayment = totalMonthlyPayment - totalMinimumPayments;
  console.log('Remaining payment for distribution:', remainingPayment);
  
  // Sort debts by strategy and filter out paid off debts
  const activeDebts = sortedDebts.filter(debt => {
    const payoffDate = payoffDetails[debt.id]?.payoffDate;
    const isActive = !payoffDate || payoffDate >= new Date();
    console.log(`Debt status check for ${debt.name}:`, {
      debtId: debt.id,
      payoffDate,
      isActive,
      hasRedistributions: payoffDetails[debt.id]?.redistributionHistory?.length > 0
    });
    return isActive;
  });

  if (activeDebts.length > 0) {
    // Get highest priority active debt
    const highestPriorityDebt = activeDebts[0];
    const currentAllocation = allocations.get(highestPriorityDebt.id) || 0;
    
    // Add remaining payment to highest priority debt
    const newAllocation = currentAllocation + remainingPayment;
    allocations.set(highestPriorityDebt.id, newAllocation);

    console.log(`Final allocation for ${highestPriorityDebt.name}:`, {
      debtId: highestPriorityDebt.id,
      minimumPayment: highestPriorityDebt.minimum_payment,
      extraPayment: remainingPayment,
      totalAllocation: newAllocation
    });

    // Track redistributions from paid off debts
    sortedDebts.forEach(debt => {
      const details = payoffDetails[debt.id];
      if (details?.redistributionHistory?.length > 0) {
        console.log(`Redistribution history for ${debt.name}:`, {
          debtId: debt.id,
          redistributions: details.redistributionHistory
        });
      }
    });
  }

  // Log final allocations and payoff details
  console.log('Final allocation summary:', {
    allocations: Array.from(allocations.entries()).map(([debtId, amount]) => ({
      debtId,
      amount,
      debtName: debts.find(d => d.id === debtId)?.name
    })),
    payoffDetails: Object.entries(payoffDetails).map(([debtId, details]) => ({
      debtId,
      debtName: debts.find(d => d.id === debtId)?.name,
      months: details.months,
      redistributions: details.redistributionHistory?.length || 0
    }))
  });

  return { allocations, payoffDetails };
};

export const PaymentCalculator: React.FC<PaymentCalculatorProps> = ({
  debts,
  totalMonthlyPayment,
  selectedStrategy,
}) => {
  const { allocations, payoffDetails } = calculateMonthlyAllocations(
    debts,
    totalMonthlyPayment,
    selectedStrategy
  );

  return null; // This is a logic-only component
};