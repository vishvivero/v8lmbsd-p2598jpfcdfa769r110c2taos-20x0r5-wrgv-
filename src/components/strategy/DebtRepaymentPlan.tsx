import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DebtColumn } from "@/components/debt/DebtColumn";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculateMonthlyAllocations } from "./PaymentCalculator";

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
  if (!debts || debts.length === 0) return null;

  const sortedDebts = selectedStrategy.calculate([...debts]);
  const { allocations, payoffDetails } = calculateMonthlyAllocations(
    debts,
    totalMonthlyPayment,
    selectedStrategy
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle>Debt Repayment Plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            View upcoming payments for each debt
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 p-4">
              {sortedDebts.map((debt) => (
                <DebtColumn
                  key={debt.id}
                  debt={debt}
                  payoffDetails={payoffDetails[debt.id]}
                  monthlyAllocation={allocations.get(debt.id) || debt.minimum_payment}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};