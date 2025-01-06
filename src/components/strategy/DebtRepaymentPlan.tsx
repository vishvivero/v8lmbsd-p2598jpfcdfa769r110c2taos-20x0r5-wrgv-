import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculateMonthlyAllocations } from "./PaymentCalculator";
import { generatePayoffStrategyPDF } from "@/lib/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { PaymentSchedule } from "@/components/debt/PaymentSchedule";

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
  
  const { allocations, payoffDetails } = calculateMonthlyAllocations(
    sortedDebts,
    totalMonthlyPayment,
    selectedStrategy
  );

  const handleDownload = () => {
    try {
      const doc = generatePayoffStrategyPDF(sortedDebts, allocations, payoffDetails, totalMonthlyPayment, selectedStrategy);
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

  const scrollLeft = () => {
    const container = document.querySelector('.debt-cards-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.querySelector('.debt-cards-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              className="hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="hidden md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="debt-cards-container flex space-x-4 p-4">
              {sortedDebts.map((debt) => (
                <div key={debt.id} className="flex-none w-[350px]">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="space-y-1">
                        <CardTitle>{debt.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{debt.banker_name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Balance:</p>
                          <p className="text-lg font-semibold">
                            {debt.currency_symbol}{debt.balance.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate:</p>
                          <p className="text-lg font-semibold">
                            {debt.interest_rate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Payment:</p>
                          <p className="text-lg font-semibold">
                            {debt.currency_symbol}{debt.minimum_payment.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Payment Schedule</h4>
                        <PaymentSchedule
                          payments={calculatePaymentSchedule(
                            debt,
                            payoffDetails[debt.id],
                            allocations.get(debt.id) || debt.minimum_payment,
                            sortedDebts[0].id === debt.id
                          )}
                          currencySymbol={debt.currency_symbol}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};