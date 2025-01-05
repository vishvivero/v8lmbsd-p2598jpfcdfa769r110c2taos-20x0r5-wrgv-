import { Card } from "@/components/ui/card";
import { PaymentSchedule } from "./PaymentSchedule";
import { Debt } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
import { strategies } from "@/lib/strategies";

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
  console.log('DebtColumn rendering for:', debt.name, {
    monthlyAllocation,
    payoffDetails,
    minimumPayment: debt.minimum_payment,
    redistributionHistory: payoffDetails.redistributionHistory
  });

  // Calculate the effective monthly payment including any redistributed amounts
  const effectiveMonthlyPayment = Math.max(
    debt.minimum_payment,
    monthlyAllocation
  );

  // Get redistributions for this debt
  const incomingRedistributions = payoffDetails.redistributionHistory || [];
  const totalRedistributed = incomingRedistributions.reduce((sum, r) => sum + r.amount, 0);

  return (
    <Card className="min-w-[350px] p-4 bg-white/95 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{debt.name}</h3>
          <p className="text-sm text-muted-foreground">{debt.banker_name}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Balance:</span>
            <span className="font-medium">
              {debt.currency_symbol}{debt.balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Interest Rate:</span>
            <span className="font-medium">{debt.interest_rate}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Base Monthly Payment:</span>
            <span className="font-medium">
              {debt.currency_symbol}{debt.minimum_payment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Monthly Payment:</span>
            <span className="font-medium">
              {debt.currency_symbol}{effectiveMonthlyPayment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          {totalRedistributed > 0 && (
            <div className="flex justify-between text-sm">
              <span>Total Redistributed:</span>
              <span className="font-medium text-green-600">
                +{debt.currency_symbol}{totalRedistributed.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          )}
          {incomingRedistributions.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-gray-600">Redistributions from paid debts:</p>
              {incomingRedistributions.map((r, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Month {r.month}
                  </Badge>
                  <span className="text-sm text-green-600">
                    +{debt.currency_symbol}{r.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Payment Schedule</h4>
          <PaymentSchedule
            payments={calculatePaymentSchedule(
              debt,
              payoffDetails,
              monthlyAllocation,
              debt.interest_rate > 30 // High priority if interest rate > 30%
            )}
            currencySymbol={debt.currency_symbol}
          />
        </div>
      </div>
    </Card>
  );
};