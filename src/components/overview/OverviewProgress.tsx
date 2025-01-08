import { motion } from "framer-motion";
import { PayoffProgress } from "@/components/PayoffProgress";
import { useDebts } from "@/hooks/use-debts";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
import { strategies } from "@/lib/strategies";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

interface OverviewProgressProps {
  totalDebt: number;
  currencySymbol: string;
  oneTimeFundings?: OneTimeFunding[];
}

export const OverviewProgress = ({
  totalDebt,
  currencySymbol,
  oneTimeFundings = []
}: OverviewProgressProps) => {
  const { debts, profile } = useDebts();

  // Calculate the latest payoff date among all debts
  const calculateProjectedPayoffDate = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) {
      console.log("No debts or monthly payment available for payoff calculation");
      return undefined;
    }

    // Use the same calculation method as other components
    const payoffDetails = calculatePayoffDetails(
      debts,
      profile.monthly_payment,
      strategies.find(s => s.id === profile.selected_strategy) || strategies[0],
      oneTimeFundings
    );

    // Find the debt that will take the longest to pay off
    let maxMonths = 0;
    Object.values(payoffDetails).forEach(details => {
      if (details.months > maxMonths) {
        maxMonths = details.months;
      }
    });

    if (maxMonths === 0) {
      console.log("No valid payoff time calculated");
      return undefined;
    }

    const projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + maxMonths);
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