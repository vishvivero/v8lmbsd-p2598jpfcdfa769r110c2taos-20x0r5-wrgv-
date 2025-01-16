import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { addMonths } from "date-fns";

export interface PaymentAllocation {
  debtId: string;
  amount: number;
  isMinimumPayment: boolean;
}

export interface PayoffDetails {
  months: number;
  totalInterest: number;
  payoffDate: Date;
  monthlyPayment: number;
  redistributionHistory?: {
    fromDebtId: string;
    amount: number;
    month: number;
  }[];
}

export class UnifiedDebtCalculationService {
  private static instance: UnifiedDebtCalculationService;
  
  private constructor() {
    console.log('Initializing UnifiedDebtCalculationService');
  }

  public static getInstance(): UnifiedDebtCalculationService {
    if (!UnifiedDebtCalculationService.instance) {
      UnifiedDebtCalculationService.instance = new UnifiedDebtCalculationService();
    }
    return UnifiedDebtCalculationService.instance;
  }

  private calculateMonthlyInterest(balance: number, annualRate: number): number {
    const interest = Number(((balance * (annualRate / 100)) / 12).toFixed(2));
    console.log('Monthly interest calculation:', { balance, annualRate, interest });
    return interest;
  }

  public calculateTotalMinimumPayments(debts: Debt[]): number {
    const total = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
    console.log('Total minimum payments:', total);
    return total;
  }

  private calculatePaymentAllocations(
    debts: Debt[],
    totalPayment: number,
    strategy: Strategy
  ): PaymentAllocation[] {
    console.log('Calculating payment allocations:', {
      totalDebts: debts.length,
      totalPayment,
      strategy: strategy.name
    });

    const sortedDebts = strategy.calculate([...debts]);
    const allocations: PaymentAllocation[] = [];
    let remainingPayment = totalPayment;

    // First allocate minimum payments
    sortedDebts.forEach(debt => {
      const minPayment = Math.min(debt.minimum_payment, debt.balance);
      allocations.push({
        debtId: debt.id,
        amount: minPayment,
        isMinimumPayment: true
      });
      remainingPayment -= minPayment;
    });

    // Allocate remaining payment to highest priority debt
    if (remainingPayment > 0 && sortedDebts.length > 0) {
      const highestPriorityDebt = sortedDebts[0];
      allocations.push({
        debtId: highestPriorityDebt.id,
        amount: remainingPayment,
        isMinimumPayment: false
      });
    }

    return allocations;
  }

  public calculatePayoffDetails(
    debts: Debt[],
    monthlyPayment: number,
    strategy: Strategy,
    oneTimeFundings: { amount: number; payment_date: Date }[] = []
  ): { [key: string]: PayoffDetails } {
    console.log('Starting payoff calculation:', {
      totalDebts: debts.length,
      monthlyPayment,
      strategy: strategy.name,
      oneTimeFundings: oneTimeFundings.length
    });

    // Sort one-time fundings by date
    const sortedFundings = [...oneTimeFundings].sort(
      (a, b) => a.payment_date.getTime() - b.payment_date.getTime()
    );

    const results: { [key: string]: PayoffDetails } = {};
    const balances = new Map<string, number>();
    let remainingDebts = [...debts];
    let currentMonth = 0;
    const maxMonths = 1200;
    const startDate = new Date();

    // Initialize tracking
    debts.forEach(debt => {
      balances.set(debt.id, debt.balance);
      results[debt.id] = {
        months: 0,
        totalInterest: 0,
        payoffDate: new Date(),
        monthlyPayment: debt.minimum_payment,
        redistributionHistory: []
      };
    });

    while (remainingDebts.length > 0 && currentMonth < maxMonths) {
      const currentDate = addMonths(startDate, currentMonth);
      
      // Apply one-time fundings for this month
      const monthlyFundings = sortedFundings.filter(funding => {
        const fundingDate = funding.payment_date;
        return fundingDate.getMonth() === currentDate.getMonth() &&
               fundingDate.getFullYear() === currentDate.getFullYear();
      });

      let availablePayment = monthlyPayment;
      
      // Add one-time funding amounts to available payment
      const oneTimeFundingAmount = monthlyFundings.reduce((sum, funding) => sum + funding.amount, 0);
      availablePayment += oneTimeFundingAmount;

      console.log('Monthly calculation status:', {
        month: currentMonth,
        availablePayment,
        oneTimeFundingAmount,
        remainingDebts: remainingDebts.length
      });

      // Calculate and apply payments
      const allocations = this.calculatePaymentAllocations(
        remainingDebts,
        availablePayment,
        strategy
      );

      // Process payments and interest
      for (const debt of remainingDebts) {
        const currentBalance = balances.get(debt.id) || 0;
        const monthlyInterest = this.calculateMonthlyInterest(
          currentBalance,
          debt.interest_rate
        );
        
        results[debt.id].totalInterest += monthlyInterest;
        
        // Get total allocation for this debt
        const totalAllocation = allocations
          .filter(a => a.debtId === debt.id)
          .reduce((sum, a) => sum + a.amount, 0);
        
        const newBalance = Math.max(0, currentBalance + monthlyInterest - totalAllocation);
        balances.set(debt.id, newBalance);

        console.log(`Debt ${debt.name} monthly update:`, {
          currentBalance,
          monthlyInterest,
          payment: totalAllocation,
          newBalance
        });
      }

      // Check for paid off debts
      remainingDebts = remainingDebts.filter(debt => {
        const currentBalance = balances.get(debt.id) || 0;
        if (currentBalance <= 0.01) {
          results[debt.id].months = currentMonth + 1;
          results[debt.id].payoffDate = addMonths(startDate, currentMonth + 1);
          return false;
        }
        return true;
      });

      currentMonth++;
    }

    // Handle unpaid debts
    remainingDebts.forEach(debt => {
      if (results[debt.id].months === 0) {
        results[debt.id].months = maxMonths;
        results[debt.id].payoffDate = addMonths(startDate, maxMonths);
      }
    });

    console.log('Final calculation results:', {
      totalMonths: currentMonth,
      finalBalances: Object.fromEntries(balances),
      payoffDates: Object.entries(results).map(([id, detail]) => ({
        debtId: id,
        months: detail.months,
        payoffDate: detail.payoffDate
      }))
    });

    return results;
  }
}

// Export a singleton instance
export const unifiedDebtCalculationService = UnifiedDebtCalculationService.getInstance();