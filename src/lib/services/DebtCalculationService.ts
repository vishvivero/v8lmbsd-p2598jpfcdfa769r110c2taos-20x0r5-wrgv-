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

  public calculateMonthlyInterest(balance: number, annualRate: number): number {
    console.log('Calculating monthly interest:', { balance, annualRate });
    return Number(((balance * (annualRate / 100)) / 12).toFixed(2));
  }

  public calculateTotalMinimumPayments(debts: Debt[]): number {
    console.log('Calculating total minimum payments for debts:', debts.length);
    return debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  }

  public calculatePaymentAllocations(
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
    console.log('Calculating payoff details:', {
      totalDebts: debts.length,
      monthlyPayment,
      strategy: strategy.name,
      oneTimeFundings: oneTimeFundings.length
    });

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
      remainingDebts = strategy.calculate([...remainingDebts]);
      const allocations = this.calculatePaymentAllocations(
        remainingDebts,
        monthlyPayment,
        strategy
      );

      // Process payments and track interest
      for (const debt of remainingDebts) {
        const currentBalance = balances.get(debt.id) || 0;
        const monthlyInterest = this.calculateMonthlyInterest(
          currentBalance,
          debt.interest_rate
        );
        
        results[debt.id].totalInterest += monthlyInterest;
        const totalAllocation = allocations
          .filter(a => a.debtId === debt.id)
          .reduce((sum, a) => sum + a.amount, 0);
        
        const newBalance = Math.max(0, currentBalance + monthlyInterest - totalAllocation);
        balances.set(debt.id, newBalance);
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

    return results;
  }
}

// Export a singleton instance
export const unifiedDebtCalculationService = UnifiedDebtCalculationService.getInstance();