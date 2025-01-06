import { PaymentHistory, OneTimeFunding } from "@/lib/types";

export interface StreakMetrics {
  streak: number;
  totalSaved: number;
  monthsSaved: number;
  interestSaved: number;
}

export const calculateStreakMetrics = (
  paymentHistory: PaymentHistory[] | null,
  oneTimeFunding: OneTimeFunding[] | null,
  extraPayment: number,
  debtsFullyPaid: boolean
): StreakMetrics => {
  console.log('Calculating streak metrics:', {
    paymentHistory: paymentHistory?.length,
    oneTimeFunding: oneTimeFunding?.length,
    extraPayment,
    debtsFullyPaid
  });

  // If all debts are paid off, return special metrics
  if (debtsFullyPaid) {
    return {
      streak: 0,
      totalSaved: paymentHistory?.reduce((sum, payment) => sum + Number(payment.total_payment), 0) || 0,
      monthsSaved: 0,
      interestSaved: 0
    };
  }

  // If no activity, return zero metrics
  if (!paymentHistory?.length && !oneTimeFunding?.length && extraPayment <= 0) {
    console.log('No payment activity detected - returning zero metrics');
    return {
      streak: 0,
      totalSaved: 0,
      monthsSaved: 0,
      interestSaved: 0
    };
  }

  // Calculate streak
  const now = new Date();
  const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
  let currentStreak = 0;

  // Sort payments by date descending
  const sortedPayments = [...(paymentHistory || [])].sort((a, b) => 
    new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
  );

  // Check recent payment activity
  const hasRecentPayment = sortedPayments.some(payment => {
    const paymentDate = new Date(payment.payment_date);
    return paymentDate >= lastMonth;
  });

  if (hasRecentPayment || extraPayment > 0) {
    // Calculate consecutive months with payments
    let currentMonth = new Date();
    for (let i = 0; i < sortedPayments.length; i++) {
      const paymentDate = new Date(sortedPayments[i].payment_date);
      const expectedMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i);

      if (paymentDate.getMonth() === expectedMonth.getMonth() &&
          paymentDate.getFullYear() === expectedMonth.getFullYear()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Add current month to streak if there's an active extra payment
    if (extraPayment > 0) {
      currentStreak++;
    }
  }

  // Calculate savings
  const totalExtraPayments = sortedPayments.reduce((sum, payment) => sum + Number(payment.total_payment), 0);
  const totalOneTimeFunding = oneTimeFunding?.reduce((sum, funding) => sum + Number(funding.amount), 0) || 0;
  const totalSaved = totalExtraPayments + totalOneTimeFunding;

  // Calculate months and interest saved
  const monthsSaved = Math.max(1, Math.floor(totalSaved / (extraPayment || 1)));
  const interestSaved = totalSaved * 0.15; // 15% estimated interest saved

  console.log('Calculated streak metrics:', {
    streak: currentStreak,
    totalSaved,
    monthsSaved,
    interestSaved
  });

  return {
    streak: currentStreak,
    totalSaved,
    monthsSaved,
    interestSaved
  };
};