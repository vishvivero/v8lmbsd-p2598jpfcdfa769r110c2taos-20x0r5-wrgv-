import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { addMonths } from "date-fns";

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
  let minimumPayments = Object.fromEntries(
    debts.map(debt => [debt.id, debt.minimum_payment])
  );
  
  let allPaidOff = false;
  let month = 0;
  const startDate = new Date();
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const extraMonthlyPayment = Math.max(0, monthlyPayment - totalMinimumPayments);

  console.log('Payment breakdown:', {
    totalMonthlyPayment: monthlyPayment,
    totalMinimumPayments,
    extraMonthlyPayment
  });

  while (!allPaidOff && month < 1200) {
    const currentDate = addMonths(startDate, month);
    const point: any = { 
      month,
      monthLabel: formatMonthYear(month)
    };
    
    // Calculate available payment amount
    let availablePayment = monthlyPayment;
    
    // Add one-time fundings for this month
    const monthlyFundings = oneTimeFundings.filter(funding => {
      const fundingDate = new Date(funding.payment_date);
      return fundingDate.getMonth() === currentDate.getMonth() &&
             fundingDate.getFullYear() === currentDate.getFullYear();
    });

    const oneTimeFundingAmount = monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);
    availablePayment += oneTimeFundingAmount;

    if (oneTimeFundingAmount > 0) {
      console.log(`Month ${month}: Processing one-time funding:`, {
        amount: oneTimeFundingAmount,
        totalAvailable: availablePayment
      });
    }

    // Process payments for each debt
    let remainingPayment = availablePayment;
    let totalBalance = 0;

    // First handle minimum payments
    currentDebts.forEach(debt => {
      const currentBalance = currentBalances[debt.id];
      const minPayment = Math.min(minimumPayments[debt.id], currentBalance);
      
      if (remainingPayment >= minPayment) {
        const monthlyInterest = (debt.interest_rate / 1200) * currentBalance;
        const newBalance = Math.max(0, currentBalance + monthlyInterest - minPayment);
        currentBalances[debt.id] = newBalance;
        remainingPayment -= minPayment;
        
        point[debt.name] = newBalance;
        totalBalance += newBalance;
      }
    });

    // Then apply extra payments according to priority
    if (remainingPayment > 0) {
      for (const debt of currentDebts) {
        const currentBalance = currentBalances[debt.id];
        if (currentBalance <= 0) continue;

        const monthlyInterest = (debt.interest_rate / 1200) * currentBalance;
        const totalRequired = currentBalance + monthlyInterest;
        const payment = Math.min(remainingPayment, totalRequired);
        
        currentBalances[debt.id] = Math.max(0, currentBalance + monthlyInterest - payment);
        remainingPayment -= payment;
        
        point[debt.name] = currentBalances[debt.id];
        
        if (remainingPayment <= 0) break;
      }
    }

    // Update total balance
    point.total = Object.values(currentBalances).reduce((sum: any, balance: any) => sum + balance, 0);
    
    // Add one-time funding marker if applicable
    if (oneTimeFundingAmount > 0) {
      point.oneTimeFunding = oneTimeFundingAmount;
    }

    // Clean up paid off debts and redistribute minimum payments
    currentDebts = currentDebts.filter(debt => {
      if (currentBalances[debt.id] <= 0.01) {
        const releasedPayment = minimumPayments[debt.id];
        delete minimumPayments[debt.id];
        
        // Add released payment to next month's available amount
        const nextDebt = currentDebts.find(d => currentBalances[d.id] > 0.01 && d.id !== debt.id);
        if (nextDebt) {
          console.log(`Debt ${debt.name} paid off, redistributing ${releasedPayment} to ${nextDebt.name}`);
        }
        return false;
      }
      return true;
    });

    data.push(point);
    allPaidOff = currentDebts.length === 0;
    month++;
  }

  console.log('Chart data generated:', {
    totalPoints: data.length,
    monthsToPayoff: month,
    finalBalance: data[data.length - 1].total
  });

  return data;
};