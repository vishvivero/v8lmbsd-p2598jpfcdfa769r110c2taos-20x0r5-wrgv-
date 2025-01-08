import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Strategy } from "@/lib/strategies";
import { Debt } from "@/lib/types";
import { PaymentOverviewSection } from "./PaymentOverviewSection";
import { OneTimeFundingSection } from "./OneTimeFundingSection";
import { DebtRepaymentPlan } from "./DebtRepaymentPlan";
import { MinimumPaymentSection } from "./MinimumPaymentSection";
import { ExtraPaymentSection } from "./ExtraPaymentSection";
import { TotalPaymentSection } from "./TotalPaymentSection";
import { InteractivePaymentsPanel } from "./InteractivePaymentsPanel";

interface StrategyContentProps {
  debts: Debt[];
  totalMinimumPayments: number;
  extraPayment: number;
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
  onExtraPaymentChange: (amount: number) => void;
  onOpenExtraPaymentDialog: () => void;
  onUpdateDebt: (debt: Debt) => void;
  onDeleteDebt: (debtId: string) => void;
  onSelectStrategy: (strategy: Strategy) => void;
  preferredCurrency?: string;
  totalDebtValue: number;
}

export const StrategyContent: React.FC<StrategyContentProps> = ({
  debts,
  totalMinimumPayments,
  extraPayment,
  totalMonthlyPayment,
  selectedStrategy,
  onExtraPaymentChange,
  onOpenExtraPaymentDialog,
  onUpdateDebt,
  onDeleteDebt,
  onSelectStrategy,
  preferredCurrency,
  totalDebtValue
}) => {
  console.log('StrategyContent render:', {
    debts,
    totalMinimumPayments,
    extraPayment,
    totalMonthlyPayment,
    selectedStrategy,
    totalDebtValue
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 space-y-6"
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
              totalMinimumPayments={totalMinimumPayments}
              currencySymbol={preferredCurrency}
            />
            <ExtraPaymentSection
              extraPayment={extraPayment}
              onExtraPaymentChange={onExtraPaymentChange}
              onOpenExtraPaymentDialog={onOpenExtraPaymentDialog}
              currencySymbol={preferredCurrency}
            />
            <TotalPaymentSection
              totalPayment={totalMonthlyPayment}
              currencySymbol={preferredCurrency}
            />
          </CardContent>
        </Card>
        
        <OneTimeFundingSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <InteractivePaymentsPanel 
          extraPayment={extraPayment}
          currencySymbol={preferredCurrency}
          onOpenExtraPaymentDialog={onOpenExtraPaymentDialog}
          onExtraPaymentChange={onExtraPaymentChange}
          totalDebtValue={totalDebtValue}
        />
      </motion.div>

      {debts && debts.length > 0 && (
        <div className="lg:col-span-3">
          <DebtRepaymentPlan
            debts={debts}
            totalMonthlyPayment={totalMonthlyPayment}
            selectedStrategy={selectedStrategy}
          />
        </div>
      )}
    </div>
  );
};