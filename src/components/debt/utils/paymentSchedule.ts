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

    if (isHighPriorityDebt) {
      // For high priority debt, allocate maximum available payment
      if (remainingBalance + monthlyInterest <= monthlyAllocation) {
        paymentAmount = remainingBalance + monthlyInterest;
      } else {
        paymentAmount = monthlyAllocation;
      }
    } else {
      // For lower priority debt, use minimum payment
      paymentAmount = Math.max(
        debt.minimum_payment,
        Math.min(remainingBalance + monthlyInterest, monthlyAllocation)
      );
    }

    // Ensure we don't overpay
    paymentAmount = Math.min(paymentAmount, remainingBalance + monthlyInterest);
    remainingBalance = Math.max(0, remainingBalance + monthlyInterest - paymentAmount);
    
    console.log(`Payment details for ${debt.name} month ${month + 1}:`, {
      date: currentDate.toISOString(),
      payment: paymentAmount.toFixed(2),
      interest: monthlyInterest.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2)
    });

    schedule.push({
      date: new Date(currentDate),
      amount: paymentAmount,
      isLastPayment: remainingBalance <= 0.01,
      remainingBalance
    });

    if (remainingBalance <= 0.01) {
      console.log(`${debt.name} fully paid off in month ${month + 1}`);
      break;
    }

    currentDate = addMonths(currentDate, 1);
  }

  return schedule;
};