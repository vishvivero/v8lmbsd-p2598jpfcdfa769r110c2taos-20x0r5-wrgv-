import { Debt } from "@/lib/types";
import { motion } from "framer-motion";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { ChartContainer } from "./debt/chart/ChartContainer";
import { calculateChartDomain } from "./debt/chart/chartCalculations";
import { strategies } from "@/lib/strategies";
import { useProfile } from "@/hooks/use-profile";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { generateChartData } from "./debt/chart/chartUtils";

interface DebtChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol?: string;
  oneTimeFundings?: OneTimeFunding[];
}

export const DebtChart = ({ 
  debts, 
  monthlyPayment, 
  currencySymbol = '£',
  oneTimeFundings = []
}: DebtChartProps) => {
  const { profile } = useProfile();
  
  const selectedStrategy = strategies.find(s => s.id === profile?.selected_strategy) || strategies[0];

  console.log('Starting DebtChart calculation with:', {
    debts: debts.map(d => ({ name: d.name, balance: d.balance })),
    monthlyPayment,
    strategy: selectedStrategy.name,
    oneTimeFundings: oneTimeFundings.map(f => ({ 
      date: f.payment_date, 
      amount: f.amount 
    }))
  });

  const payoffDetails = unifiedDebtCalculationService.calculatePayoffDetails(
    debts,
    monthlyPayment,
    selectedStrategy,
    oneTimeFundings.map(f => ({
      amount: f.amount,
      payment_date: new Date(f.payment_date)
    }))
  );

  console.log('Payoff details calculated:', {
    details: Object.entries(payoffDetails).map(([id, detail]) => ({
      debtName: debts.find(d => d.id === id)?.name,
      months: detail.months,
      payoffDate: detail.payoffDate.toISOString(),
      totalInterest: detail.totalInterest
    }))
  });

  const chartData = generateChartData(debts, payoffDetails, monthlyPayment, selectedStrategy, oneTimeFundings);
  const { maxDebt } = calculateChartDomain(chartData);

  return (
    <ChartContainer 
      data={chartData}
      maxDebt={maxDebt}
      currencySymbol={currencySymbol}
      oneTimeFundings={oneTimeFundings}
    />
  );
};