export interface ChartData {
  date: string;
  monthLabel: string;
  month: number;
  Total: number;
  [key: string]: string | number;  // Allow for dynamic debt names
}

export interface GradientDefinition {
  id: string;
  startColor: string;
  endColor: string;
  opacity: {
    start: number;
    end: number;
  };
}

export interface ChartTooltipProps {
  x?: number;
  y?: number;
  date?: string;
  values?: { name: string; value: number }[];
  currencySymbol: string;
}