import { motion } from "framer-motion";
import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";
import { Debt } from "@/lib/types";
import { strategies } from "@/lib/strategies";
import { useProfile } from "@/hooks/use-profile";
import { DebtBalanceCard } from "./payoff/DebtBalanceCard";
import { DebtFreeCountdown } from "./payoff/DebtFreeCountdown";

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
  const { profile } = useProfile();
  const progressPercentage = totalDebt > 0 ? (paidAmount / (paidAmount + totalDebt)) * 100 : 0;

  const calculateProjectedPayoffDate = () => {
    if (!debts.length || !monthlyPayment) return projectedPayoffDate;

    const selectedStrategyId = profile?.selected_strategy || 'avalanche';
    const selectedStrategy = strategies.find(s => s.id === selectedStrategyId);
    
    if (!selectedStrategy) {
      console.error('Strategy not found:', selectedStrategyId);
      return projectedPayoffDate;
    }

    console.log('Calculating payoff with strategy:', selectedStrategy.name);

    const payoffDetails = calculatePayoffDetails(debts, monthlyPayment, selectedStrategy);
    
    let maxMonths = 0;
    Object.values(payoffDetails).forEach(detail => {
      if (detail.months > maxMonths) {
        maxMonths = detail.months;
      }
    });

    console.log('Projected payoff months:', maxMonths);

    const date = new Date();
    date.setMonth(date.getMonth() + maxMonths);
    return date;
  };

  const actualProjectedDate = calculateProjectedPayoffDate() || projectedPayoffDate;

  const getYearsAndMonths = (date: Date) => {
    if (!date) return { years: 0, months: 0 };
    
    const now = new Date();
    const diffInMonths = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    
    return {
      years: Math.max(0, years),
      months: Math.max(0, months)
    };
  };

  const { years, months } = getYearsAndMonths(actualProjectedDate);

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
          projectedDate={actualProjectedDate}
          years={years}
          months={months}
        />
      </motion.div>
    </div>
  );
};