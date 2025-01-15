import { motion } from "framer-motion";
import { Trophy, Flame, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/strategies";

interface StreakMetricsProps {
  metrics: {
    currentStreak: number;
    longestStreak: number;
    totalSavings: number;
    averageExtra: number;
  };
  currencySymbol: string;
}

export const StreakMetricsDisplay = ({ metrics, currencySymbol }: StreakMetricsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="grid grid-cols-2 gap-4"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-full">
            <Flame className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-semibold text-yellow-500">{metrics.currentStreak}</p>
              <span className="text-sm text-gray-500">months</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-full">
            <Trophy className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Longest Streak</p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-semibold text-purple-500">{metrics.longestStreak}</p>
              <span className="text-sm text-gray-500">months</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-full">
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Savings</p>
            <p className="text-xl font-semibold text-emerald-500">
              {formatCurrency(metrics.totalSavings, currencySymbol)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Extra</p>
            <p className="text-xl font-semibold text-blue-500">
              {formatCurrency(metrics.averageExtra, currencySymbol)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};