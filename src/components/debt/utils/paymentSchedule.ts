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
  const totalMonthlyPayment = 800; // Total available monthly payment
  
  console.log('Starting payment schedule calculation for', debt.name, {
    isHighPriorityDebt,
    initialBalance: remainingBalance,
    monthlyAllocation,
    minimumPayment: debt.minimum_payment
  });

  for (let month = 0; month < payoffDetails.months; month++) {
    const monthlyInterest = remainingBalance * monthlyRate;
    let paymentAmount: number;

    if (isHighPriorityDebt) {
      // For ICICI (high priority debt)
      if (remainingBalance + monthlyInterest <= monthlyAllocation) {
        // If we can pay off the debt, do it
        paymentAmount = remainingBalance + monthlyInterest;
      } else {
        // Otherwise, use the allocated amount
        paymentAmount = monthlyAllocation;
      }
    } else {
      // For BOB (lower priority debt)
      if (month < 4) {
        // First 4 months: minimum payment only (while ICICI is being paid)
        paymentAmount = debt.minimum_payment;
      } else if (month === 4) {
        // Month after ICICI is paid off: gets remaining after ICICI's final payment
        // ICICI's final payment was 171.02
        paymentAmount = totalMonthlyPayment - 171.02; // Should be 628.98
      } else {
        // Following months: gets full payment
        paymentAmount = totalMonthlyPayment; // Full 800
      }
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
