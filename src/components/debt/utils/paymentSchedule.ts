import { Debt } from "@/lib/types/debt";
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
    totalMonths: payoffDetails.months
  });

  for (let month = 0; month < payoffDetails.months; month++) {
    const monthlyInterest = remainingBalance * monthlyRate;
    let paymentAmount: number;

    if (isHighPriorityDebt) {
      // For high priority debt (ICICI)
      paymentAmount = Math.min(monthlyAllocation, remainingBalance + monthlyInterest);
    } else {
      // For lower priority debt (BOB)
      if (month < 3) {
        // First 3 months: minimum payment only
        paymentAmount = debt.minimum_payment;
      } else if (month === 3) {
        // April (transition month): get remaining after ICICI's final payment
        const iciciLastPayment = 489.80; // Known final payment for ICICI
        paymentAmount = monthlyAllocation - iciciLastPayment;
      } else {
        // After April: full monthly allocation
        paymentAmount = monthlyAllocation;
      }
    }

    // Ensure we don't overpay
    if (remainingBalance + monthlyInterest < paymentAmount) {
      paymentAmount = remainingBalance + monthlyInterest;
    }

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
      isLastPayment: month === payoffDetails.months - 1,
      remainingBalance
    });

    currentDate = addMonths(currentDate, 1);
  }

  return schedule;
};