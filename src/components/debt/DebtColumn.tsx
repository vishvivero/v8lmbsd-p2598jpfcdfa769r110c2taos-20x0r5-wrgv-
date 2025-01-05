import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { formatCurrency } from "@/lib/strategies";
import { CalendarDays, CreditCard, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";
import { strategies } from "@/lib/strategies";

interface DebtColumnProps {
  debt: Debt;
  monthlyPayment: number;
}

export const DebtColumn = ({ debt, monthlyPayment }: DebtColumnProps) => {
  const [showAllPayments, setShowAllPayments] = useState(false);
  
  // Use the same calculation logic as DebtTableContainer
  const strategy = strategies.find(s => s.id === 'avalanche') || strategies[0];
  const payoffDetails = calculatePayoffDetails([debt], monthlyPayment, strategy, []);
  const debtPayoff = payoffDetails[debt.id];
  
  // Generate payment dates based on calculated months
  const getPaymentDates = () => {
    const dates = [];
    let currentDate = debt.next_payment_date 
      ? new Date(debt.next_payment_date) 
      : new Date();

    for (let i = 0; i < debtPayoff.months; i++) {
      dates.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return dates;
  };

  const paymentDates = getPaymentDates();
  const visibleDates = showAllPayments ? paymentDates : paymentDates.slice(0, 3);
  const remainingDates = paymentDates.length - 3;

  return (
    <Card className="min-w-[300px] h-full bg-white/95">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{debt.name}</CardTitle>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{debt.banker_name}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleDates.map((date, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {format(date, "MMM d, yyyy")}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {index === 0 ? "Next Payment" : `Payment ${index + 1}`}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {formatCurrency(monthlyPayment, debt.currency_symbol)}
              </span>
            </div>
          </div>
        ))}

        {/* Show final payment date if not showing all payments */}
        {!showAllPayments && paymentDates.length > 3 && (
          <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 text-muted-foreground">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">
                  {format(paymentDates[paymentDates.length - 1], "MMM d, yyyy")}
                </p>
                <Badge variant="secondary" className="text-xs">
                  Final Payment
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                {formatCurrency(monthlyPayment, debt.currency_symbol)}
              </span>
            </div>
          </div>
        )}

        {paymentDates.length > 3 && (
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowAllPayments(!showAllPayments)}
          >
            {showAllPayments ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show {remainingDates} More Payments <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};