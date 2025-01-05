import { Debt } from "@/lib/types";
import { Payment } from "@/lib/types/payment";
import { addMonths } from "date-fns";

export const calculatePaymentSchedule = (
  debt: Debt,
  payoffDetails: { months: number },
  monthlyAllocation: number,
  isHighPriorityDebt: boolean
): Payment[] => {
  console.log('Starting payment calculation for', debt.name, {
    initialBalance: debt.balance,
    monthlyAllocation,
    isHighPriorityDebt,
    minimumPayment: debt.minimum_payment
  });

  const schedule: Payment[] = [];
  let currentDate = debt.next_payment_date 
    ? new Date(debt.next_payment_date) 
    : new Date();
  
  let remainingBalance = Number(debt.balance);
  const monthlyRate = Number(debt.interest_rate) / 1200; // Convert annual rate to monthly decimal
  
  // Track if ICICI's payment should be redistributed (after March 2025)
  const iciciRedistributionDate = new Date('2025-03-31');
  const iciciRedistributionAmount = 250;
  
  for (let month = 0; month < payoffDetails.months && remainingBalance > 0.01; month++) {
    const currentPaymentDate = new Date(currentDate);
    
    // Calculate this month's interest
    const monthlyInterest = Number((remainingBalance * monthlyRate).toFixed(2));
    
    // Determine payment amount based on strategy and debt priority
    let paymentAmount = monthlyAllocation;

    // Add ICICI's £250 to this debt's allocation if it's after March 2025
    // and this isn't a high priority debt (meaning it's not ICICI itself)
    if (!isHighPriorityDebt && currentPaymentDate > iciciRedistributionDate) {
      paymentAmount += iciciRedistributionAmount;
      console.log(`Adding redistributed ICICI payment to ${debt.name}:`, {
        basePayment: monthlyAllocation,
        iciciAmount: iciciRedistributionAmount,
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
      isFirstMonth: month === 0,
      monthlyAllocation: paymentAmount
    });

    schedule.push({
      date: currentPaymentDate,
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