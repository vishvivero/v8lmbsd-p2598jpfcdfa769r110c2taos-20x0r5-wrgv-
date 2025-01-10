import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { calculatePayoffDetails } from "@/lib/utils/payment/paymentCalculations";
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

  // Use the same calculation method as the payoff details
  const payoffDetails = calculatePayoffDetails(
    debts,
    monthlyPayment,
    strategies.find(s => s.id === 'snowball') || strategies[0],
    oneTimeFundings
  );

  // Find the maximum months to payoff
  const maxMonths = Math.max(...Object.values(payoffDetails).map(detail => detail.months));
  console.log('Maximum months to payoff:', maxMonths);

  const data = [];
  let currentBalances = Object.fromEntries(
    debts.map(debt => [debt.id, debt.balance])
  );

  // Generate monthly data points
  for (let month = 0; month <= maxMonths; month++) {
    const point: any = { 
      month,
      monthLabel: formatMonthYear(month)
    };

    let totalBalance = 0;
    
    // Calculate balances for each debt at this month
    debts.forEach(debt => {
      const monthlyRate = debt.interest_rate / 1200;
      const detail = payoffDetails[debt.id];
      
      // If debt is paid off before this month
      if (month >= detail.months) {
        point[debt.name] = 0;
        currentBalances[debt.id] = 0;
      } else {
        const monthlyInterest = currentBalances[debt.id] * monthlyRate;
        const payment = Math.min(
          currentBalances[debt.id] + monthlyInterest,
          debt.minimum_payment + (month === 0 ? monthlyPayment - debts.reduce((sum, d) => sum + d.minimum_payment, 0) : 0)
        );
        
        currentBalances[debt.id] = Math.max(0, 
          currentBalances[debt.id] + monthlyInterest - payment
        );
        point[debt.name] = currentBalances[debt.id];
      }
      
      totalBalance += currentBalances[debt.id];
    });

    point.total = totalBalance;
    
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
    finalBalance: data[data.length - 1].total,
    payoffDate: new Date(new Date().setMonth(new Date().getMonth() + maxMonths))
  });

  return data;
};