import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { PaymentTrendsChart } from "./PaymentTrendsChart";
import { generatePaymentTrendsPDF } from "@/lib/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";

interface PaymentTrendsTabProps {
  payments: any[];
}

export const PaymentTrendsTab = ({ payments }: PaymentTrendsTabProps) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    try {
      const doc = generatePaymentTrendsPDF(payments);
      doc.save('payment-trends-report.pdf');
      
      toast({
        title: "Success",
        description: "Payment trends report downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

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
              onClick={handleDownloadReport}
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