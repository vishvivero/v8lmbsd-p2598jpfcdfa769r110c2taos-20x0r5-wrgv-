import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sun } from "lucide-react";

interface PayoffProgressProps {
  totalDebt: number;
  paidAmount: number;
  currencySymbol: string;
  projectedPayoffDate?: Date;
}

export const PayoffProgress = ({ totalDebt, paidAmount, currencySymbol, projectedPayoffDate }: PayoffProgressProps) => {
  const progressPercentage = totalDebt > 0 ? (paidAmount / (paidAmount + totalDebt)) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const getYearsAndMonths = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return { years, months };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Payoff Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Principal paid: {formatCurrency(paidAmount)}</span>
              <span className="text-red-600">Balance: {formatCurrency(totalDebt)}</span>
            </div>
            <div className="relative pt-4">
              <div className="absolute -top-2 left-0 w-full flex justify-center">
                <span className="bg-white px-2 text-sm font-medium">
                  {progressPercentage.toFixed(1)}% paid
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {projectedPayoffDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#004d61] text-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>DEBT-FREE COUNTDOWN</span>
                <Sun className="h-6 w-6 text-yellow-400" />
              </CardTitle>
              <p className="text-sm text-gray-200">
                {projectedPayoffDate.toLocaleDateString('en-US', { 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8 items-center">
                {(() => {
                  const { years, months } = getYearsAndMonths(projectedPayoffDate);
                  return (
                    <>
                      <div className="text-center">
                        <div className="text-4xl font-bold">{years}</div>
                        <div className="text-sm text-gray-200">years</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold">{months}</div>
                        <div className="text-sm text-gray-200">months</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};