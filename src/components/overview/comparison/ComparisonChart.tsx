import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface ComparisonChartProps {
  data: any[];
  currencySymbol: string;
}

export const ComparisonChart = ({ data, currencySymbol }: ComparisonChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Original: {currencySymbol}{payload[0].value.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-600">
              Optimized: {currencySymbol}{payload[1].value.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/95">
      <CardContent className="p-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="originalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#9CA3AF' }}
              />
              <YAxis 
                tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#9CA3AF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="original"
                name="Original"
                stroke="#94A3B8"
                fill="url(#originalGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="optimized"
                name="Optimized"
                stroke="#34D399"
                fill="url(#optimizedGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};