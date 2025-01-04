import { CurveType } from "recharts";

export const formatMonthYear = (monthsFromNow: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const formatYAxis = (value: number, currencySymbol: string) => {
  if (value >= 1000000) {
    return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${currencySymbol}${(value / 1000).toFixed(1)}k`;
  }
  return `${currencySymbol}${value.toFixed(0)}`;
};

export const formatTooltipValue = (value: number, currencySymbol: string) => {
  return `${currencySymbol}${value.toLocaleString()}`;
};

export const chartConfig = {
  curve: "monotoneX" as CurveType,
  aspectRatio: 2,
  opacity: {
    area: 0.8,
    line: 0.9
  },
  animation: {
    duration: 1000,
    delay: 200
  }
};