import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { calculateDebtPayoff } from "@/lib/utils/payment/calculations/debtCalculator";
import { strategies } from "@/lib/strategies";

export const formatMonthYear = (monthsFromNow: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

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
) => {
  console.log('Generating chart data with:', {
    numberOfDebts: debts.length,
    monthlyPayment,
    oneTimeFundings: oneTimeFundings.map(f => ({
      date: f.payment_date,
      amount: f.amount
    }))
  });

  const { results, monthlyAllocations } = calculateDebtPayoff(
    debts,
    monthlyPayment,
    strategies.find(s => s.id === 'snowball') || strategies[0],
    oneTimeFundings
  );

  // Find the maximum months to payoff
  const maxMonths = Math.max(...Object.values(results).map(detail => detail.months));
  console.log('Maximum months to payoff:', maxMonths);

  const data = [];
  const balances = new Map(debts.map(debt => [debt.id, debt.balance]));

  // Generate monthly data points
  for (let month = 0; month <= maxMonths; month++) {
    const point: any = { 
      month,
      monthLabel: formatMonthYear(month)
    };

    let totalBalance = 0;

    // Calculate balances for each debt at this month
    for (const debt of debts) {
      const currentBalance = balances.get(debt.id) || 0;
      point[debt.name] = currentBalance;
      totalBalance += currentBalance;

      // Apply monthly allocations
      if (month < monthlyAllocations.length) {
        const allocations = monthlyAllocations[month];
        const debtAllocations = allocations.filter(a => a.debtId === debt.id);
        const totalAllocation = debtAllocations.reduce((sum, a) => sum + a.amount, 0);
        const newBalance = Math.max(0, currentBalance - totalAllocation);
        balances.set(debt.id, newBalance);
      }
    }

    point.Total = totalBalance;
    
    // Add extra payment data if present
    const extraPayment = oneTimeFundings.find(f => {
      const fundingDate = new Date(f.payment_date);
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + month);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });
    
    if (extraPayment) {
      point.oneTimeFunding = extraPayment.amount;
    }
    
    data.push(point);
  }

  console.log('Chart data generated:', {
    totalPoints: data.length,
    monthsToPayoff: maxMonths,
    finalBalance: data[data.length - 1].Total,
    payoffDate: new Date(Date.now() + maxMonths * 30 * 24 * 60 * 60 * 1000)
  });

  return data;
};