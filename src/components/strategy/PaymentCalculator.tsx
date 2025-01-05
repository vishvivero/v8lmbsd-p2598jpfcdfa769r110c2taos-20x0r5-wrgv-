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
  const sortedDebts = selectedStrategy.calculate([...debts]);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const payoffDetails = calculatePayoffDetails(sortedDebts, totalMonthlyPayment, selectedStrategy, []);
  const allocations = new Map<string, number>();

  // Initialize with minimum payments
  sortedDebts.forEach(debt => {
    allocations.set(debt.id, debt.minimum_payment);
  });

  // Distribute remaining payment according to strategy
  let remainingPayment = totalMonthlyPayment - totalMinimumPayments;
  
  // Sort debts by strategy and filter out paid off debts
  const activeDebts = sortedDebts.filter(debt => {
    const payoffDate = payoffDetails[debt.id]?.payoffDate;
    return !payoffDate || payoffDate >= new Date();
  });

  if (activeDebts.length > 0) {
    // Get highest priority active debt
    const highestPriorityDebt = activeDebts[0];
    const currentAllocation = allocations.get(highestPriorityDebt.id) || 0;
    
    // Add remaining payment to highest priority debt
    allocations.set(
      highestPriorityDebt.id,
      currentAllocation + remainingPayment
    );

    console.log(`Payment allocation for ${highestPriorityDebt.name}:`, {
      minimumPayment: highestPriorityDebt.minimum_payment,
      extraPayment: remainingPayment,
      totalAllocation: currentAllocation + remainingPayment
    });
  }

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
