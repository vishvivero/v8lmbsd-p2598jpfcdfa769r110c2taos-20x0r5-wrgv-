import { Debt } from "@/lib/types";
import { addMonths, format } from "date-fns";
import { calculateMonthlyInterest } from "../interestCalculations";

export const calculatePayoffTimeline = (debt: Debt, extraPayment: number = 0): { date: string; balance: number }[] => {
  console.log('Calculating payoff timeline for debt:', {
    debtName: debt.name,
    startingBalance: debt.balance,
    extraPayment,
    minimumPayment: debt.minimum_payment
  });

  const timeline: { date: string; balance: number }[] = [];
  let currentBalance = debt.balance;
  const startDate = new Date();
  let currentDate = startDate;
  
  // Continue until debt is paid off or max iterations reached
  for (let month = 0; month < 360 && currentBalance > 0; month++) {
    const monthlyInterest = calculateMonthlyInterest(currentBalance, debt.interest_rate);
    const totalPayment = debt.minimum_payment + extraPayment;
    
    currentBalance = Math.max(0, currentBalance + monthlyInterest - totalPayment);
    currentDate = addMonths(startDate, month);
    
    timeline.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      balance: Number(currentBalance.toFixed(2))
    });

    if (currentBalance === 0) break;
  }

  console.log('Payoff timeline calculated:', {
    totalMonths: timeline.length,
    finalBalance: timeline[timeline.length - 1].balance
  });

  return timeline;
};