import { motion } from "framer-motion";
import { DebtChart } from "@/components/debt/DebtChart";
import { DebtCategoryChart } from "@/components/debt/DebtCategoryChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TrendingUp, ChartLine, PieChart, BarChart3 } from "lucide-react";
import { Debt } from "@/lib/types/debt";

interface OverviewChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol: string;
}

export const OverviewChart = ({
  debts,
  monthlyPayment,
  currencySymbol,
}: OverviewChartProps) => {
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
                <PieChart className="w-4 h-4" />
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

            <TabsContent value="balance">
              <DebtChart
                debts={debts}
                monthlyPayment={monthlyPayment}
                currencySymbol={currencySymbol}
              />
            </TabsContent>

            <TabsContent value="category">
              <DebtCategoryChart
                debts={debts}
                currencySymbol={currencySymbol}
              />
            </TabsContent>

            <TabsContent value="name">
              <div className="h-[400px] flex flex-col items-center justify-center gap-4 bg-[#E5E7EB]/20 rounded-xl">
                <BarChart3 className="w-12 h-12 text-[#34D399]" />
                <p className="text-gray-600 text-center">
                  Debt name breakdown coming soon...<br />
                  <span className="text-sm text-gray-500">Compare individual debt balances</span>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};