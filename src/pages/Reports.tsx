import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, PieChart, TrendingUp, Calculator } from "lucide-react";
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
import { useDebts } from "@/hooks/use-debts";
import { MainLayout } from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";

export default function Reports() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();
  const { debts } = useDebts();

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

  const handleDownloadReport = (reportType: string) => {
    // This is a placeholder - we'll implement actual PDF generation later
    toast({
      title: "Coming Soon",
      description: `${reportType} report download will be available soon!`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Reports</h1>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="amortization" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Amortization
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Payment Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Debt Overview</CardTitle>
                <CardDescription>Summary of your current debts and payment progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
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
                  <div className="space-y-4">
                    <Button 
                      className="w-full flex items-center gap-2"
                      onClick={() => handleDownloadReport("Debt Overview")}
                    >
                      <FileDown className="h-4 w-4" />
                      Download Debt Overview Report
                    </Button>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        {debts?.map((debt) => (
                          <div key={debt.id} className="flex justify-between items-center">
                            <span>{debt.name}</span>
                            <span>{debt.currency_symbol}{debt.balance.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amortization">
            <Card>
              <CardHeader>
                <CardTitle>Amortization Schedule</CardTitle>
                <CardDescription>Detailed breakdown of your debt repayment schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {debts?.map((debt) => (
                    <div key={debt.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{debt.name}</h3>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleDownloadReport(`Amortization - ${debt.name}`)}
                        >
                          <FileDown className="h-4 w-4" />
                          Download Schedule
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Interest Rate: {debt.interest_rate}% | 
                        Monthly Payment: {debt.currency_symbol}{debt.minimum_payment}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>Analysis of your payment history and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
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
                  <div className="space-y-4">
                    <Button 
                      className="w-full flex items-center gap-2"
                      onClick={() => handleDownloadReport("Payment Trends")}
                    >
                      <FileDown className="h-4 w-4" />
                      Download Trends Report
                    </Button>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        {paymentData.map((payment, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{payment.date}</span>
                            <span>£{payment.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}