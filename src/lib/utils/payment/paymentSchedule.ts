import { Debt } from "@/lib/types";
import { Payment } from "@/lib/types/payment";
import { addMonths } from "date-fns";

export const calculatePaymentSchedule = (
  debt: Debt,
  payoffDetails: { 
    months: number;
    redistributionHistory?: {
      fromDebtId: string;
      amount: number;
      month: number;
    }[];
  },
  monthlyAllocation: number,
  isHighPriorityDebt: boolean
): Payment[] => {
  console.log('Starting payment calculation for', debt.name, {
    initialBalance: debt.balance,
    monthlyAllocation,
    isHighPriorityDebt,
    minimumPayment: debt.minimum_payment,
    redistributionHistory: payoffDetails.redistributionHistory
  });

  const schedule: Payment[] = [];
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date) 
    : new Date();
  
  let remainingBalance = Number(debt.balance);
  const monthlyRate = Number(debt.interest_rate) / 1200; // Convert annual rate to monthly decimal
  const redistributions = payoffDetails.redistributionHistory || [];
  
  for (let month = 0; month < payoffDetails.months && remainingBalance > 0.01; month++) {
    // Calculate this month's interest
    const monthlyInterest = Number((remainingBalance * monthlyRate).toFixed(2));
    
    // Get any redistributions for this month
    const monthRedistributions = redistributions.filter(r => r.month === month + 1);
    const redistributedAmount = monthRedistributions.reduce((sum, r) => sum + r.amount, 0);
    
    // Calculate base payment (without redistribution)
    let basePayment = monthlyAllocation;
    
    // Add redistribution amount if applicable
    const totalPayment = basePayment + redistributedAmount;

    // Ensure we don't overpay
    const totalRequired = remainingBalance + monthlyInterest;
    const actualPayment = Math.min(totalPayment, totalRequired);

    // Calculate principal portion of payment
    const principalPaid = Number((actualPayment - monthlyInterest).toFixed(2));
    
    // Update remaining balance
    remainingBalance = Number((remainingBalance - principalPaid).toFixed(2));
    
    const isLastPayment = remainingBalance <= 0.01;
    if (isLastPayment) {
      remainingBalance = 0;
    }

    console.log(`Month ${month + 1} calculation for ${debt.name}:`, {
      startingBalance: (remainingBalance + principalPaid).toFixed(2),
      monthlyInterest: monthlyInterest.toFixed(2),
      basePayment: basePayment.toFixed(2),
      redistributedAmount,
      actualPayment: actualPayment.toFixed(2),
      principalPaid: principalPaid.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2),
      isLastPayment
    });

    schedule.push({
      date: new Date(currentDate),
      amount: actualPayment,
      redistributedAmount,
      isLastPayment,
      remainingBalance,
      interestPaid: monthlyInterest,
      principalPaid
    });

    if (isLastPayment) break;
    currentDate = addMonths(currentDate, 1);
  }

  return schedule;
};