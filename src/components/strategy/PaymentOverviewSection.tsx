import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, PieChart, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/strategies";
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculatePayoffTime } from "@/lib/paymentCalculator";
import { useDebts } from "@/hooks/use-debts";
import { motion } from "framer-motion";

interface PaymentOverviewSectionProps {
  totalMinimumPayments: number;
  extraPayment: number;
  onExtraPaymentChange: (amount: number) => void;
  onOpenExtraPaymentDialog: () => void;
  currencySymbol?: string;
  totalDebtValue: number;
}

export const PaymentOverviewSection = ({
  totalMinimumPayments,
  extraPayment,
  onExtraPaymentChange,
  onOpenExtraPaymentDialog,
  currencySymbol = "£",
  totalDebtValue,
}: PaymentOverviewSectionProps) => {
  const { debts } = useDebts();
  const totalPayment = totalMinimumPayments + extraPayment;
  
  // Calculate impact metrics
  const averageInterestRate = debts?.reduce((sum, debt) => sum + debt.interest_rate, 0) / (debts?.length || 1);
  const monthsToPayoff = debts?.[0] ? calculatePayoffTime(debts[0], totalPayment) : 0;
  
  // Prepare data for pie chart
  const paymentData = [
    { name: 'Minimum Payments', value: totalMinimumPayments },
    { name: 'Extra Payment', value: extraPayment }
  ];
  const COLORS = ['#94a3b8', '#22c55e'];

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Monthly Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Breakdown Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[200px]"
          >
            <h3 className="text-sm font-medium mb-2">Payment Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsChart>
                <Pie
                  data={paymentData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currencySymbol)}
                />
              </RechartsChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Payment Impact Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-medium">Payment Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Estimated Months to Payoff</span>
                <span className="font-medium">{monthsToPayoff} months</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Percentage of Total Debt</span>
                <span className="font-medium">
                  {((totalPayment / totalDebtValue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-sm text-gray-600">Minimum Payments</span>
              <span className="font-medium">
                {formatCurrency(totalMinimumPayments, currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-sm text-gray-600">Extra Payment</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const maxValue = totalDebtValue;
                    onExtraPaymentChange(Math.min(value, maxValue));
                  }}
                  max={totalDebtValue}
                  className="w-32 text-right"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenExtraPaymentDialog}
                >
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-medium">Total Monthly Payment</span>
                <span className="font-medium text-primary">
                  {formatCurrency(totalMinimumPayments + extraPayment, currencySymbol)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};