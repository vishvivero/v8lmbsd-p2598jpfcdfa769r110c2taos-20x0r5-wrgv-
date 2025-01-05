import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculatePaymentSchedule } from "@/lib/utils/payment/paymentSchedule";
import { Debt } from "@/lib/types";
import { Payment } from "@/lib/types/payment";

interface DebtColumnProps {
  debt: Debt;
  payoffDetails: {
    months: number;
    totalInterest: number;
    payoffDate: Date;
    redistributionHistory?: {
      fromDebtId: string;
      amount: number;
      month: number;
    }[];
  };
  monthlyAllocation: number;
}

export const DebtColumn = ({ debt, payoffDetails, monthlyAllocation }: DebtColumnProps) => {
  console.log('DebtColumn render for', debt.name, {
    payoffDetails,
    monthlyAllocation
  });

  const schedule = calculatePaymentSchedule(
    debt,
    payoffDetails,
    monthlyAllocation,
    true
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', debt.currency_symbol);
  };

  return (
    <Card className="w-[300px] flex-shrink-0 snap-center bg-white/95">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{debt.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(debt.balance)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Payoff</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(payoffDetails.payoffDate)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {schedule.map((payment: Payment, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  payment.isLastPayment
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span>{formatDate(payment.date)}</span>
                  <span className="font-medium">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Balance</span>
                  <span>{formatCurrency(payment.remainingBalance)}</span>
                </div>
                {payment.redistributedAmount > 0 && (
                  <div className="text-xs text-green-600 flex justify-between mt-1">
                    <span>Extra</span>
                    <span>+{formatCurrency(payment.redistributedAmount)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};