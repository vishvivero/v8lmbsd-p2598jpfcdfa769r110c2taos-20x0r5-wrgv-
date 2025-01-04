import React from 'react';
import { Debt } from '@/lib/types/debt';

interface ChartGradientsProps {
  debts: Debt[];
}

export const ChartGradients = ({ debts }: ChartGradientsProps) => {
  return (
    <defs>
      {debts.map((_, index) => (
        <linearGradient
          key={`gradient-${index}`}
          id={`gradient-${index}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="5%"
            stopColor={`hsl(${(index * 360) / debts.length}, 85%, 65%)`}
            stopOpacity={0.9}
          />
          <stop
            offset="95%"
            stopColor={`hsl(${(index * 360) / debts.length}, 85%, 65%)`}
            stopOpacity={0.2}
          />
        </linearGradient>
      ))}
      <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#000000" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#000000" stopOpacity={0.05} />
      </linearGradient>
    </defs>
  );
};