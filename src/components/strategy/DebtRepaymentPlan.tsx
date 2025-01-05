import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculateMonthlyAllocations } from "./PaymentCalculator";
import { DownloadReportButton } from "./DownloadReportButton";
import { DebtColumnsList } from "./DebtColumnsList";

interface DebtRepaymentPlanProps {
  debts: Debt[];
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
}

export const DebtRepaymentPlan = ({
  debts,
  totalMonthlyPayment,
  selectedStrategy,
}: DebtRepaymentPlanProps) => {
  if (!debts || debts.length === 0) {
    console.log('No debts available for repayment plan');
    return null;
  }

  console.log('DebtRepaymentPlan: Starting calculation with strategy:', {
    strategyName: selectedStrategy.name,
    totalDebts: debts.length,
    totalMonthlyPayment
  });

  const sortedDebts = selectedStrategy.calculate([...debts]);
  console.log('DebtRepaymentPlan: Sorted debts:', sortedDebts.map(d => ({ 
    name: d.name, 
    balance: d.balance,
    minimumPayment: d.minimum_payment,
    interestRate: d.interest_rate 
  })));
  
  const { allocations, payoffDetails } = calculateMonthlyAllocations(
    sortedDebts,
    totalMonthlyPayment,
    selectedStrategy
  );

  // Log detailed payment allocations
  console.log('DebtRepaymentPlan: Payment allocations:', {
    totalPayment: totalMonthlyPayment,
    allocations: Array.from(allocations.entries()).map(([id, amount]) => ({
      debtName: debts.find(d => d.id === id)?.name,
      allocation: amount,
      minimumPayment: debts.find(d => d.id === id)?.minimum_payment,
      extraPayment: amount - (debts.find(d => d.id === id)?.minimum_payment || 0)
    }))
  });

  // Log payoff details for each debt
  console.log('DebtRepaymentPlan: Payoff details:', Object.entries(payoffDetails).map(([id, details]) => ({
    debtName: debts.find(d => d.id === id)?.name,
    months: details.months,
    totalInterest: details.totalInterest,
    payoffDate: details.payoffDate,
    redistributions: details.redistributionHistory?.length || 0
  })));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Card className="bg-white/95">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Debt Repayment Plan</CardTitle>
            <p className="text-sm text-muted-foreground">
              View upcoming payments for each debt
            </p>
          </div>
          <DownloadReportButton
            sortedDebts={sortedDebts}
            allocations={allocations}
            payoffDetails={payoffDetails}
            totalMonthlyPayment={totalMonthlyPayment}
            selectedStrategy={selectedStrategy}
          />
        </CardHeader>
        <CardContent>
          <DebtColumnsList
            sortedDebts={sortedDebts}
            payoffDetails={payoffDetails}
            allocations={allocations}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};