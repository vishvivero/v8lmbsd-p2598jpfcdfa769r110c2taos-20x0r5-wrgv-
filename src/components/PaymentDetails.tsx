import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/strategies";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface PaymentDetailsProps {
  totalMinimumPayments: number;
  monthlyPayment: number;
  setMonthlyPayment: (amount: number) => void;
  currencySymbol: string;
}

export const PaymentDetails = ({
  totalMinimumPayments,
  monthlyPayment,
  setMonthlyPayment,
  currencySymbol,
}: PaymentDetailsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const extraPayment = Math.max(0, monthlyPayment - totalMinimumPayments);

  useEffect(() => {
    const loadSavedPayment = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("monthly_payment")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading monthly payment:", error);
        return;
      }

      if (data?.monthly_payment) {
        setMonthlyPayment(data.monthly_payment);
      }
    };

    loadSavedPayment();
  }, [user?.id]);

  const handleMonthlyPaymentChange = async (value: number) => {
    setMonthlyPayment(value);
    
    if (!user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ monthly_payment: value })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving monthly payment:", error);
      toast({
        title: "Error",
        description: "Failed to save monthly payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Monthly Payment</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {currencySymbol}
          </span>
          <Input
            type="number"
            min={totalMinimumPayments}
            value={monthlyPayment}
            onChange={(e) => handleMonthlyPaymentChange(Number(e.target.value))}
            placeholder="Enter amount"
            className={`pl-7 number-font ${monthlyPayment < totalMinimumPayments ? "border-red-500" : ""}`}
          />
        </div>
        {monthlyPayment < totalMinimumPayments && (
          <p className="text-red-500 text-sm">
            Monthly payment must be at least {formatCurrency(totalMinimumPayments, currencySymbol)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Total Minimum Payments</label>
        <Input
          value={formatCurrency(totalMinimumPayments, currencySymbol)}
          readOnly
          className="bg-gray-50 number-font"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Extra Payment</label>
        <Input
          value={formatCurrency(extraPayment, currencySymbol)}
          readOnly
          className="bg-gray-50 number-font"
        />
      </div>
    </div>
  );
};