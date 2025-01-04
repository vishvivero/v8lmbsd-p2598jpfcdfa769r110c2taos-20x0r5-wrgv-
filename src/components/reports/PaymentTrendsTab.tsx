import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { PaymentTrendsChart } from "./PaymentTrendsChart";

interface PaymentTrendsTabProps {
  payments: any[];
  handleDownloadReport: (reportType: string) => void;
}

export const PaymentTrendsTab = ({ payments, handleDownloadReport }: PaymentTrendsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Trends</CardTitle>
        <CardDescription>Analysis of your payment history and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <PaymentTrendsChart payments={payments} />
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
                {payments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                    <span>£{payment.total_payment.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};