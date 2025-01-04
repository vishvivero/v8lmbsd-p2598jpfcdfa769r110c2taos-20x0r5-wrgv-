import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface Payment {
  created_at: string;
  currency_symbol: string;
  id: string;
  payment_date: string;
  total_payment: number;
  user_id: string;
}

export interface PaymentTrendsTabProps {
  payments: Payment[];
  handleDownloadReport: (reportType: string) => void;
}

export function PaymentTrendsTab({ payments, handleDownloadReport }: PaymentTrendsTabProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return payments
      .sort((a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime())
      .map((payment) => ({
        date: payment.payment_date,
        amount: payment.total_payment,
      }));
  }, [payments]);

  if (!mounted) return null;

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Trends</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadReport("payment-trends")}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), "MMM d")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(parseISO(date), "MMM d, yyyy")}
                  formatter={(value: number) =>
                    [`$${value.toFixed(2)}`, "Amount"]
                  }
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}