import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Debt } from "@/lib/types/debt";

interface AmortizationTabProps {
  debts: Debt[];
  handleDownloadReport: (reportType: string) => void;
}

export const AmortizationTab = ({ debts, handleDownloadReport }: AmortizationTabProps) => {
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
                  onClick={() => handleDownloadReport(`Amortization - ${debt.name}`)}
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