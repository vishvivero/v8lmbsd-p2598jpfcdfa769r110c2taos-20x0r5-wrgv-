import { calculatePayoffDetails } from "@/lib/utils/paymentCalculations";
import { Debt } from "@/lib/types";
import { strategies } from "@/lib/strategies";
import { useProfile } from "@/hooks/use-profile";

interface PayoffCalculatorProps {
  debts: Debt[];
  monthlyPayment: number;
  projectedPayoffDate?: Date;
}

export const usePayoffCalculator = ({ 
  debts, 
  monthlyPayment, 
  projectedPayoffDate 
}: PayoffCalculatorProps) => {
  const { profile } = useProfile();

  const calculateProjectedPayoffDate = () => {
    if (!debts.length || !monthlyPayment) return projectedPayoffDate;

    const selectedStrategyId = profile?.selected_strategy || 'avalanche';
    const selectedStrategy = strategies.find(s => s.id === selectedStrategyId);
    
    if (!selectedStrategy) {
      console.error('Strategy not found:', selectedStrategyId);
      return projectedPayoffDate;
    }

    console.log('Calculating payoff with strategy:', selectedStrategy.name);

    const payoffDetails = calculatePayoffDetails(debts, monthlyPayment, selectedStrategy);
    
    let maxMonths = 0;
    Object.values(payoffDetails).forEach(detail => {
      if (detail.months > maxMonths) {
        maxMonths = detail.months;
      }
    });

    console.log('Projected payoff months:', maxMonths);

    const date = new Date();
    date.setMonth(date.getMonth() + maxMonths);
    return date;
  };

  const getYearsAndMonths = (date: Date) => {
    if (!date) return { years: 0, months: 0 };
    
    const now = new Date();
    const diffInMonths = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    
    return {
      years: Math.max(0, years),
      months: Math.max(0, months)
    };
  };

  const actualProjectedDate = calculateProjectedPayoffDate() || projectedPayoffDate;
  const timeToPayoff = getYearsAndMonths(actualProjectedDate);

  return {
    projectedDate: actualProjectedDate,
    years: timeToPayoff.years,
    months: timeToPayoff.months
  };
};