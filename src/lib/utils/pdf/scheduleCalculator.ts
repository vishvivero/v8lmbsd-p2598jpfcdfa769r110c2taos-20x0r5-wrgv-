import { Debt } from "@/lib/types";
import { RedistributionEntry } from "../payment/types";
import { formatCurrency, formatDate } from "./formatters";
import { addMonths } from "date-fns";

export const generateMonthlySchedule = (
  debt: Debt,
  payoffDetails: { 
    months: number;
    redistributionHistory?: RedistributionEntry[];
  },
  monthlyAllocation: number,
  isHighPriorityDebt: boolean
): string[][] => {
  console.log('Starting payment calculation for', debt.name, {
    initialBalance: debt.balance,
    monthlyAllocation,
    isHighPriorityDebt,
    minimumPayment: debt.minimum_payment,
    redistributionHistory: payoffDetails.redistributionHistory
  });

  const schedule: string[][] = [];
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date) 
    : new Date();
  
  let remainingBalance = Number(debt.balance);
  const monthlyRate = Number(debt.interest_rate) / 1200;
  const redistributions = payoffDetails.redistributionHistory || [];
  
  for (let month = 0; month < payoffDetails.months && remainingBalance > 0.01; month++) {
    // Calculate this month's interest
    const monthlyInterest = Number((remainingBalance * monthlyRate).toFixed(2));
    
    // Get any redistributions for this month
    const monthRedistributions = redistributions.filter(r => r.month === month + 1);
    const redistributedAmount = monthRedistributions.reduce((sum, r) => sum + r.amount, 0);
    
    // Calculate total payment including redistribution
    let paymentAmount = monthlyAllocation + redistributedAmount;

    // Ensure we don't overpay
    const totalRequired = remainingBalance + monthlyInterest;
    if (paymentAmount > totalRequired) {
      paymentAmount = Number(totalRequired.toFixed(2));
    }

    // Calculate principal portion of payment
    const principalPaid = Number((paymentAmount - monthlyInterest).toFixed(2));
    
    // Update remaining balance
    remainingBalance = Number((remainingBalance - principalPaid).toFixed(2));
    
    const isLastPayment = remainingBalance <= 0.01;
    if (isLastPayment) {
      remainingBalance = 0;
    }

    console.log(`Month ${month + 1} payment for ${debt.name}:`, {
      date: currentDate.toISOString(),
      startingBalance: (remainingBalance + principalPaid).toFixed(2),
      monthlyInterest: monthlyInterest.toFixed(2),
      payment: paymentAmount.toFixed(2),
      principalPaid: principalPaid.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2),
      monthRedistribution: redistributedAmount,
      isLastPayment
    });

    schedule.push([
      formatDate(currentDate),
      formatCurrency(paymentAmount),
      formatCurrency(principalPaid),
      formatCurrency(monthlyInterest),
      formatCurrency(remainingBalance),
      formatCurrency(redistributedAmount),
      monthRedistributions.length > 0 ? 'Yes' : 'No'
    ]);

    if (isLastPayment) break;
    currentDate = addMonths(currentDate, 1);
  }

  return schedule;
};