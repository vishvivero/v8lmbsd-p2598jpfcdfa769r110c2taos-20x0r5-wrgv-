import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/lib/types/payment";
import { ArrowDownRight } from "lucide-react";

interface PaymentScheduleProps {
  payments: Payment[];
  currencySymbol: string;
}

export const PaymentSchedule = ({ payments, currencySymbol }: PaymentScheduleProps) => {
  console.log('Rendering PaymentSchedule with payments:', payments);

  const formatAmount = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '0.00';
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          Upcoming
        </button>
      </div>

      <div className="space-y-4">
        {payments.slice(0, 6).map((payment, index) => (
          <div key={index} className="flex flex-col gap-2 py-2 border-b last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {payment.redistributedAmount ? (
                    <ArrowDownRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <span className="text-gray-600">💰</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {format(payment.date, 'MMM d, yyyy')}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={payment.isLastPayment ? "default" : "secondary"}>
                      {payment.isLastPayment ? "Final Payment" : `Payment ${index + 1}`}
                    </Badge>
                    {payment.redistributedAmount > 0 && (
                      <Badge variant="success" className="bg-green-100 text-green-700">
                        Includes Redistribution
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold flex flex-col items-end">
                  <span>{currencySymbol}{formatAmount(payment.amount)}</span>
                  {payment.redistributedAmount > 0 && (
                    <span className="text-xs text-green-600">
                      (+{currencySymbol}{formatAmount(payment.redistributedAmount)})
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Balance: {currencySymbol}{formatAmount(payment.remainingBalance)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span>Principal: </span>
                <span className="font-medium">{currencySymbol}{formatAmount(payment.principalPaid)}</span>
              </div>
              <div className="text-right">
                <span>Interest: </span>
                <span className="font-medium">{currencySymbol}{formatAmount(payment.interestPaid)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};