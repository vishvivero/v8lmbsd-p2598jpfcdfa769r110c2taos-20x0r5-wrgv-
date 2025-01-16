// Re-export calculation functions
export { 
  calculateMonthlyInterest,
  calculatePayoffDate 
} from './core/interestCalculator';

export {
  calculateMinimumPayments,
  calculatePaymentAllocation
} from './core/paymentCalculator';

export {
  calculatePayoffSchedule,
  calculatePayoffSummary
} from './payoff/payoffCalculator';

// Export types
export type { 
  DebtStatus,
  PayoffSummary,
  OneTimeFunding,
  RedistributionEntry 
} from './payoff/types';