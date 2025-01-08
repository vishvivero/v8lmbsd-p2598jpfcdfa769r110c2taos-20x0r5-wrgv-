import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

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

  const data = [];
  let currentDebts = [...debts];
  let currentBalances = Object.fromEntries(
    debts.map(debt => [debt.id, debt.balance])
  );
  let allPaidOff = false;
  let month = 0;
  const startDate = new Date();
  const maxMonths = 1200; // Safety limit to prevent infinite loops

  while (!allPaidOff && month < maxMonths) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + month);
    
    const point: any = { 
      month,
      monthLabel: formatMonthYear(month)
    };
    
    let totalBalance = 0;

    if (currentDebts.length === 0) {
      point.total = 0;
      data.push(point);
      break;
    }

    // Calculate extra payment from one-time fundings for this month
    const extraPayment = oneTimeFundings
      .filter(funding => {
        const fundingDate = new Date(funding.payment_date);
        return fundingDate.getMonth() === currentDate.getMonth() &&
               fundingDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, funding) => sum + funding.amount, 0);

    if (extraPayment > 0) {
      console.log(`Month ${month}: Processing one-time funding of ${extraPayment}`);
      let remainingExtraPayment = extraPayment;

      // Apply one-time funding with rollover in the same month
      for (let i = 0; i < currentDebts.length && remainingExtraPayment > 0; i++) {
        const debt = currentDebts[i];
        const currentBalance = currentBalances[debt.id];
        const monthlyInterest = (debt.interest_rate / 1200) * currentBalance;
        const totalRequired = currentBalance + monthlyInterest;
        
        const payment = Math.min(remainingExtraPayment, totalRequired);
        currentBalances[debt.id] = Math.max(0, currentBalance + monthlyInterest - payment);
        remainingExtraPayment -= payment;
      }
    }

    // Handle regular monthly payments
    let monthlyAvailable = monthlyPayment;
    currentDebts = currentDebts.filter(debt => {
      const currentBalance = currentBalances[debt.id];
      const monthlyInterest = (debt.interest_rate / 1200) * currentBalance;
      const payment = Math.min(
        currentBalance + monthlyInterest,
        debt.minimum_payment + (currentDebts[0].id === debt.id ? monthlyAvailable - debt.minimum_payment : 0)
      );

      currentBalances[debt.id] = Math.max(0, 
        currentBalance + monthlyInterest - payment
      );

      point[debt.name] = currentBalances[debt.id];
      totalBalance += currentBalances[debt.id];
      monthlyAvailable -= Math.min(payment, debt.minimum_payment);

      return currentBalances[debt.id] > 0.01;
    });

    point.total = totalBalance;
    point.oneTimeFunding = extraPayment > 0 ? extraPayment : undefined;
    
    // Ensure we capture all significant data points
    const isSignificantPoint = 
      month === 0 || // First month
      currentDebts.length === 0 || // Last month
      month % 3 === 0 || // Every quarter
      extraPayment > 0 || // Months with extra payments
      month === data.length; // Any month where debt status changes

    if (isSignificantPoint) {
      data.push(point);
    }

    allPaidOff = currentDebts.length === 0;
    month++;

    // Log progress for debugging
    if (month % 12 === 0) {
      console.log(`Year ${Math.floor(month / 12)} progress:`, {
        remainingDebts: currentDebts.length,
        totalBalance,
        projectedPayoffDate: formatMonthYear(month)
      });
    }
  }

  console.log('Chart data generated:', {
    totalPoints: data.length,
    monthsToPayoff: month,
    finalBalance: data[data.length - 1].total,
    payoffDate: formatMonthYear(month - 1)
  });

  return data;
};