import { Card } from "@/components/ui/card";
import { PaymentSchedule } from "./PaymentSchedule";
import { Debt } from "@/lib/types";
import { calculatePaymentSchedule } from "./utils/paymentSchedule";

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
  console.log('DebtColumn rendering for:', debt.name, {
    monthlyAllocation,
    payoffDetails
  });

  const payments = calculatePaymentSchedule(
    debt,
    payoffDetails,
    monthlyAllocation,
    debt.name === "ICICI" // isHighPriorityDebt
  );

  console.log('Calculated payments for', debt.name, payments);

  return (
    <Card className="min-w-[300px] p-4 bg-white/95 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{debt.name}</h3>
          <p className="text-sm text-muted-foreground">{debt.banker_name}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Balance:</span>
            <span className="font-medium">
              {debt.currency_symbol}{debt.balance.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Interest Rate:</span>
            <span className="font-medium">{debt.interest_rate}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monthly Payment:</span>
            <span className="font-medium">
              {debt.currency_symbol}{monthlyAllocation.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Payment Schedule</h4>
          <PaymentSchedule
            payments={payments}
            currencySymbol={debt.currency_symbol}
          />
        </div>
      </div>
    </Card>
  );
};