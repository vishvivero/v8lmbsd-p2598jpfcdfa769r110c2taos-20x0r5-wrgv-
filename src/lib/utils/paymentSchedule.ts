import { Debt } from "@/lib/types";
import { Payment } from "@/lib/types/payment";
import { addMonths } from "date-fns";

export const calculatePaymentSchedule = (
  debt: Debt,
  payoffDetails: { months: number },
  monthlyAllocation: number,
  isHighPriorityDebt: boolean,
  releasedPayments: { [key: string]: number } = {}
): Payment[] => {
  console.log('Starting payment calculation for', debt.name, {
    initialBalance: debt.balance,
    monthlyAllocation,
    isHighPriorityDebt,
    minimumPayment: debt.minimum_payment,
    releasedPayments
  });

  const schedule: Payment[] = [];
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date) 
    : new Date();
  
  let remainingBalance = Number(debt.balance);
  const monthlyRate = Number(debt.interest_rate) / 1200;
  
  for (let month = 0; month < payoffDetails.months && remainingBalance > 0.01; month++) {
    // Calculate this month's interest
    const monthlyInterest = Number((remainingBalance * monthlyRate).toFixed(2));
    
    // Calculate total available payment including any redistributed amounts
    let paymentAmount = monthlyAllocation;
    const currentPaymentDate = new Date(currentDate);

    // Add redistributed payments if this debt is the highest priority
    if (isHighPriorityDebt) {
      const totalRedistributed = Object.values(releasedPayments).reduce((sum, amount) => sum + amount, 0);
      paymentAmount += totalRedistributed;

      console.log(`Month ${month + 1}: Adding redistributed payments to ${debt.name}:`, {
        basePayment: monthlyAllocation,
        redistributed: totalRedistributed,
        totalPayment: paymentAmount
      });
    }

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

    console.log(`Month ${month + 1} calculation for ${debt.name}:`, {
      date: currentPaymentDate.toISOString(),
      startingBalance: (remainingBalance + principalPaid).toFixed(2),
      monthlyInterest: monthlyInterest.toFixed(2),
      payment: paymentAmount.toFixed(2),
      principalPaid: principalPaid.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2),
      isLastPayment,
      isFirstMonth: month === 0
    });

    schedule.push({
      date: new Date(currentDate),
      amount: paymentAmount,
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