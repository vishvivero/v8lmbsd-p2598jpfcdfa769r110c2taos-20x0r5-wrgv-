import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDebts } from "@/hooks/use-debts";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
import { strategies } from "@/lib/strategies";

interface PayoffProgressProps {
  totalDebt: number;
  currencySymbol: string;
}

export const PayoffProgress = ({ totalDebt, currencySymbol }: PayoffProgressProps) => {
  const { debts, profile } = useDebts();

  const calculateProjectedPayoffDate = () => {
    if (!debts || debts.length === 0 || !profile) {
      console.log('No debts or profile available for payoff calculation');
      return undefined;
    }

    // Use the standardized calculation method
    const strategy = strategies.find(s => s.id === profile.selected_strategy) || strategies[0];
    const sortedDebts = strategy.calculate([...debts]);
    const payoffDetails = calculatePayoffDetails(
      sortedDebts,
      profile.monthly_payment,
      strategy,
      []
    );

    // Find the latest payoff date
    const latestPayoffDate = new Date(Math.max(
      ...Object.values(payoffDetails).map(detail => detail.payoffDate.getTime())
    ));

    console.log('Calculated payoff details:', {
      totalDebts: debts.length,
      monthlyPayment: profile.monthly_payment,
      strategy: strategy.name,
      latestPayoffDate: latestPayoffDate.toISOString(),
      payoffDetails: Object.entries(payoffDetails).map(([debtId, details]) => ({
        debtName: debts.find(d => d.id === debtId)?.name,
        months: details.months,
        totalInterest: details.totalInterest,
        payoffDate: details.payoffDate
      }))
    });

    return latestPayoffDate;
  };

  const projectedDate = calculateProjectedPayoffDate();
  const monthsToPayoff = projectedDate 
    ? Math.ceil((projectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('$', currencySymbol);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculate total paid amount based on original debt minus current balance
  const paidAmount = debts?.reduce((sum, debt) => {
    const originalDebt = debt.balance + (debt.status === 'paid' ? debt.balance : 0);
    return sum + (originalDebt - debt.balance);
  }, 0) ?? 0;

  const progressPercentage = totalDebt > 0 ? (paidAmount / totalDebt) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-2xl">
                {formatCurrency(totalDebt)}
              </h2>
              <p className="text-sm text-muted-foreground">Total debt</p>
            </div>
            {projectedDate && (
              <div className="text-right">
                <p className="font-medium">{formatDate(projectedDate)}</p>
                <p className="text-sm text-muted-foreground">
                  {monthsToPayoff} months to go
                </p>
              </div>
            )}
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-sm text-muted-foreground flex justify-between">
            <span>Paid: {formatCurrency(paidAmount)}</span>
            <span>{progressPercentage.toFixed(1)}% Complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};