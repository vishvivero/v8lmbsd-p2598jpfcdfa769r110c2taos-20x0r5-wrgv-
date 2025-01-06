import { format } from 'date-fns';

export const formatCurrency = (amount: number, currencySymbol: string = '£'): string => {
  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};