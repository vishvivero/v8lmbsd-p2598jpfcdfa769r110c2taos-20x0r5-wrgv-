import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { ChartBar, DollarSign, Percent } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PASTEL_COLORS } from "./chart/chartStyles";

interface DebtMetricsProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtMetrics = ({ debts, currencySymbol }: DebtMetricsProps) => {
  // Calculate metrics
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const averageInterestRate = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length
    : 0;
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const activeDebts = debts.filter(debt => debt.balance > 0).length;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', currencySymbol);
  };

  // Prepare data for the donut chart
  const chartData = debts
    .filter(debt => debt.balance > 0)
    .map(debt => ({
      name: debt.name,
      value: debt.balance,
      formattedValue: formatMoney(debt.balance)
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-gray-600">{payload[0].payload.formattedValue}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="col-span-1"
      >
        <Card className="p-6 bg-white/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Debt</p>
              <h3 className="text-2xl font-bold mt-1">{formatMoney(totalDebt)}</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-1"
      >
        <Card className="p-6 bg-white/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Interest Rate</p>
              <h3 className="text-2xl font-bold mt-1">{averageInterestRate.toFixed(1)}%</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="col-span-1"
      >
        <Card className="p-6 bg-white/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Min Payment</p>
              <h3 className="text-2xl font-bold mt-1">{formatMoney(totalMinPayment)}</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-1"
      >
        <Card className="p-6 bg-white/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <ChartBar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Debts</p>
              <h3 className="text-2xl font-bold mt-1">{activeDebts}</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="col-span-1"
      >
        <Card className="p-6 bg-white/95 backdrop-blur-sm h-full">
          <p className="text-sm font-medium text-gray-500 mb-4">Debt Distribution</p>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};