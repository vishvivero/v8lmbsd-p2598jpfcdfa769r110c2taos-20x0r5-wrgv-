import { ChartData } from "./types";

export const calculateChartDomain = (chartData: ChartData[]) => {
  // Find the maximum debt value with proper type checking
  const maxDebt = Math.max(...chartData.map(data => {
    const numericValues = Object.values(data)
      .filter((value): value is number => 
        typeof value === 'number' && value > 0 && !isNaN(value)
      );
    return numericValues.length > 0 ? Math.max(...numericValues) : 0;
  }).filter(value => value > 0));

  // Calculate minimum value for log scale (avoid zero)
  const minDebt = Math.max(1, maxDebt * 0.001);

  return { maxDebt, minDebt };
};