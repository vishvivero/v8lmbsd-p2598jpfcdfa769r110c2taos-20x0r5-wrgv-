import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Debt } from "@/lib/types/debt";
import { generateAmortizationPDF } from "@/lib/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";
import { calculatePayoffDetails } from "@/lib/utils/debtCalculations";

interface AmortizationTabProps {
  debts: Debt[];
}

export const AmortizationTab = ({ debts }: AmortizationTabProps) => {
  const { toast } = useToast();

  const handleDownloadReport = (debt: Debt) => {
    try {
      const payoffDetails = calculatePayoffDetails([debt], debt.minimum_payment)[debt.id];
      const doc = generateAmortizationPDF(debt, payoffDetails);
      doc.save(`amortization-schedule-${debt.name}.pdf`);
      
      toast({
        title: "Success",
        description: "Amortization schedule downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate schedule",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amortization Schedule</CardTitle>
        <CardDescription>Detailed breakdown of your debt repayment schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {debts?.map((debt) => (
            <div key={debt.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{debt.name}</h3>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleDownloadReport(debt)}
                >
                  <FileDown className="h-4 w-4" />
                  Download Schedule
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Interest Rate: {debt.interest_rate}% | 
                Monthly Payment: {debt.currency_symbol}{debt.minimum_payment}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};