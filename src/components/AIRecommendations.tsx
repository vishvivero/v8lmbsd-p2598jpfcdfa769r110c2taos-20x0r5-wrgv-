import { Debt, Strategy } from "@/lib/strategies";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AIRecommendationsProps {
  debts: Debt[];
  selectedStrategy: Strategy;
}

export const AIRecommendations = ({ debts, selectedStrategy }: AIRecommendationsProps) => {
  const getTotalDebt = () => debts.reduce((sum, debt) => sum + debt.balance, 0);
  const getAverageInterest = () =>
    debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length;

  const getRecommendation = () => {
    const totalDebt = getTotalDebt();
    const avgInterest = getAverageInterest();

    if (avgInterest > 15) {
      return "Consider consolidating high-interest debts or transferring balances to lower-interest options.";
    } else if (debts.length > 3) {
      return "The snowball method might help you stay motivated by clearing smaller debts first.";
    } else {
      return "The avalanche method could save you the most in interest payments.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="p-6 bg-white/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Debt</span>
            <span className="font-semibold number-font">
              ${getTotalDebt().toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Interest Rate</span>
            <span className="font-semibold number-font">
              {getAverageInterest().toFixed(2)}%
            </span>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">{getRecommendation()}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};