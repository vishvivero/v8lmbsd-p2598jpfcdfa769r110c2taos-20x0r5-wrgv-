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
  calculateDebtStrategy,
  applyDebtStrategy
} from './strategies/debtStrategies';

export {
  calculatePayoffDetails,
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