export interface Payment {
  date: Date;
  amount: number;
  isLastPayment: boolean;
  remainingBalance: number;
  interestPaid: number;
  principalPaid: number;
  redistributedAmount?: number;
}