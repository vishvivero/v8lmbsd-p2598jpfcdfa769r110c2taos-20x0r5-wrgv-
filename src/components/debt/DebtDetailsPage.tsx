import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDebts } from "@/hooks/use-debts";
import { strategies } from "@/lib/strategies";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { Separator } from "@/components/ui/separator";

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
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <DebtHeroSection 
          debt={debt}
          totalPaid={totalPaid}
          payoffDate={payoffDetails.payoffDate}
        />

        <Separator className="my-8" />

        {/* Payment Overview */}
        <PaymentOverview
          debt={debt}
          totalPaid={totalPaid}
          totalInterest={totalInterest}
        />

        <Separator className="my-8" />

        {/* Payoff Timeline */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Payoff Timeline</h2>
          <div className="h-[400px]">
            <PayoffTimeline 
              debt={debt}
              extraPayment={monthlyPayment - debt.minimum_payment}
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Amortization Table */}
        {amortizationData && amortizationData.length > 0 && (
          <AmortizationTable 
            debt={debt} 
            amortizationData={amortizationData} 
          />
        )}
      </div>
    </MainLayout>
  );
};