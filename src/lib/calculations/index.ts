export * from './core/interestCalculator';
export * from './core/paymentCalculator';
export * from './payoff/payoffCalculator';
export * from './types';
export { strategies } from './strategies/debtStrategies';

// Utility functions
export const formatCurrency = (amount: number, currencySymbol: string = '£') => {
  return `${currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};