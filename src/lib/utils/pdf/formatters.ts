import { format } from "date-fns";
import { addMonths } from "date-fns";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM yyyy');
};

export const getNextMonth = (date: Date, monthsToAdd: number): Date => {
  return addMonths(date, monthsToAdd);
};