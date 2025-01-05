import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Strategy } from "@/lib/strategies";
import { Debt } from "@/lib/types";
import { PaymentOverviewSection } from "./PaymentOverviewSection";
import { OneTimeFundingSection } from "./OneTimeFundingSection";
import { DebtTableContainer } from "../DebtTableContainer";
import { StrategySelector } from "../StrategySelector";
import { DebtRepaymentPlan } from "./DebtRepaymentPlan";

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
}

export const StrategyContent = ({
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
}: StrategyContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 space-y-6"
      >
        <PaymentOverviewSection
          totalMinimumPayments={totalMinimumPayments}
          extraPayment={extraPayment}
          onExtraPaymentChange={onExtraPaymentChange}
          onOpenExtraPaymentDialog={onOpenExtraPaymentDialog}
          currencySymbol={preferredCurrency}
        />
        
        <OneTimeFundingSection />

        {debts && debts.length > 0 && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>Debt Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <DebtTableContainer
                debts={debts}
                monthlyPayment={totalMonthlyPayment}
                onUpdateDebt={onUpdateDebt}
                onDeleteDebt={onDeleteDebt}
                currencySymbol={preferredCurrency}
                selectedStrategy={selectedStrategy.id}
              />
            </CardContent>
          </Card>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-1"
      >
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Strategy Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StrategySelector
              strategies={strategies}
              selectedStrategy={selectedStrategy}
              onSelectStrategy={onSelectStrategy}
            />
          </CardContent>
        </Card>
      </motion.div>

      {debts && debts.length > 0 && (
        <DebtRepaymentPlan
          debts={debts}
          totalMonthlyPayment={totalMonthlyPayment}
          selectedStrategy={selectedStrategy}
        />
      )}
    </div>
  );
};