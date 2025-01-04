import { motion } from "framer-motion";
import { Debt } from "@/lib/types";
import { DebtBalanceCard } from "./payoff/DebtBalanceCard";
import { DebtFreeCountdown } from "./payoff/DebtFreeCountdown";
import { usePayoffCalculator } from "./payoff/PayoffCalculator";

interface PayoffProgressProps {
  totalDebt: number;
  paidAmount: number;
  currencySymbol: string;
  projectedPayoffDate?: Date;
  debts?: Debt[];
  monthlyPayment?: number;
}

export const PayoffProgress = ({ 
  totalDebt, 
  paidAmount, 
  currencySymbol, 
  projectedPayoffDate,
  debts = [],
  monthlyPayment = 0
}: PayoffProgressProps) => {
  const progressPercentage = totalDebt > 0 ? (paidAmount / (paidAmount + totalDebt)) * 100 : 0;
  
  const { projectedDate, years, months } = usePayoffCalculator({
    debts,
    monthlyPayment,
    projectedPayoffDate
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <DebtBalanceCard
          totalDebt={totalDebt}
          paidAmount={paidAmount}
          currencySymbol={currencySymbol}
          progressPercentage={progressPercentage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DebtFreeCountdown
          projectedDate={projectedDate}
          years={years}
          months={months}
        />
      </motion.div>
    </div>
  );
};