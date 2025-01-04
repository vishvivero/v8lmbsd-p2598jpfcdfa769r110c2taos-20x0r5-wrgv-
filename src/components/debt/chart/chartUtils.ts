import { Debt } from "@/lib/types";
import { calculateMonthlyAllocation } from "@/lib/paymentCalculator";

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

export const generateChartData = (debts: Debt[], monthlyPayment: number) => {
  const data = [];
  let currentDebts = [...debts];
  let currentBalances = Object.fromEntries(
    debts.map(debt => [debt.id, debt.balance])
  );
  let allPaidOff = false;
  let month = 0;

  while (!allPaidOff && month < 1200) {
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

    const allocation = monthlyPayment > 0 
      ? calculateMonthlyAllocation(currentDebts, monthlyPayment)
      : Object.fromEntries(currentDebts.map(d => [d.id, 0]));

    currentDebts = currentDebts.filter(debt => {
      const payment = allocation[debt.id] || 0;
      const monthlyInterest = (debt.interest_rate / 1200) * currentBalances[debt.id];
      currentBalances[debt.id] = Math.max(0, 
        currentBalances[debt.id] + monthlyInterest - payment
      );

      point[debt.name] = currentBalances[debt.id];
      totalBalance += currentBalances[debt.id];

      return currentBalances[debt.id] > 0.01;
    });

    point.total = totalBalance;
    
    if (month === 0 || currentDebts.length === 0 || 
        month % Math.max(1, Math.floor(data.length / 10)) === 0) {
      data.push(point);
    }

    allPaidOff = currentDebts.length === 0;
    month++;
  }

  return data;
};