import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDebts } from "@/hooks/use-debts";
import { strategies } from "@/lib/strategies";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayoffTimeline } from "./PayoffTimeline";
import { AmortizationTable } from "./AmortizationTable";
import { DebtHeroSection } from "./details/DebtHeroSection";
import { PaymentOverview } from "./details/PaymentOverview";
import { usePaymentHistory } from "@/hooks/use-payment-history";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { 
  calculateAmortizationSchedule, 
  calculateSingleDebtPayoff 
} from "@/lib/utils/payment/standardizedCalculations";

export const DebtDetailsPage = () => {
  const { debtId } = useParams();
  const { debts } = useDebts();
  const { profile } = useProfile();
  const debt = debts?.find(d => d.id === debtId);
  
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('avalanche');
  const [monthlyPayment, setMonthlyPayment] = useState(debt?.minimum_payment || 0);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!debt) return;

      const { data: payments, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', debt.user_id);

      if (error) {
        console.error('Error fetching payment history:', error);
        return;
      }

      const total = payments.reduce((sum, payment) => sum + Number(payment.total_payment), 0);
      setTotalPaid(total);

      // Calculate total interest (simplified version)
      const interest = payments.reduce((sum, payment) => {
        const interestPortion = (Number(payment.total_payment) * (debt.interest_rate / 100)) / 12;
        return sum + interestPortion;
      }, 0);
      setTotalInterest(interest);
    };

    fetchPaymentHistory();
  }, [debt]);

  if (!debt) {
    console.log('Debt not found for id:', debtId);
    return <div>Debt not found</div>;
  }

  const strategy = strategies.find(s => s.id === selectedStrategy) || strategies[0];
  const payoffDetails = calculateSingleDebtPayoff(debt, monthlyPayment, strategy);
  const amortizationData = calculateAmortizationSchedule(debt, monthlyPayment);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <DebtHeroSection 
            debt={debt}
            totalPaid={totalPaid}
            payoffDate={payoffDetails.payoffDate}
          />

          {/* Payment Overview */}
          <PaymentOverview
            debt={debt}
            totalPaid={totalPaid}
            totalInterest={totalInterest}
          />

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