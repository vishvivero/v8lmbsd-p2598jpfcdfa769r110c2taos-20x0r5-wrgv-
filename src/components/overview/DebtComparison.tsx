import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Calendar, PiggyBank } from "lucide-react";
import { useDebts } from "@/hooks/use-debts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { format } from "date-fns";

export const DebtComparison = () => {
  const { debts, profile } = useDebts();
  
  // Get currency symbol from profile, default to £ if not set
  const currencySymbol = profile?.preferred_currency || "£";
  
  // Calculate total debt and interest
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
  const totalInterest = debts?.reduce((sum, debt) => {
    const monthlyInterest = (debt.balance * (debt.interest_rate / 100)) / 12;
    const months = 36; // Assuming 3 years for this example
    return sum + (monthlyInterest * months);
  }, 0) || 0;
  
  // Calculate progress (example: based on paid interest vs total interest)
  const interestProgress = 60; // This should be calculated based on actual data
  
  // Calculate estimated debt-free date (example implementation)
  const calculateDebtFreeDate = () => {
    if (!debts || debts.length === 0) return new Date();
    const totalMonthlyPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
    const monthsToPayoff = Math.ceil(totalDebt / totalMonthlyPayment);
    const debtFreeDate = new Date();
    debtFreeDate.setMonth(debtFreeDate.getMonth() + monthsToPayoff);
    return debtFreeDate;
  };

  const debtFreeDate = calculateDebtFreeDate();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Your Current Debt Picture
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                        <Coins className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Debts</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {debts?.length || 0} active {debts?.length === 1 ? 'debt' : 'debts'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The total number of active debts in your portfolio</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Debt-Free Date</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {format(debtFreeDate, 'MMMM yyyy')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated date when you'll be completely debt-free based on your current plan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                        <PiggyBank className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {currencySymbol}{totalInterest.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-gray-700 dark:text-gray-300">{interestProgress}%</span>
                      </div>
                      <Progress value={interestProgress} className="h-2" />
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total interest you'll pay based on your current repayment plan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>
    </div>
  );
};