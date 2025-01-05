import { Debt } from "@/lib/types";
import { Strategy } from "@/lib/strategies";
import { addMonths } from "date-fns";
import { RedistributionManager } from "./redistributionManager";
import { MonthlyCalculation, PaymentAllocation } from "./types/PaymentTypes";
import { calculateMonthlyInterest } from "./interestCalculations";

export class MonthlyCalculator {
  private debts: Debt[];
  private monthlyPayment: number;
  private strategy: Strategy;
  private startDate: Date;
  private redistributionManager: RedistributionManager;

  constructor(
    debts: Debt[],
    monthlyPayment: number,
    strategy: Strategy,
    redistributionManager: RedistributionManager
  ) {
    this.debts = debts;
    this.monthlyPayment = monthlyPayment;
    this.strategy = strategy;
    this.startDate = new Date();
    this.redistributionManager = redistributionManager;
  }

  calculateMonthlyPayments(month: number): MonthlyCalculation {
    const currentDate = addMonths(this.startDate, month);
    const payments = new Map<string, PaymentAllocation>();
    let availablePayment = this.monthlyPayment;

    // First, allocate minimum payments
    for (const debt of this.debts) {
      const redistributedAmount = this.redistributionManager.getRedistributionsForDebt(debt.id, month);
      const baseAmount = Math.min(debt.minimum_payment, availablePayment);
      
      payments.set(debt.id, {
        debtId: debt.id,
        baseAmount,
        redistributedAmount
      });
      
      availablePayment -= baseAmount;
    }

    // Then, allocate extra payment to highest priority debt
    if (availablePayment > 0 && this.debts.length > 0) {
      const targetDebt = this.strategy.calculate([...this.debts])[0];
      const payment = payments.get(targetDebt.id);
      
      if (payment) {
        payment.baseAmount += availablePayment;
        payments.set(targetDebt.id, payment);
      }
    }

    return {
      date: currentDate,
      payments,
      redistributions: []
    };
  }
}