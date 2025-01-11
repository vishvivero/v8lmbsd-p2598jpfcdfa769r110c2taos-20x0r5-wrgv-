import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
import { generatePayoffStrategyPDF } from "@/lib/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";
import { PaymentSchedule } from "@/components/debt/PaymentSchedule";
import { Badge } from "@/components/ui/badge";
import { calculatePaymentSchedule } from "@/lib/utils/payment/paymentSchedule";

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
  
  // Use the same calculation method as OverviewSummary
  const payoffDetails = calculatePayoffDetails(
    sortedDebts,
    totalMonthlyPayment,
    selectedStrategy,
    [] // We'll add one-time funding support in a future update if needed
  );

  // Calculate payment allocations based on the strategy
  const allocations = new Map<string, number>();
  const totalMinPayments = sortedDebts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const extraPayment = Math.max(0, totalMonthlyPayment - totalMinPayments);

  // Distribute minimum payments
  sortedDebts.forEach(debt => {
    allocations.set(debt.id, debt.minimum_payment);
  });

  // Add extra payment to highest priority debt
  if (extraPayment > 0 && sortedDebts.length > 0) {
    const highestPriorityDebt = sortedDebts[0];
    allocations.set(
      highestPriorityDebt.id,
      (allocations.get(highestPriorityDebt.id) || 0) + extraPayment
    );
  }

  const handleDownload = () => {
    try {
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Debt Repayment Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View your personalized debt payoff schedule
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
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="debt-cards-container flex space-x-4 p-4">
              {sortedDebts.map((debt, index) => (
                <div key={debt.id} className="flex-none w-[350px]">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="space-y-1">
                        <CardTitle>{debt.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {debt.banker_name || "Not specified"}
                        </p>
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
                            {debt.currency_symbol}{(allocations.get(debt.id) || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payoff Date:</p>
                          <p className="text-lg font-semibold">
                            {payoffDetails[debt.id].payoffDate.toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Payment Schedule</h4>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {index === 0 ? 'Priority' : 'Upcoming'}
                          </Badge>
                        </div>
                        <PaymentSchedule
                          payments={calculatePaymentSchedule(
                            debt,
                            payoffDetails[debt.id],
                            allocations.get(debt.id) || debt.minimum_payment,
                            index === 0
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