import { Card } from "@/components/ui/card";
import { CircleDollarSign, PieChart, TrendingDown, BadgeDollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types";

interface OverviewKPIsProps {
  debts: Debt[];
  currencySymbol: string;
}

export const OverviewKPIs = ({ debts, currencySymbol }: OverviewKPIsProps) => {
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length;
  const highestInterestDebt = debts.reduce((max, debt) => 
    debt.interest_rate > max.interest_rate ? debt : max, debts[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Debt KPI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-purple-500/10 p-3">
              <CircleDollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-xs font-medium text-purple-600">Total Debt</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-purple-700">
              {currencySymbol}{totalDebt.toLocaleString()}
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              Across {debts.length} debts
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Monthly Payments KPI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-blue-500/10 p-3">
              <BadgeDollarSign className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-blue-600">Monthly Payments</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-blue-700">
              {currencySymbol}{totalMinPayments.toLocaleString()}
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              Minimum monthly payment
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Average Interest Rate KPI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <PieChart className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="text-xs font-medium text-emerald-600">Avg Interest Rate</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-emerald-700">
              {avgInterestRate.toFixed(1)}%
            </h3>
            <p className="text-sm text-emerald-600 mt-1">
              Average across all debts
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Highest Interest Rate KPI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-rose-500/10 p-3">
              <TrendingDown className="h-6 w-6 text-rose-500" />
            </div>
            <span className="text-xs font-medium text-rose-600">Highest Interest</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-rose-700">
              {highestInterestDebt?.interest_rate.toFixed(1)}%
            </h3>
            <p className="text-sm text-rose-600 mt-1">
              {highestInterestDebt?.name || 'No debts'}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};