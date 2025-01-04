import { useParams, useNavigate } from "react-router-dom";
import { useDebts } from "@/hooks/use-debts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, DollarSign, Percent, TrendingUp } from "lucide-react";
import { PayoffTimeline } from "./PayoffTimeline";
import { TransactionsList } from "./TransactionsList";
import { calculatePayoffDetails, calculatePayoffTimeline } from "@/lib/utils/paymentCalculations";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { AmortizationTable } from "./AmortizationTable";

export const DebtDetailsPage = () => {
  const { debtId } = useParams();
  const navigate = useNavigate();
  const { debts } = useDebts();
  
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

  const monthsToPayoff = payoffDetails.months;
  const years = Math.floor(monthsToPayoff / 12);
  const months = monthsToPayoff % 12;

  const amortizationData = calculatePayoffTimeline(debt, 0);
  
  console.log('Calculated amortization data:', {
    debtName: debt.name,
    dataPoints: amortizationData.length,
    firstMonth: amortizationData[0]
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/overview/debts')}
            className="flex items-center gap-2 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Debts
          </Button>
        </div>

        <div className="space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{debt.currency_symbol}{debt.balance.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-700 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Interest Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{debt.interest_rate}%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Next Payment Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {format(new Date(debt.next_payment_date), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Time to Payoff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{years}y {months}m</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline and Payments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payoff Timeline */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Payoff Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <PayoffTimeline 
                      debt={debt}
                      extraPayment={0}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Payments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionsList 
                    debt={debt}
                    payoffDetails={payoffDetails}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Amortization Table */}
          <AmortizationTable debt={debt} amortizationData={amortizationData} />
        </div>
      </div>
    </MainLayout>
  );
};