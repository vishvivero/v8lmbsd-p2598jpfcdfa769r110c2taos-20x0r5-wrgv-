import { motion } from "framer-motion";
import { PayoffProgress } from "@/components/PayoffProgress";
import { useDebts } from "@/hooks/use-debts";
import { calculatePayoffTime } from "@/lib/paymentCalculator";
import { addMonths } from "date-fns";

interface OverviewProgressProps {
  totalDebt: number;
  currencySymbol: string;
}

export const OverviewProgress = ({
  totalDebt,
  currencySymbol,
}: OverviewProgressProps) => {
  const { debts, profile } = useDebts();

  // Calculate the latest payoff date among all debts
  const calculateProjectedPayoffDate = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) {
      console.log("No debts or monthly payment available for payoff calculation");
      return undefined;
    }

    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
    const extraPayment = Math.max(0, profile.monthly_payment - totalMinimumPayments);

    // Find the debt that will take the longest to pay off
    let maxMonths = 0;
    debts.forEach((debt, index) => {
      const isFirstDebt = index === 0; // First debt gets extra payment
      const monthlyPayment = debt.minimum_payment + (isFirstDebt ? extraPayment : 0);
      const months = calculatePayoffTime(debt, monthlyPayment);
      
      console.log(`Payoff calculation for ${debt.name}:`, {
        balance: debt.balance,
        monthlyPayment,
        months,
        isFirstDebt,
        extraPayment: isFirstDebt ? extraPayment : 0
      });

      if (months !== Infinity && months > maxMonths) {
        maxMonths = months;
      }
    });

    if (maxMonths === 0) {
      console.log("No valid payoff time calculated");
      return undefined;
    }

    const projectedDate = addMonths(new Date(), maxMonths);
    console.log("Projected payoff date:", projectedDate.toISOString());
    return projectedDate;
  };

  const projectedPayoffDate = calculateProjectedPayoffDate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
    >
      <PayoffProgress
        totalDebt={totalDebt}
        paidAmount={0}
        currencySymbol={currencySymbol}
        projectedPayoffDate={projectedPayoffDate}
      />
    </motion.section>
  );
};