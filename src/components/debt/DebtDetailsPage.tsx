import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDebts } from "@/hooks/use-debts";
import { Debt } from "@/lib/types/debt";
import { strategies } from "@/lib/strategies";
import { calculateSingleDebtPayoff } from "@/lib/utils/payment/standardizedCalculations";
import { MainLayout } from "@/components/layout/MainLayout";
import { DebtDetails } from "@/components/debt/DebtDetails";

export const DebtDetailsPage = () => {
  const { debtId } = useParams<{ debtId: string }>();
  const { debts } = useDebts();
  const debt = debts?.find(d => d.id === debtId) as Debt;

  const [monthlyPayment, setMonthlyPayment] = useState(debt.minimum_payment);
  const [selectedStrategy, setSelectedStrategy] = useState('avalanche');

  if (!debt) {
    return <div>Debt not found</div>;
  }

  const strategy = strategies.find(s => s.id === selectedStrategy) || strategies[0];
  const payoffDetails = calculateSingleDebtPayoff(debt, monthlyPayment, strategy);

  return (
    <MainLayout>
      <DebtDetails 
        debt={debt} 
        payoffDetails={payoffDetails} 
        onMonthlyPaymentChange={setMonthlyPayment} 
        onStrategyChange={setSelectedStrategy} 
      />
    </MainLayout>
  );
};
