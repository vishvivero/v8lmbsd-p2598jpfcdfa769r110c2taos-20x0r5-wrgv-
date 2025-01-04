import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { DebtOverviewChart } from "./DebtOverviewChart";
import { Debt } from "@/lib/types/debt";
import { generateDebtOverviewPDF } from "@/lib/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";

interface OverviewTabProps {
  debts: Debt[];
}

export const OverviewTab = ({ debts }: OverviewTabProps) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    try {
      const doc = generateDebtOverviewPDF(debts);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debt Overview</CardTitle>
        <CardDescription>Summary of your current debts and payment progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <DebtOverviewChart debts={debts} />
          <div className="space-y-4">
            <Button 
              className="w-full flex items-center gap-2"
              onClick={handleDownloadReport}
            >
              <FileDown className="h-4 w-4" />
              Download Debt Overview Report
            </Button>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {debts?.map((debt) => (
                  <div key={debt.id} className="flex justify-between items-center">
                    <span>{debt.name}</span>
                    <span>{debt.currency_symbol}{debt.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};