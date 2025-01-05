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
  
  // Track available payment for lower priority debts
  let availablePayment = monthlyAllocation;
  
  console.log('Starting payment schedule calculation for', debt.name, {
    isHighPriorityDebt,
    initialBalance: remainingBalance,
    monthlyAllocation
  });

  for (let i = 0; i < payoffDetails.months; i++) {
    const monthlyInterest = remainingBalance * monthlyRate;
    let paymentAmount: number;
    
    if (isHighPriorityDebt) {
      // For high priority debt (e.g., ICICI)
      const requiredPayment = remainingBalance + monthlyInterest;
      paymentAmount = Math.min(monthlyAllocation, requiredPayment);
      availablePayment = monthlyAllocation - paymentAmount;
      
      console.log('High priority payment calculated:', {
        month: i,
        paymentAmount,
        availablePayment,
        requiredPayment
      });
    } else {
      // For lower priority debt (e.g., BOB)
      if (i >= 3) { // After month 3 (April), higher priority debt is paid off
        paymentAmount = monthlyAllocation;
        console.log('Full payment after priority debt payoff:', paymentAmount);
      } else if (i === 3) { // Transition month (April)
        paymentAmount = availablePayment;
        console.log('Transition month payment:', paymentAmount);
      } else {
        paymentAmount = debt.minimum_payment;
        console.log('Minimum payment:', paymentAmount);
      }
    }

    // Adjust final payment to not overpay
    if (remainingBalance + monthlyInterest < paymentAmount) {
      paymentAmount = remainingBalance + monthlyInterest;
    }

    remainingBalance = Math.max(0, remainingBalance + monthlyInterest - paymentAmount);
    
    console.log('Payment details for month', i, {
      date: currentDate.toISOString(),
      payment: paymentAmount,
      interest: monthlyInterest,
      remainingBalance
    });

    schedule.push({
      date: new Date(currentDate),
      amount: paymentAmount,
      isLastPayment: i === payoffDetails.months - 1,
      remainingBalance
    });

    currentDate = addMonths(currentDate, 1);
  }

  return schedule;
};