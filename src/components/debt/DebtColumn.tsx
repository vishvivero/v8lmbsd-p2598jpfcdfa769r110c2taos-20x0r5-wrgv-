import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { formatCurrency } from "@/lib/strategies";
import { CalendarDays, CreditCard, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface DebtColumnProps {
  debt: Debt;
  monthlyPayment: number;
}

export const DebtColumn = ({ debt, monthlyPayment }: DebtColumnProps) => {
  // Generate next 6 payment dates
  const getNextPaymentDates = () => {
    const dates = [];
    let currentDate = debt.next_payment_date 
      ? new Date(debt.next_payment_date) 
      : new Date();

    for (let i = 0; i < 6; i++) {
      dates.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return dates;
  };

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
        {getNextPaymentDates().map((date, index) => (
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
      </CardContent>
    </Card>
  );
};