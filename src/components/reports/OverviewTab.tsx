import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Debt } from "@/lib/types";
import { generateDebtOverviewPDF } from "@/lib/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { calculateMonthlyAllocations } from "@/components/strategy/PaymentCalculator";
import { strategies } from "@/lib/strategies";
import { KeyMetrics } from "./overview/KeyMetrics";
import { DebtDistribution } from "./overview/DebtDistribution";

interface OverviewTabProps {
  debts: Debt[];
}

export const OverviewTab = ({ debts }: OverviewTabProps) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    try {
      const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
      const { allocations, payoffDetails } = calculateMonthlyAllocations(
        debts,
        totalMinimumPayments,
        strategies[0] // Default to first strategy
      );
      
      const doc = generateDebtOverviewPDF(
        debts,
        allocations,
        payoffDetails,
        totalMinimumPayments,
        strategies[0]
      );
      
      doc.save('debt-overview-report.pdf');
      
      toast({
        title: "Success",
        description: "Debt overview report downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const averageInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length 
    : 0;
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);

  const categories = debts.reduce((acc, debt) => {
    acc[debt.category] = (acc[debt.category] || 0) + debt.balance;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <KeyMetrics 
        debts={debts}
        totalDebt={totalDebt}
        averageInterestRate={averageInterestRate}
        totalMinimumPayment={totalMinimumPayment}
        categories={categories}
      />

      <DebtDistribution 
        debts={debts}
        categories={categories}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-end"
      >
        <Button 
          onClick={handleDownloadReport}
          className="bg-primary hover:bg-primary/90 flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download Overview Report
        </Button>
      </motion.div>
    </div>
  );
};