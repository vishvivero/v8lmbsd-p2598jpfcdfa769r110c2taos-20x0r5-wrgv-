import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Debt } from "@/lib/types/debt";
import { CreditCard } from "lucide-react";
import { calculatePaymentSchedule } from "./utils/paymentSchedule";
import { PaymentSchedule } from "./PaymentSchedule";

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
  console.log('DebtColumn rendering for:', {
    debtName: debt.name,
    payoffDetails,
    monthlyAllocation
  });

  // Determine if this is the highest priority debt (getting extra payments)
  const isHighPriorityDebt = monthlyAllocation > debt.minimum_payment;
  
  // Generate payment schedule
  const paymentSchedule = calculatePaymentSchedule(
    debt,
    payoffDetails,
    monthlyAllocation,
    isHighPriorityDebt
  );

  return (
    <Card className="min-w-[300px] h-full bg-white/95">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{debt.name}</CardTitle>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{debt.banker_name}</p>
      </CardHeader>
      <CardContent>
        <PaymentSchedule 
          payments={paymentSchedule}
          currencySymbol={debt.currency_symbol}
        />
      </CardContent>
    </Card>
  );
};