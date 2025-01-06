import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, Tag } from "lucide-react";
import { Debt } from "@/lib/types";

interface KeyMetricsProps {
  debts: Debt[];
  totalDebt: number;
  averageInterestRate: number;
  totalMinimumPayment: number;
  categories: Record<string, number>;
}

export const KeyMetrics = ({
  debts,
  totalDebt,
  averageInterestRate,
  totalMinimumPayment,
  categories
}: KeyMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Debt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{debts[0]?.currency_symbol || '£'}{totalDebt.toLocaleString()}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Average Interest Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{averageInterestRate.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Minimum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{debts[0]?.currency_symbol || '£'}{totalMinimumPayment.toLocaleString()}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Object.keys(categories).length}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};