import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/strategies";
import { Debt } from "@/lib/types/debt";
import { calculatePaymentDistribution } from "@/lib/utils/paymentCalculations";

interface PaymentOverviewProps {
  debts: Debt[];
  monthlyPayment: number;
  selectedStrategy: string;
  currencySymbol: string;
  onExtraPaymentClick: () => void;
  onSaveExtra: (amount: number) => void;
}

export const PaymentOverview = ({
  debts,
  monthlyPayment,
  selectedStrategy,
  currencySymbol,
  onExtraPaymentClick,
  onSaveExtra,
}: PaymentOverviewProps) => {
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const extraPayment = Math.max(0, monthlyPayment - totalMinimumPayments);
  
  const paymentDistribution = calculatePaymentDistribution(
    debts,
    monthlyPayment,
    selectedStrategy
  );

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Payment Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm text-gray-600">Minimum Payments</span>
            <span className="font-medium">
              {formatCurrency(totalMinimumPayments, currencySymbol)}
            </span>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-sm text-gray-600">Extra Payment</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={extraPayment}
                onChange={(e) => {
                  const newExtra = Number(e.target.value);
                  onSaveExtra(totalMinimumPayments + newExtra);
                }}
                className="w-32 text-right"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={onExtraPaymentClick}
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="font-medium">Total Monthly Payment</span>
              <span className="font-medium text-primary">
                {formatCurrency(monthlyPayment, currencySymbol)}
              </span>
            </div>
          </div>
          
          {paymentDistribution.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Payment Distribution</h3>
              {paymentDistribution.map((allocation, index) => (
                <div key={allocation.debtId} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{allocation.debtName}</span>
                  <span className="font-medium">
                    {formatCurrency(allocation.payment, currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};