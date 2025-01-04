import { motion } from "framer-motion";
import { PayoffProgress } from "@/components/PayoffProgress";

interface OverviewProgressProps {
  totalDebt: number;
  currencySymbol: string;
  debts: any[];
  monthlyPayment: number;
}

export const OverviewProgress = ({
  totalDebt,
  currencySymbol,
  debts,
  monthlyPayment,
}: OverviewProgressProps) => {
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
        debts={debts}
        monthlyPayment={monthlyPayment}
      />
    </motion.section>
  );
};