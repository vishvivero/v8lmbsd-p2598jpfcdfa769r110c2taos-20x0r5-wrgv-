import { motion } from "framer-motion";
import { DebtChart } from "@/components/DebtChart";
import { DebtCategoryChart } from "@/components/debt/DebtCategoryChart";
import { DebtNameChart } from "@/components/debt/DebtNameChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TrendingUp, ChartLine, BarChart3 } from "lucide-react";
import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

interface OverviewChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol: string;
  oneTimeFundings?: OneTimeFunding[];
  totalMinPayments: number;
}

export const OverviewChart = ({
  debts,
  monthlyPayment,
  currencySymbol,
  oneTimeFundings = []
}: OverviewChartProps) => {
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-[#107A57]">PAYOFF TIMELINE</CardTitle>
            <div className="w-12 h-12 bg-[#34D399]/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#34D399]" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Track your journey to becoming debt-free with interactive visualizations
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="balance" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#E5E7EB]">
              <TabsTrigger 
                value="balance" 
                className="flex items-center gap-2 data-[state=active]:bg-[#34D399] data-[state=active]:text-white"
              >
                <ChartLine className="w-4 h-4" />
                Balance
              </TabsTrigger>
              <TabsTrigger 
                value="category"
                className="flex items-center gap-2 data-[state=active]:bg-[#34D399] data-[state=active]:text-white"
              >
                <BarChart3 className="w-4 h-4" />
                By Category
              </TabsTrigger>
              <TabsTrigger 
                value="name"
                className="flex items-center gap-2 data-[state=active]:bg-[#34D399] data-[state=active]:text-white"
              >
                <BarChart3 className="w-4 h-4" />
                By Name
              </TabsTrigger>
            </TabsList>

            <TabsContent value="balance" className="min-h-[400px]">
              <DebtChart
                debts={debts}
                monthlyPayment={monthlyPayment}
                currencySymbol={currencySymbol}
                oneTimeFundings={oneTimeFundings}
                totalMinPayments={totalMinPayments}
              />
            </TabsContent>

            <TabsContent value="category" className="min-h-[400px]">
              <DebtCategoryChart
                debts={debts}
                currencySymbol={currencySymbol}
              />
            </TabsContent>

            <TabsContent value="name" className="min-h-[400px]">
              <DebtNameChart
                debts={debts}
                currencySymbol={currencySymbol}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};