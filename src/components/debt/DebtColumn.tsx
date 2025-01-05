import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { formatCurrency } from "@/lib/strategies";
import { CalendarDays, CreditCard, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { format, addMonths } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DebtColumnProps {
  debt: Debt;
  payoffDetails: {
    months: number;
    totalInterest: number;
    payoffDate: Date;
  };
  monthlyAllocation: number;
}

export const DebtColumn = ({ debt, payoffDetails, monthlyAllocation }: DebtColumnProps) => {
  const [showAllPayments, setShowAllPayments] = useState(false);
  
  console.log('DebtColumn rendering for:', {
    debtName: debt.name,
    payoffDetails,
    monthlyAllocation
  });
  
  // Generate payment schedule based on payoff details
  const getPaymentSchedule = () => {
    const schedule = [];
    let currentDate = debt.next_payment_date 
      ? new Date(debt.next_payment_date) 
      : new Date();

    // For the first debt in priority (getting extra payments)
    const isGettingExtraPayment = monthlyAllocation > debt.minimum_payment;
    
    for (let i = 0; i < payoffDetails.months; i++) {
      // Calculate payment amount for this month
      let paymentAmount = isGettingExtraPayment ? monthlyAllocation : debt.minimum_payment;
      
      schedule.push({
        date: new Date(currentDate),
        amount: paymentAmount,
        isLastPayment: i === payoffDetails.months - 1
      });
      
      currentDate = addMonths(currentDate, 1);
    }
    
    return schedule;
  };

  const paymentSchedule = getPaymentSchedule();
  const visiblePayments = showAllPayments ? paymentSchedule : paymentSchedule.slice(0, 3);
  const remainingPayments = paymentSchedule.length - 3;

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
        {visiblePayments.map((payment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {format(payment.date, "MMM d, yyyy")}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {index === 0 ? "Next Payment" : payment.isLastPayment ? "Final Payment" : `Payment ${index + 1}`}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {formatCurrency(payment.amount, debt.currency_symbol)}
              </span>
            </div>
          </div>
        ))}

        {/* Show final payment if not showing all payments */}
        {!showAllPayments && paymentSchedule.length > 3 && (
          <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 text-muted-foreground">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">
                  {format(paymentSchedule[paymentSchedule.length - 1].date, "MMM d, yyyy")}
                </p>
                <Badge variant="secondary" className="text-xs">
                  Final Payment
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                {formatCurrency(paymentSchedule[paymentSchedule.length - 1].amount, debt.currency_symbol)}
              </span>
            </div>
          </div>
        )}

        {paymentSchedule.length > 3 && (
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
                Show {remainingPayments} More Payments <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};