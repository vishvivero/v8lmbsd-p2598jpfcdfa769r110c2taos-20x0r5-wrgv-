import { motion } from "framer-motion";
import { useDebts } from "@/hooks/use-debts";
import { Progress } from "@/components/ui/progress";
import { Coins, Calendar, PiggyBank } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const DebtComparison = () => {
  const { debts, profile } = useDebts();
  
  // Get currency symbol from profile, default to £ if not set
  const currencySymbol = profile?.preferred_currency || "£";
  
  // Calculate total debt and interest
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
  const totalInterest = debts?.reduce((sum, debt) => {
    const monthlyInterest = (debt.balance * (debt.interest_rate / 100)) / 12;
    return sum + (monthlyInterest * 12); // Yearly interest
  }, 0) || 0;

  // Calculate estimated debt-free date (simple estimation)
  const calculateDebtFreeDate = () => {
    if (!debts?.length || !profile?.monthly_payment) return new Date();
    const totalMonthlyPayment = profile.monthly_payment;
    const months = Math.ceil(totalDebt / totalMonthlyPayment);
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
  };

  const debtFreeDate = calculateDebtFreeDate();
  const formattedDate = new Intl.DateTimeFormat('en-GB', { 
    month: 'long', 
    year: 'numeric' 
  }).format(debtFreeDate);

  // Calculate progress percentage (example calculation)
  const progressPercentage = Math.min(
    ((totalDebt - totalInterest) / totalDebt) * 100,
    100
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        How Does Your Debt Look Now?
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Debts Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl shadow-sm"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Coins className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Total Debts</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {debts?.length || 0} <span className="text-base font-normal">active</span>
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of active debts you're currently managing</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Debt-Free Date Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Debt-Free Date</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated date when you'll be debt-free based on current plan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Total Interest Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-sm"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <PiggyBank className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {currencySymbol}{totalInterest.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total interest you'll pay based on current rates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};