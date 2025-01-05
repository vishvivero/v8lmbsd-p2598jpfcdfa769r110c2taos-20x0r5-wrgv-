import { Debt } from "@/lib/types";
import { addMonths } from "date-fns";

interface Payment {
  date: Date;
  amount: number;
  isLastPayment: boolean;
  remainingBalance: number;
}

export const calculatePaymentSchedule = (
  debt: Debt,
  payoffDetails: { months: number },
  monthlyAllocation: number,
  isHighPriorityDebt: boolean
): Payment[] => {
  const schedule: Payment[] = [];
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date) 
    : new Date();

  let remainingBalance = debt.balance;
  const monthlyRate = debt.interest_rate / 1200;
  
  console.log('Starting payment schedule calculation for', debt.name, {
    isHighPriorityDebt,
    initialBalance: remainingBalance,
    monthlyAllocation,
    minimumPayment: debt.minimum_payment
  });

  for (let month = 0; month < payoffDetails.months && remainingBalance > 0.01; month++) {
    const monthlyInterest = remainingBalance * monthlyRate;
    let paymentAmount: number;

    // Calculate required payment to fully pay off the debt this month
    const requiredPayment = remainingBalance + monthlyInterest;

    if (isHighPriorityDebt) {
      // For high priority debt, use the monthly allocation
      paymentAmount = Math.min(monthlyAllocation, requiredPayment);
    } else {
      // For lower priority debt, use the minimum payment
      paymentAmount = Math.min(debt.minimum_payment, requiredPayment);
    }

    // Calculate new remaining balance
    remainingBalance = Math.max(0, remainingBalance + monthlyInterest - paymentAmount);
    
    const isLastPayment = remainingBalance <= 0.01;
    if (isLastPayment) {
      // Adjust final payment to exactly cover remaining balance plus interest
      paymentAmount = requiredPayment;
      remainingBalance = 0;
    }

    console.log(`Payment details for ${debt.name} month ${month + 1}:`, {
      date: currentDate.toISOString(),
      payment: paymentAmount.toFixed(2),
      interest: monthlyInterest.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2),
      isLastPayment
    });

    schedule.push({
      date: new Date(currentDate),
      amount: Number(paymentAmount.toFixed(2)),
      isLastPayment,
      remainingBalance: Number(remainingBalance.toFixed(2))
    });

    if (isLastPayment) {
      console.log(`${debt.name} fully paid off in month ${month + 1}`);
      break;
    }

    currentDate = addMonths(currentDate, 1);
  }

  return schedule;
};