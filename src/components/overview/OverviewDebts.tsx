import { motion } from "framer-motion";
import { DebtTableContainer } from "@/components/DebtTableContainer";
import { Debt } from "@/lib/types/debt";

interface OverviewDebtsProps {
  debts: Debt[];
  monthlyPayment: number;
  onUpdateDebt: (debt: Debt) => void;
  onDeleteDebt: (id: string) => void;
  currencySymbol: string;
  selectedStrategy: string;
}

export const OverviewDebts = ({
  debts,
  monthlyPayment,
  onUpdateDebt,
  onDeleteDebt,
  currencySymbol,
  selectedStrategy,
}: OverviewDebtsProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Debts</h2>
      <DebtTableContainer 
        debts={debts} 
        monthlyPayment={monthlyPayment}
        onUpdateDebt={onUpdateDebt}
        onDeleteDebt={onDeleteDebt}
        currencySymbol={currencySymbol}
        selectedStrategy={selectedStrategy}
      />
    </motion.section>
  );
};