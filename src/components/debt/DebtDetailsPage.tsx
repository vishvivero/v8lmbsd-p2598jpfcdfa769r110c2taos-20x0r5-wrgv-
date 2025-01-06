import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDebts } from "@/hooks/use-debts";
import { strategies } from "@/lib/calculations";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayoffTimeline } from "./PayoffTimeline";
import { AmortizationTable } from "./AmortizationTable";
import { calculatePayoffDetails } from "@/lib/calculations";

export const DebtDetailsPage = () => {
  const { debtId } = useParams();
  const { debts } = useDebts();
  const debt = debts?.find(d => d.id === debtId);
  
  // Move hooks before any conditional returns
  const [selectedStrategy, setSelectedStrategy] = useState('avalanche');
  const [monthlyPayment, setMonthlyPayment] = useState(debt?.minimum_payment || 0);

  if (!debt) {
    console.log('Debt not found for id:', debtId);
    return <div>Debt not found</div>;
  }

  const strategy = strategies.find(s => s.id === selectedStrategy) || strategies[0];
  const payoffDetails = calculatePayoffDetails(debt, monthlyPayment, strategy);
  const amortizationData = calculateAmortizationSchedule(debt, monthlyPayment);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Debt Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Debt Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                  <p className="text-2xl font-bold">{debt.currency_symbol}{debt.balance.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
                  <p className="text-2xl font-bold">{debt.interest_rate}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Monthly Payment</h3>
                  <p className="text-2xl font-bold">{debt.currency_symbol}{monthlyPayment.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payoff Date</h3>
                  <p className="text-2xl font-bold">
                    {payoffDetails.payoffDate.toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payoff Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Payoff Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <PayoffTimeline 
                  debt={debt}
                  extraPayment={monthlyPayment - debt.minimum_payment}
                />
              </div>
            </CardContent>
          </Card>

          {/* Amortization Table */}
          {amortizationData && amortizationData.length > 0 && (
            <AmortizationTable debt={debt} amortizationData={amortizationData} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};
