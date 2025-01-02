import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDebts } from "@/hooks/use-debts";
import { PayoffProgress } from "./PayoffProgress";
import { PayoffTimeline } from "./PayoffTimeline";
import { TransactionsList } from "./TransactionsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";
import { format } from "date-fns";

export const DebtDetailsPage = () => {
  const { debtId } = useParams();
  const navigate = useNavigate();
  const { debts, profile } = useDebts();
  
  const debt = debts?.find(d => d.id === debtId);
  
  if (!debt) {
    return <div>Debt not found</div>;
  }

  const payoffDetails = calculatePayoffDetails(
    [debt],
    debt.minimum_payment,
    { 
      id: 'avalanche', 
      name: 'Avalanche', 
      description: "Pay off debts with highest interest rate first",
      calculate: (debts) => debts 
    }
  )[debt.id];

  const payoffDate = payoffDetails.payoffDate;
  const monthsToPayoff = payoffDetails.months;
  const years = Math.floor(monthsToPayoff / 12);
  const months = monthsToPayoff % 12;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/planner')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Debts
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-4">{debt.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600">Debt Payoff Date</h3>
                <p className="text-lg font-semibold">
                  {format(payoffDate, 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500">
                  in {years} years {months} months
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600">Total Interest</h3>
                <p className="text-lg font-semibold">
                  {debt.currency_symbol}{payoffDetails.totalInterest.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600">Total Payments</h3>
                <p className="text-lg font-semibold">{monthsToPayoff}</p>
              </div>
            </div>

            <PayoffProgress 
              debt={debt} 
              paid={0} 
              balance={debt.balance} 
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payoff Timeline</h2>
            <PayoffTimeline 
              debt={debt}
              extraPayment={0}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <TransactionsList 
              debt={debt}
              payoffDetails={payoffDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};