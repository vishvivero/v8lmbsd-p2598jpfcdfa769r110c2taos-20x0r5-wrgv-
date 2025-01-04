import { Progress } from "@/components/ui/progress";
import { Debt } from "@/lib/types/debt";

interface PayoffProgressProps {
  debt: Debt;
  paid: number;
  balance: number;
}

export const PayoffProgress = ({ debt, paid, balance }: PayoffProgressProps) => {
  const total = paid + balance;
  const progress = (paid / total) * 100;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Payoff Progress</h2>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Paid: {debt.currency_symbol}{paid.toLocaleString()}</span>
        <span>Balance: {debt.currency_symbol}{balance.toLocaleString()}</span>
      </div>
      <Progress value={progress} className="h-4" />
      <div className="text-right text-sm text-gray-600">
        {progress.toFixed(1)}% Complete
      </div>
    </div>
  );
};