import { format, addMonths } from "date-fns";
import { Calendar, DollarSign, Flag, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Debt } from "@/lib/types/debt";
import { DebtStatus } from "@/lib/utils/debtTracking";

interface DebtPaymentCardProps {
  debt: Debt;
  debtPayoff: DebtStatus;
  showDecimals: boolean;
  currencySymbol: string;
  onDelete: (debt: Debt) => void;
}

export const DebtPaymentCard = ({
  debt,
  debtPayoff,
  showDecimals,
  currencySymbol,
  onDelete
}: DebtPaymentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_PAYMENTS_SHOWN = 3;

  const payments = Array.from({ length: debtPayoff.months }, (_, i) => {
    const date = addMonths(new Date(), i);
    return {
      date,
      amount: debt.minimum_payment,
      isEndDate: false
    };
  });

  const displayedPayments = isExpanded 
    ? payments 
    : payments.slice(0, INITIAL_PAYMENTS_SHOWN);

  return (
    <Card className="h-full">
      <CardHeader className="border-b bg-primary/5">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>{debt.name}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(debt)}
          >
            ×
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Balance: {currencySymbol}{showDecimals ? debt.balance.toFixed(2) : Math.round(debt.balance).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedPayments.map((payment, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                index === 0 && "bg-primary/5"
              )}
            >
              <div className="flex items-center gap-3">
                {index === 0 ? (
                  <DollarSign className="h-5 w-5 text-primary" />
                ) : (
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{format(payment.date, 'MMM d, yyyy')}</p>
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {index === 0 ? "Next Payment" : "Minimum"}
                  </Badge>
                </div>
              </div>
              <span className="font-medium">
                {currencySymbol}{showDecimals ? payment.amount.toFixed(2) : Math.round(payment.amount).toLocaleString()}
              </span>
            </div>
          ))}

          {/* Payoff Date */}
          <div className="flex items-center justify-between p-4 bg-muted/10">
            <div className="flex items-center gap-3">
              <Flag className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">
                  {format(debtPayoff.payoffDate, 'MMM d, yyyy')}
                </p>
                <Badge variant="success" className="bg-green-600">
                  Payoff Date
                </Badge>
              </div>
            </div>
          </div>

          {payments.length > INITIAL_PAYMENTS_SHOWN && (
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 py-3"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : `Show ${payments.length - INITIAL_PAYMENTS_SHOWN} More`}
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "transform rotate-180"
              )} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};