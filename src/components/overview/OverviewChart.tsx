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
      className="glassmorphism rounded-xl p-6 shadow-lg bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Payoff Timeline
        </h2>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          Interactive
        </span>
      </div>
      
      <p className="text-gray-600 mb-6">
        Visualize your journey to becoming debt-free
      </p>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="mb-4">
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
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            Category view coming soon...
          </div>
        </TabsContent>
        <TabsContent value="name">
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            Debt name view coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </motion.section>
  );
};