import { Debt } from "@/lib/types";
import { calculateMonthlyAllocations } from "./paymentCalculator";
import { Strategy } from "../types";

export const generateChartData = (
  debts: Debt[], 
  monthlyPayment: number,
  strategy: Strategy
) => {
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

    const { allocations } = monthlyPayment > 0 
      ? calculateMonthlyAllocations(currentDebts, monthlyPayment, strategy)
      : { allocations: new Map(currentDebts.map(d => [d.id, 0])) };

    currentDebts = currentDebts.filter(debt => {
      const payment = allocations.get(debt.id) || 0;
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

export const formatMonthYear = (monthsFromNow: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};