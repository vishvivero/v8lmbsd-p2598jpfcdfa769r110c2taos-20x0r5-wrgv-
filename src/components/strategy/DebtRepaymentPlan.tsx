import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DebtColumn } from "@/components/debt/DebtColumn";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculateMonthlyAllocations, calculatePayoffDetails } from "@/lib/calculations";
import { generateDebtOverviewPDF } from "@/lib/utils/pdf/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";

interface DebtRepaymentPlanProps {
  debts: Debt[];
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
}

export const DebtRepaymentPlan = ({
  debts,
  totalMonthlyPayment,
  selectedStrategy,
}: DebtRepaymentPlanProps) => {
  const { toast } = useToast();
  
  if (!debts || debts.length === 0) return null;

  console.log('DebtRepaymentPlan: Starting calculation with strategy:', selectedStrategy.name);
  const sortedDebts = selectedStrategy.calculate([...debts]);
  console.log('DebtRepaymentPlan: Sorted debts:', sortedDebts.map(d => ({ 
    name: d.name, 
    balance: d.balance,
    minimumPayment: d.minimum_payment 
  })));
  
  const { allocations, payoffDetails } = calculateMonthlyAllocations(
    sortedDebts,
    totalMonthlyPayment,
    selectedStrategy
  );

  console.log('DebtRepaymentPlan: Calculated results:', {
    allocations: Array.from(allocations.entries()).map(([id, amount]) => ({
      debtName: debts.find(d => d.id === id)?.name,
      allocation: amount
    })),
    payoffDetails: Object.entries(payoffDetails).map(([id, details]) => ({
      debtName: debts.find(d => d.id === id)?.name,
      months: details.months,
      redistributions: details.redistributionHistory?.length || 0
    }))
  });

  const handleDownload = () => {
    try {
      const doc = generateDebtOverviewPDF(sortedDebts, allocations, payoffDetails, totalMonthlyPayment, selectedStrategy);
      doc.save('debt-payoff-strategy.pdf');
      
      toast({
        title: "Success",
        description: "Your payoff strategy report has been downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate the payoff strategy report",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Card className="bg-white/95">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Debt Repayment Plan</CardTitle>
            <p className="text-sm text-muted-foreground">
              View upcoming payments for each debt
            </p>
          </div>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 p-4">
              {sortedDebts.map((debt, index) => (
                <DebtColumn
                  key={debt.id}
                  debt={debt}
                  payoffDetails={payoffDetails[debt.id]}
                  monthlyAllocation={allocations.get(debt.id) || debt.minimum_payment}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};
