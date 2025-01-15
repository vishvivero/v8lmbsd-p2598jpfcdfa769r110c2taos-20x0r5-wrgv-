import { useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Strategy } from "@/lib/strategies";
import { Debt } from "@/lib/types";
import { PaymentOverviewSection } from "./PaymentOverviewSection";
import { OneTimeFundingSection } from "./OneTimeFundingSection";
import { ScoreInsightsSection } from "./sections/ScoreInsightsSection";
import { useMonthlyPayment } from "@/hooks/use-monthly-payment";

interface StrategyContentProps {
  debts: Debt[];
  selectedStrategy: Strategy;
  onUpdateDebt: (debt: Debt) => void;
  onDeleteDebt: (debtId: string) => void;
  onSelectStrategy: (strategy: Strategy) => void;
  preferredCurrency?: string;
  totalDebtValue: number;
}

export const StrategyContent: React.FC<StrategyContentProps> = ({
  debts,
  selectedStrategy,
  onUpdateDebt,
  onDeleteDebt,
  onSelectStrategy,
  preferredCurrency,
  totalDebtValue
}) => {
  const { currentPayment, minimumPayment, extraPayment, updateMonthlyPayment } = useMonthlyPayment();
  const [isExtraPaymentDialogOpen, setIsExtraPaymentDialogOpen] = useState(false);

  console.log('StrategyContent render:', {
    debts,
    minimumPayment,
    currentPayment,
    selectedStrategy,
    totalDebtValue
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <PaymentOverviewSection
          totalMinimumPayments={minimumPayment}
          extraPayment={extraPayment}
          onExtraPaymentChange={amount => updateMonthlyPayment(amount + minimumPayment)}
          onOpenExtraPaymentDialog={() => setIsExtraPaymentDialogOpen(true)}
          currencySymbol={preferredCurrency}
          totalDebtValue={totalDebtValue}
        />
        
        <OneTimeFundingSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ScoreInsightsSection />
      </motion.div>
    </div>
  );
};