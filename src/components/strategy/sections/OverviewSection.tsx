import { formatCurrency } from "@/lib/strategies";
import { motion } from "framer-motion";
import { TrendingUp, Clock, PiggyBank } from "lucide-react";

interface OverviewSectionProps {
  totalSavings: number;
  interestSaved: number;
  monthsSaved: number;
  currencySymbol: string;
}

export const OverviewSection = ({
  totalSavings,
  interestSaved,
  monthsSaved,
  currencySymbol
}: OverviewSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Extra Payments</p>
            <p className="text-xl font-semibold mt-1 text-primary">
              {formatCurrency(totalSavings, currencySymbol)}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-full">
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Interest Saved</p>
            <p className="text-xl font-semibold mt-1 text-orange-500">
              {formatCurrency(interestSaved, currencySymbol)}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-full">
            <Clock className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
            <p className="text-xl font-semibold mt-1 text-emerald-500">
              {monthsSaved} months
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};