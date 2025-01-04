import { motion } from "framer-motion";
import { DebtChart } from "@/components/DebtChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payoff Timeline</h2>
      <Tabs defaultValue="balance" className="w-full">
        <TabsList>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="category">Balance by category</TabsTrigger>
          <TabsTrigger value="name">Balance by debt name</TabsTrigger>
        </TabsList>
        <TabsContent value="balance">
          <DebtChart
            debts={debts}
            monthlyPayment={monthlyPayment}
            currencySymbol={currencySymbol}
          />
        </TabsContent>
        <TabsContent value="category">
          Category view coming soon...
        </TabsContent>
        <TabsContent value="name">
          Debt name view coming soon...
        </TabsContent>
      </Tabs>
    </motion.section>
  );
};