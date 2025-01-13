import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { DollarSign, ArrowRight } from "lucide-react";
import { DebtFreeDate } from "./metrics/DebtFreeDate";
import { DebtList } from "./metrics/DebtList";
import { RepaymentEfficiency } from "./metrics/RepaymentEfficiency";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { useProfile } from "@/hooks/use-profile";

interface DebtMetricsProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtMetrics = ({ debts, currencySymbol }: DebtMetricsProps) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', currencySymbol);
  };

  // Calculate payoff details using the unified calculation service
  const payoffDetails = unifiedDebtCalculationService.calculatePayoffDetails(
    debts,
    profile?.monthly_payment || totalMinPayment,
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0],
    []
  );

  // Find the latest payoff date
  const latestPayoffDate = Object.values(payoffDetails).reduce(
    (latest, detail) => (detail.payoffDate > latest ? detail.payoffDate : latest),
    new Date()
  );

  // Calculate total interest
  const totalInterest = Object.values(payoffDetails).reduce(
    (sum, detail) => sum + detail.totalInterest,
    0
  );

  // Calculate payment efficiency
  const totalPayment = totalDebt + totalInterest;
  const interestPercentage = (totalInterest / totalPayment) * 100;
  const principalPercentage = 100 - interestPercentage;

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20 border-none">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DebtFreeDate payoffDate={latestPayoffDate} />
              <DebtList debts={debts} />
              <RepaymentEfficiency
                interestPercentage={interestPercentage}
                principalPercentage={principalPercentage}
              />
            </div>

            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-lg font-semibold">Interest Cost Projection</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {formatMoney(totalInterest)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Total interest you'll pay with your current plan
              </p>
              <Button
                onClick={() => navigate("/strategy")}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
              >
                Optimize Your Repayment Strategy
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};