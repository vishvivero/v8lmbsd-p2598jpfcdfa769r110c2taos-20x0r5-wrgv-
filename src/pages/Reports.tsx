import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function Reports() {
  const { data: debts, isLoading: isDebtsLoading } = useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
      console.log("Fetching debts for reports");
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching debts:", error);
        throw error;
      }

      return data;
    },
  });

  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      console.log("Fetching payment history for reports");
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .order("payment_date", { ascending: true });

      if (error) {
        console.error("Error fetching payment history:", error);
        throw error;
      }

      return data;
    },
  });

  // Process debt data for visualization
  const debtData = debts?.map(debt => ({
    name: debt.name,
    balance: Number(debt.balance),
    interestRate: Number(debt.interest_rate),
  })) || [];

  // Process payment data for visualization
  const paymentData = payments?.map(payment => ({
    date: new Date(payment.payment_date).toLocaleDateString(),
    amount: Number(payment.total_payment),
  })) || [];

  if (isDebtsLoading || isPaymentsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="h-48 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Debt Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={debtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="balance" fill="#34D399" name="Balance" />
                <Bar dataKey="interestRate" fill="#818CF8" name="Interest Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#34D399"
                  name="Payment Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}