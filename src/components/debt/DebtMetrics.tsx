import { Card } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface DebtMetricsProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtMetrics = ({ debts, currencySymbol }: DebtMetricsProps) => {
  const formatMoney = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Calculate estimated payoff time in months for a debt
  const calculatePayoffMonths = (debt: Debt) => {
    const monthlyInterest = debt.interest_rate / 1200;
    const monthlyPayment = debt.minimum_payment;
    const balance = debt.balance;
    
    if (monthlyPayment <= balance * monthlyInterest) {
      return Infinity;
    }

    return Math.log(monthlyPayment / (monthlyPayment - balance * monthlyInterest)) / Math.log(1 + monthlyInterest);
  };

  // Format months into years and months
  const formatPayoffTime = (totalMonths: number) => {
    const years = Math.floor(totalMonths / 12);
    const months = Math.ceil(totalMonths % 12);
    
    if (years === 0) {
      return `${months} months`;
    } else if (months === 0) {
      return `${years} years`;
    } else {
      return `${years} years and ${months} months`;
    }
  };

  // Get the first debt for sample display
  const sampleDebt = debts[0];
  const payoffMonths = sampleDebt ? calculatePayoffMonths(sampleDebt) : 0;
  const progressPercentage = 30; // This would ideally be calculated based on actual progress

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {sampleDebt && (
        <Card className="p-6 bg-white border-gray-100">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Sample Debt</h2>
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <p className="text-gray-600 mb-1">Name</p>
                  <p className="text-xl font-semibold">{sampleDebt.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Balance</p>
                  <p className="text-xl font-semibold">{formatMoney(sampleDebt.balance)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Monthly Payment</p>
                  <p className="text-xl font-semibold">{formatMoney(sampleDebt.minimum_payment)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">Progress Preview</h3>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-center text-gray-600 mt-4">
                Estimated payoff in {formatPayoffTime(payoffMonths)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};