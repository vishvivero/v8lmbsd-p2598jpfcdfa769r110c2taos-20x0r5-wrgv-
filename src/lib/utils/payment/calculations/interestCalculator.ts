export const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  const monthlyRate = annualRate / 1200;
  return Number((balance * monthlyRate).toFixed(2));
};

export const calculateTotalInterest = (
  balance: number,
  monthlyPayment: number,
  annualRate: number,
  existingInterest: number = 0
): number => {
  let totalInterest = existingInterest;
  let remainingBalance = balance;
  const monthlyRate = annualRate / 1200;

  while (remainingBalance > 0.01 && monthlyPayment > calculateMonthlyInterest(remainingBalance, annualRate)) {
    const monthlyInterest = calculateMonthlyInterest(remainingBalance, annualRate);
    totalInterest += monthlyInterest;
    
    // Calculate principal portion of payment
    const principalPayment = Math.min(
      monthlyPayment - monthlyInterest,
      remainingBalance
    );
    
    // Update remaining balance
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
  }

  return Number(totalInterest.toFixed(2));
};

export const calculateAmortizationSchedule = (
  initialBalance: number,
  annualRate: number,
  monthlyPayment: number,
  startDate: Date = new Date()
) => {
  const schedule = [];
  let balance = initialBalance;
  let currentDate = new Date(startDate);
  
  while (balance > 0.01) {
    const monthlyInterest = calculateMonthlyInterest(balance, annualRate);
    const principalPayment = Math.min(
      monthlyPayment - monthlyInterest,
      balance
    );
    
    balance = Math.max(0, balance - principalPayment);
    
    schedule.push({
      date: new Date(currentDate),
      startingBalance: balance + principalPayment,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: monthlyInterest,
      endingBalance: balance
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return schedule;
};