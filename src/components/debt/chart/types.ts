export interface ChartData {
  [key: string]: string | number;
  monthLabel: string;
  month: number;
  Total: number;
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