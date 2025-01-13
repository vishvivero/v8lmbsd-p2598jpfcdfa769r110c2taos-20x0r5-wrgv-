import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { DollarSign, Percent, Calendar, Tag } from "lucide-react";

interface DebtMetricsProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtMetrics = ({ debts, currencySymbol }: DebtMetricsProps) => {
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const averageInterestRate = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length
    : 0;
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const uniqueCategories = new Set(debts.map(debt => debt.category)).size;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', currencySymbol);
  };

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-blue-50 border-none">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <DollarSign className="h-5 w-5" />
                <span className="text-lg font-semibold">Total Debt Balance</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{formatMoney(totalDebt)}</span>
                  <p className="text-sm text-gray-600 mt-1">Current total debt</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-700">{formatMoney(0)}</span>
                  <p className="text-sm text-gray-600">Total Paid Off</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-700">{formatMoney(totalDebt)}</span>
                  <p className="text-sm text-gray-600">Remaining Balance</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-700">0.0%</span>
                  <p className="text-sm text-gray-600">Progress Complete</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Percent className="h-4 w-4" />
                  <span className="text-sm font-medium">Average Interest Rate</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{averageInterestRate.toFixed(2)}%</span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Total Min Payment</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{formatMoney(totalMinPayment)}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">Total Categories</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{uniqueCategories}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};