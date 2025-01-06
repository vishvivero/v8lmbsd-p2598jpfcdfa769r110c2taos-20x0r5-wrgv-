import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DebtOverviewChart } from "../DebtOverviewChart";
import { Debt } from "@/lib/types";

interface DebtDistributionProps {
  debts: Debt[];
  categories: Record<string, number>;
}

export const DebtDistribution = ({ debts, categories }: DebtDistributionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Debt Distribution</CardTitle>
            <CardDescription>Overview of your debt portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <DebtOverviewChart debts={debts} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Debt Categories</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {Object.entries(categories).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <span className="text-muted-foreground">
                      {debts[0]?.currency_symbol || '£'}{amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};