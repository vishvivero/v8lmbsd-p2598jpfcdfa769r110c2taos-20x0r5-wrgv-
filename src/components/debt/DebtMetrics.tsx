import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { ChartBar, DollarSign, Percent, Timer } from "lucide-react";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Debt</p>
            <h3 className="text-2xl font-bold">{formatMoney(totalDebt)}</h3>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Percent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg Interest Rate</p>
            <h3 className="text-2xl font-bold">{averageInterestRate.toFixed(1)}%</h3>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Min Payment</p>
            <h3 className="text-2xl font-bold">{formatMoney(totalMinPayment)}</h3>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <ChartBar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Debts</p>
            <h3 className="text-2xl font-bold">{activeDebts}</h3>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};