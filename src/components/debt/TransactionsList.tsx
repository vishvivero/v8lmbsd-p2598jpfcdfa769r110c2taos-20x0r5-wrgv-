import { Debt } from "@/lib/types/debt";
import { format, addMonths } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TransactionsListProps {
  debt: Debt;
  payoffDetails: {
    months: number;
    totalInterest: number;
    payoffDate: Date;
  };
}

export const TransactionsList = ({ debt, payoffDetails }: TransactionsListProps) => {
  const getPaymentType = (index: number, amount: number) => {
    const isLastPayment = index === payoffDetails.months - 1;
    const isExtraPayment = amount > debt.minimum_payment;

    if (isLastPayment) return "payoff";
    if (isExtraPayment) return "extra";
    return "minimum";
  };

  const getPaymentLabel = (type: string) => {
    switch (type) {
      case "payoff":
        return { label: "Payoff", variant: "default" as const };
      case "extra":
        return { label: "Extra", variant: "secondary" as const };
      default:
        return { label: "Minimum", variant: "outline" as const };
    }
  };

  const transactions = Array.from({ length: payoffDetails.months }, (_, i) => {
    const date = addMonths(new Date(), i);
    const amount = debt.minimum_payment;
    const type = getPaymentType(i, amount);
    
    return {
      date,
      amount,
      type
    };
  });

  console.log('Rendering transactions with details:', {
    debtName: debt.name,
    totalMonths: payoffDetails.months,
    transactions: transactions.slice(0, 3) // Log first 3 for brevity
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          Upcoming
        </button>
        <button className="text-sm font-medium px-3 py-1 rounded-full text-gray-600">
          Past
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => {
          const { label, variant } = getPaymentLabel(transaction.type);
          
          return (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">💰</span>
                </div>
                <div>
                  <p className="font-medium">
                    {format(transaction.date, 'MMM d, yyyy')}
                  </p>
                  <Badge variant={variant}>
                    {label}
                  </Badge>
                </div>
              </div>
              <p className="font-semibold">
                {debt.currency_symbol}{transaction.amount.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};