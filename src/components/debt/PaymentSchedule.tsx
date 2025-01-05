import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/strategies";
import { useState } from "react";

interface Payment {
  date: Date;
  amount: number;
  isLastPayment: boolean;
  remainingBalance: number;
}

interface PaymentScheduleProps {
  payments: Payment[];
  currencySymbol: string;
}

export const PaymentSchedule = ({ payments, currencySymbol }: PaymentScheduleProps) => {
  const [showAllPayments, setShowAllPayments] = useState(false);
  const visiblePayments = showAllPayments ? payments : payments.slice(0, 3);
  const remainingPayments = payments.length - 3;

  return (
    <div className="space-y-4">
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
              {formatCurrency(payment.amount, currencySymbol)}
            </span>
          </div>
        </div>
      ))}

      {/* Show final payment if not showing all payments */}
      {!showAllPayments && payments.length > 3 && (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 text-muted-foreground">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium">
                {format(payments[payments.length - 1].date, "MMM d, yyyy")}
              </p>
              <Badge variant="secondary" className="text-xs">
                Final Payment
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">
              {formatCurrency(payments[payments.length - 1].amount, currencySymbol)}
            </span>
          </div>
        </div>
      )}

      {payments.length > 3 && (
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
    </div>
  );
};