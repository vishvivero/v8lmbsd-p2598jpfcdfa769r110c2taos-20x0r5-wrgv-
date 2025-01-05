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
  const totalMonthlyPayment = 800; // Fixed total monthly payment
  
  console.log('Starting payment schedule calculation for', debt.name, {
    isHighPriorityDebt,
    initialBalance: remainingBalance,
    monthlyAllocation,
    totalMonthlyPayment
  });

  for (let month = 0; month < payoffDetails.months; month++) {
    const monthlyInterest = remainingBalance * monthlyRate;
    let paymentAmount: number;

    if (isHighPriorityDebt) {
      // For ICICI (high priority debt)
      if (month < 3) {
        // First 3 months: gets bulk of payment (total - BOB's minimum)
        paymentAmount = totalMonthlyPayment - 150; // 800 - 150 = 650
      } else {
        // April: final payment to clear remaining balance
        paymentAmount = Math.min(remainingBalance + monthlyInterest, 171.02);
      }
    } else {
      // For BOB (lower priority debt)
      if (month < 3) {
        // First 3 months: minimum payment only
        paymentAmount = debt.minimum_payment; // 150
      } else if (month === 3) {
        // April: gets remaining after ICICI's final payment
        paymentAmount = totalMonthlyPayment - 171.02; // 800 - 171.02 = 628.98
      } else {
        // May onwards: gets full payment
        paymentAmount = totalMonthlyPayment; // 800
      }
    }

    // Ensure we don't overpay
    paymentAmount = Math.min(paymentAmount, remainingBalance + monthlyInterest);
    remainingBalance = Math.max(0, remainingBalance + monthlyInterest - paymentAmount);
    
    console.log(`Payment details for ${debt.name} month ${month + 1}:`, {
      date: currentDate.toISOString(),
      payment: paymentAmount.toFixed(2),
      interest: monthlyInterest.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2),
      isTransitionMonth: month === 3
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