import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ThumbsUp, MinusCircle, PercentIcon } from "lucide-react";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";

interface PayoffProgressProps {
  totalDebt: number;
  paidAmount: number;
  currencySymbol: string;
  projectedPayoffDate?: Date;
}

export const PayoffProgress = ({ totalDebt, paidAmount, currencySymbol, projectedPayoffDate }: PayoffProgressProps) => {
  const { oneTimeFundings } = useOneTimeFunding();
  
  const totalOneTimeFunding = oneTimeFundings.reduce((sum, funding) => sum + funding.amount, 0);
  const totalPaidAmount = paidAmount + totalOneTimeFunding;
  const progressPercentage = totalDebt > 0 ? (totalPaidAmount / (totalPaidAmount + totalDebt)) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Total Paid Off</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalPaidAmount)}</span>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <MinusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Remaining Balance</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalDebt)}</span>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <PercentIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">{progressPercentage.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-100 dark:bg-gray-700" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};