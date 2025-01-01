import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { SetPlanSection } from "@/components/onboarding/SetPlanSection";
import { useDebts } from "@/hooks/use-debts";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/strategies";

export const Plan = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { debts, profile } = useDebts();
  const { toast } = useToast();
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;

  useEffect(() => {
    setMonthlyPayment(totalMinimumPayments);
  }, [totalMinimumPayments]);

  const handlePaymentChange = (amount: number) => {
    if (amount < totalMinimumPayments) {
      toast({
        title: "Warning",
        description: "Payment amount cannot be less than total minimum payments",
        variant: "destructive",
      });
      return;
    }
    setMonthlyPayment(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <OnboardingProgress currentStep={2} />
        </div>
        
        <div className="grid grid-cols-12 gap-8 p-6">
          {/* Left side message */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-[calc(100vh-16rem)] flex items-center justify-center"
          >
            <h2 className="text-2xl font-medium text-gray-900 text-center leading-tight px-6">
              Your total minimum payments to all your debts is{" "}
              <span className="text-primary">
                {formatCurrency(totalMinimumPayments, profile?.preferred_currency || "£")}
              </span>
            </h2>
          </motion.div>

          {/* Right side content */}
          <div className="col-span-9 space-y-6">
            <SetPlanSection
              totalMinimumPayments={totalMinimumPayments}
              currencySymbol={profile?.preferred_currency || "£"}
              onPaymentChange={handlePaymentChange}
            />
          </div>
        </div>

        <div className="sticky bottom-0 w-full p-4 bg-white border-t">
          <div className="flex justify-between">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate("/onboarding")}
            >
              Back
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/onboarding/review")}
              disabled={monthlyPayment < totalMinimumPayments}
              className={`${monthlyPayment >= totalMinimumPayments ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300'}`}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Plan;