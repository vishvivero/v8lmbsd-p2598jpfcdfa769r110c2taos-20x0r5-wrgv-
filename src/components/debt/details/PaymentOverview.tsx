import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/strategies";
import { Debt } from "@/lib/types";

interface PaymentOverviewProps {
  debt: Debt;
  totalPaid: number;
  totalInterest: number;
}

export const PaymentOverview = ({ debt, totalPaid, totalInterest }: PaymentOverviewProps) => {
  const principalPaid = totalPaid - totalInterest;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalPaid, debt.currency_symbol)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total amount paid towards debt
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Interest Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalInterest, debt.currency_symbol)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total interest charges
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Principal Reduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(principalPaid, debt.currency_symbol)}
          </div>
          <p className="text-xs text-muted-foreground">
            Amount reducing principal
          </p>
        </CardContent>
      </Card>
    </div>
  );
};