export const calculateMonthlyInterest = (balance: number, interestRate: number) => {
  return (balance * interestRate) / 1200;
};

export const processMonthlyPayment = (
  balance: number,
  payment: number,
  monthlyInterest: number
) => {
  const totalDue = balance + monthlyInterest;
  const actualPayment = Math.min(payment, totalDue);
  const newBalance = Math.max(0, totalDue - actualPayment);
  return { newBalance, actualPayment };
};

export const calculatePayoffDetails = (debts: any[], monthlyPayment: number) => {
  console.log('Starting payoff calculation with:', { debts, monthlyPayment });
  
  const results: {
    [key: string]: { 
      months: number, 
      totalInterest: number, 
      proposedPayment: number 
    }
  } = {};

  let remainingDebts = [...debts];
  let currentMonth = 0;
  const maxMonths = 1200; // 100 years cap
  
  // Initialize results for all debts
  debts.forEach(debt => {
    results[debt.id] = {
      months: 0,
      totalInterest: 0,
      proposedPayment: debt.minimum_payment
    };
  });

  while (remainingDebts.length > 0 && currentMonth < maxMonths) {
    console.log(`Processing month ${currentMonth}:`, { 
      remainingDebts: remainingDebts.length,
      availablePayment: monthlyPayment 
    });

    // Calculate minimum payments
    let availablePayment = monthlyPayment;
    const minimumPayments = remainingDebts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
    const extraPayment = Math.max(0, availablePayment - minimumPayments);

    // Process each debt
    remainingDebts = remainingDebts.filter(debt => {
      const monthlyInterest = calculateMonthlyInterest(debt.balance, debt.interest_rate);
      let payment = debt.minimum_payment;

      // Add extra payment to first debt
      if (extraPayment > 0 && debt.id === remainingDebts[0].id) {
        payment += extraPayment;
      }

      const { newBalance } = processMonthlyPayment(debt.balance, payment, monthlyInterest);
      
      // Update running totals
      results[debt.id].totalInterest += monthlyInterest;
      results[debt.id].months = currentMonth + 1;
      results[debt.id].proposedPayment = payment;

      debt.balance = newBalance;
      
      console.log(`Processed debt ${debt.name}:`, {
        payment,
        newBalance,
        monthlyInterest
      });

      return newBalance > 0.01;
    });

    currentMonth++;
  }

  console.log('Final payoff results:', results);
  return results;
};