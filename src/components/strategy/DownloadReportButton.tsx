import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generatePayoffStrategyPDF } from "@/lib/utils/pdfGenerator";
import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { DebtStatus } from "@/lib/utils/payment/types";

interface DownloadReportButtonProps {
  sortedDebts: Debt[];
  allocations: Map<string, number>;
  payoffDetails: { [key: string]: DebtStatus };
  totalMonthlyPayment: number;
  selectedStrategy: Strategy;
}

export const DownloadReportButton = ({
  sortedDebts,
  allocations,
  payoffDetails,
  totalMonthlyPayment,
  selectedStrategy,
}: DownloadReportButtonProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      console.log('Generating PDF report...');
      const doc = generatePayoffStrategyPDF(
        sortedDebts,
        allocations,
        payoffDetails,
        totalMonthlyPayment,
        selectedStrategy
      );
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
    <Button
      onClick={handleDownload}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download Report
    </Button>
  );
};