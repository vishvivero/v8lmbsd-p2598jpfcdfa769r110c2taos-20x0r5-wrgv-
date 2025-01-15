import { useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Strategy } from "@/lib/strategies";
import { Debt } from "@/lib/types";
import { PaymentOverviewSection } from "./PaymentOverviewSection";
import { OneTimeFundingSection } from "./OneTimeFundingSection";
import { MinimumPaymentSection } from "./MinimumPaymentSection";
import { ExtraPaymentSection } from "./ExtraPaymentSection";
import { TotalPaymentSection } from "./TotalPaymentSection";
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
    <div className="grid grid-cols-1 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Monthly Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <MinimumPaymentSection 
              totalMinimumPayments={minimumPayment}
              currencySymbol={preferredCurrency}
            />
            <ExtraPaymentSection
              onOpenExtraPaymentDialog={() => setIsExtraPaymentDialogOpen(true)}
              currencySymbol={preferredCurrency}
            />
            <TotalPaymentSection
              totalPayment={currentPayment}
              currencySymbol={preferredCurrency}
            />
          </CardContent>
        </Card>
        
        <OneTimeFundingSection />
      </motion.div>
    </div>
  );
};