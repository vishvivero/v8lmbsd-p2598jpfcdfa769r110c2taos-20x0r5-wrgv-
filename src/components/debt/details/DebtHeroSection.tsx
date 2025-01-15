import { Debt } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "./CircularProgress";
import { formatCurrency } from "@/lib/strategies";
import { CalendarDays, TrendingUp, CreditCard, Clock } from "lucide-react";

interface DebtHeroSectionProps {
  debt: Debt;
  totalPaid: number;
  payoffDate: Date;
}

export const DebtHeroSection = ({ debt, totalPaid, payoffDate }: DebtHeroSectionProps) => {
  const progressPercentage = (totalPaid / (totalPaid + debt.balance)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{debt.name}</h1>
          <p className="text-muted-foreground">{debt.banker_name}</p>
        </div>
        <CircularProgress percentage={progressPercentage} size={120} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Balance</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(debt.balance, debt.currency_symbol)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Interest Rate</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{debt.interest_rate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Monthly Payment</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(debt.minimum_payment, debt.currency_symbol)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Payoff Date</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {payoffDate.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};