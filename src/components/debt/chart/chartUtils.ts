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
  const balances = new Map(debts.map(debt => [debt.id, debt.balance]));
  const minimumPayments = new Map(debts.map(debt => [debt.id, debt.minimum_payment]));
  let availablePayment = monthlyPayment;

  // Generate monthly data points
  for (let month = 0; month <= maxMonths; month++) {
    const point: any = { 
      month,
      monthLabel: formatMonthYear(month)
    };

    let totalBalance = 0;
    const sortedDebts = [...debts].sort((a, b) => 
      (balances.get(a.id) || 0) - (balances.get(b.id) || 0)
    );
    
    // Calculate balances for each debt at this month
    for (const debt of sortedDebts) {
      const monthlyRate = debt.interest_rate / 1200;
      const currentBalance = balances.get(debt.id) || 0;
      
      if (currentBalance <= 0) {
        point[debt.name] = 0;
        balances.set(debt.id, 0);
        // Add minimum payment back to available payment
        availablePayment += minimumPayments.get(debt.id) || 0;
        continue;
      }

      const monthlyInterest = currentBalance * monthlyRate;
      let payment = Math.min(minimumPayments.get(debt.id) || 0, availablePayment);
      availablePayment -= payment;

      // If this is the smallest debt with remaining balance and we have extra payment
      if (debt.id === sortedDebts.find(d => (balances.get(d.id) || 0) > 0)?.id && availablePayment > 0) {
        const extraPayment = Math.min(availablePayment, currentBalance + monthlyInterest - payment);
        payment += extraPayment;
        availablePayment -= extraPayment;
      }

      const newBalance = Math.max(0, currentBalance + monthlyInterest - payment);
      balances.set(debt.id, newBalance);
      point[debt.name] = newBalance;
      totalBalance += newBalance;
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
    availablePayment = monthlyPayment; // Reset available payment for next month
  }

  console.log('Chart data generated:', {
    totalPoints: data.length,
    monthsToPayoff: maxMonths,
    finalBalance: data[data.length - 1].Total,
    payoffDate: new Date(new Date().setMonth(new Date().getMonth() + maxMonths))
  });

  return data;
};