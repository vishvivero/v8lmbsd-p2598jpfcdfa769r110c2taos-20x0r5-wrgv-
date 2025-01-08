import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

interface OverviewProgressProps {
  totalDebt: number;
  currentBalance: number;
  totalPaid: number;
  progress: number;
  currencySymbol: string;
  projectedPayoffDate: Date;
  oneTimeFundings: OneTimeFunding[];
}

export const OverviewProgress = ({
  totalDebt,
  currentBalance,
  totalPaid,
  progress,
  currencySymbol,
  projectedPayoffDate,
  oneTimeFundings
}: OverviewProgressProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencySymbol === '£' ? 'GBP' : 'USD',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('GBP', '£');
  };

  const totalOneTimeFunding = oneTimeFundings.reduce((sum, funding) => sum + funding.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Total Debt Balance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Debt</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalDebt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Paid Off</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Remaining Balance</span>
              <span className="font-semibold text-gray-900">{formatCurrency(currentBalance)}</span>
            </div>
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">DEBT-FREE COUNTDOWN</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Projected debt-free date</span>
              <span className="font-semibold text-gray-900">
                {format(projectedPayoffDate, 'MMM yyyy')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">One-time funding total</span>
              <span className="font-semibold text-emerald-600">
                {formatCurrency(totalOneTimeFunding)}
              </span>
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-2">Your journey to financial freedom</p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  Stay focused on your debt-free goal! You've made great progress, 
                  paying off {formatCurrency(totalPaid)} so far.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};