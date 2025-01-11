import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { ChartData } from "./types";
import { addMonths, format } from "date-fns";

export const formatCurrency = (value: number, currencySymbol: string) => {
  if (value >= 1000000) {
    return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${currencySymbol}${(value / 1000).toFixed(1)}k`;
  }
  return `${currencySymbol}${value.toFixed(0)}`;
};

export const generateChartData = (
  debts: Debt[],
  monthlyPayment: number,
  oneTimeFundings: OneTimeFunding[] = []
): ChartData[] => {
  console.log('Generating chart data with:', {
    numberOfDebts: debts.length,
    monthlyPayment,
    oneTimeFundings: oneTimeFundings.map(f => ({
      date: f.payment_date,
      amount: f.amount
    }))
  });

  const data: ChartData[] = [];
  const balances = new Map<string, number>();
  const startDate = new Date();
  let maxMonths = 360; // 30 years cap

  // Initialize balances
  debts.forEach(debt => {
    balances.set(debt.name, debt.balance);
  });

  for (let month = 0; month <= maxMonths; month++) {
    const currentDate = addMonths(startDate, month);
    const point: ChartData = {
      date: currentDate.toISOString(),
      monthLabel: format(currentDate, 'MMM yyyy'),
      month: month,
      Total: 0
    };

    let totalBalance = 0;

    // Calculate balances for each debt
    debts.forEach(debt => {
      const currentBalance = balances.get(debt.name) || 0;
      if (currentBalance > 0) {
        const monthlyInterest = (currentBalance * debt.interest_rate) / 1200;
        const newBalance = Math.max(0, currentBalance + monthlyInterest - 
          (debt.minimum_payment + (monthlyPayment - debts.reduce((sum, d) => sum + d.minimum_payment, 0)) / debts.length));
        balances.set(debt.name, newBalance);
        point[debt.name] = newBalance;
        totalBalance += newBalance;
      } else {
        point[debt.name] = 0;
      }
    });

    point.Total = totalBalance;

    // Apply one-time funding if available for this month
    const monthlyFundings = oneTimeFundings.filter(f => {
      const fundingDate = new Date(f.payment_date);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });

    if (monthlyFundings.length > 0) {
      const totalFunding = monthlyFundings.reduce((sum, f) => sum + Number(f.amount), 0);
      point.oneTimeFunding = totalFunding;
    }

    data.push(point);

    if (totalBalance <= 0) break;
  }

  console.log('Chart data generated:', {
    totalPoints: data.length,
    monthsToPayoff: data.length - 1,
    finalBalance: data[data.length - 1].Total
  });

  return data;
};

export const generateBaselineChartData = (data: ChartData[]): ChartData[] => {
  // Create a copy of the initial data point
  const baselineData: ChartData[] = [];
  const initialPoint = { ...data[0] };
  
  // Remove any one-time funding data
  delete initialPoint.oneTimeFunding;
  
  // Calculate baseline payoff trajectory for each debt
  const debtNames = Object.keys(initialPoint).filter(key => 
    key !== 'date' && key !== 'Total' && key !== 'monthLabel' && key !== 'month'
  );
  
  data.forEach((point, index) => {
    const baselinePoint: ChartData = {
      date: point.date,
      monthLabel: point.monthLabel,
      month: point.month,
      Total: 0
    };
    
    debtNames.forEach(debtName => {
      if (index === 0) {
        baselinePoint[debtName] = Number(initialPoint[debtName]) || 0;
      } else {
        const previousBalance = Number(baselineData[index - 1][debtName]) || 0;
        // Simple linear reduction without extra payments
        baselinePoint[debtName] = Math.max(0, previousBalance * 0.99); // Simplified for demonstration
      }
      baselinePoint.Total += Number(baselinePoint[debtName]) || 0;
    });
    
    baselineData.push(baselinePoint);
  });
  
  return baselineData;
};