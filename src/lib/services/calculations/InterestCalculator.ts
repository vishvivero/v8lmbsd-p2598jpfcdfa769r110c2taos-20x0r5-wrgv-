import { Debt } from "@/lib/types";

export class InterestCalculator {
  public static calculateMonthlyInterest(balance: number, annualRate: number): number {
    const interest = Number(((balance * (annualRate / 100)) / 12).toFixed(2));
    console.log('Monthly interest calculation:', { balance, annualRate, interest });
    return interest;
  }

  public static calculateTotalInterest(
    balance: number,
    annualRate: number,
    months: number
  ): number {
    let remainingBalance = balance;
    let totalInterest = 0;
    
    for (let i = 0; i < months; i++) {
      const monthlyInterest = this.calculateMonthlyInterest(remainingBalance, annualRate);
      totalInterest += monthlyInterest;
      remainingBalance += monthlyInterest;
    }
    
    return Number(totalInterest.toFixed(2));
  }
}