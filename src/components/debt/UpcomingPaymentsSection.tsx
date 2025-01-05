import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Flag } from "lucide-react";
import { Debt } from "@/lib/types/debt";
import { addMonths, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UpcomingPaymentsSectionProps {
  debts: Debt[];
}

export const UpcomingPaymentsSection = ({ debts }: UpcomingPaymentsSectionProps) => {
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [showPastPayments, setShowPastPayments] = useState(false);

  const generatePayments = (debt: Debt) => {
    const monthsToPayoff = Math.ceil(debt.balance / debt.minimum_payment);
    let currentDate = debt.next_payment_date ? new Date(debt.next_payment_date) : new Date();
    const payments = [];

    // Generate monthly payments
    for (let i = 0; i < monthsToPayoff; i++) {
      payments.push({
        date: currentDate,
        amount: debt.minimum_payment,
        type: i === monthsToPayoff - 1 ? "payoff" : "minimum"
      });
      currentDate = addMonths(currentDate, 1);
    }

    return payments;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upcoming Payments by Debt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {debts.map((debt) => (
            <Card key={debt.id} className="bg-white/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{debt.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Balance: {debt.currency_symbol}{debt.balance.toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={!showPastPayments ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowPastPayments(false)}
                    >
                      Upcoming
                    </Button>
                    <Button
                      variant={showPastPayments ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowPastPayments(true)}
                    >
                      Past
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {generatePayments(debt).slice(0, 5).map((payment, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          index === 0 ? "bg-primary/5" : "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 ? (
                            <DollarSign className="h-5 w-5 text-primary" />
                          ) : payment.type === "payoff" ? (
                            <Flag className="h-5 w-5 text-green-600" />
                          ) : (
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">
                              {format(payment.date, 'MMM d, yyyy')}
                            </p>
                            <Badge variant={payment.type === "payoff" ? "default" : "secondary"}>
                              {payment.type === "payoff" ? "Payoff" : index === 0 ? "Next Payment" : "Minimum"}
                            </Badge>
                          </div>
                        </div>
                        <span className="font-medium">
                          {debt.currency_symbol}{payment.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};