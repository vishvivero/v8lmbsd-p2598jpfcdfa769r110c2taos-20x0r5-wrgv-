import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Calendar } from "lucide-react";

interface ComparisonMetricsProps {
  monthsSaved: number;
  moneySaved: number;
  currencySymbol: string;
}

export const ComparisonMetrics = ({ monthsSaved, moneySaved, currencySymbol }: ComparisonMetricsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Time Saved</span>
                  <div className="text-lg font-semibold text-emerald-600">
                    {monthsSaved} months
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/80 dark:bg-gray-800/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Money Saved</span>
                  <div className="text-lg font-semibold text-emerald-600">
                    {currencySymbol}{moneySaved.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};