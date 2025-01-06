import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingProgress } from "./OnboardingProgress";
import { WelcomeSection } from "./WelcomeSection";
import { StrategySelector } from "./StrategySelector";
import { AddDebtForm } from "@/components/AddDebtForm";
import { AuthForm } from "@/components/AuthForm";
import { useDebts } from "@/hooks/use-debts";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [strategy, setStrategy] = useState("");
  const { addDebt, profile } = useDebts();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddDebt = async (debt: any) => {
    try {
      await addDebt.mutateAsync(debt);
      toast({
        title: "Success",
        description: "Your debt has been added successfully.",
      });
      setCurrentStep(2);
    } catch (error) {
      console.error("Error adding debt:", error);
      toast({
        title: "Error",
        description: "Failed to add debt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white rounded-xl">
        <div className="p-6">
          <OnboardingProgress currentStep={currentStep} />
        </div>
        
        <div className="px-8 pb-6">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Setup your debt profile
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Let's start by understanding your current debts. This will help us create 
                  a personalized plan to achieve financial freedom.
                </p>
              </div>

              <div className="mt-8">
                <AddDebtForm onAddDebt={handleAddDebt} currencySymbol={profile?.preferred_currency} />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Choose Your Strategy
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select a debt repayment strategy that aligns with your goals.
                </p>
              </div>

              <div className="mt-8">
                <StrategySelector 
                  value={strategy} 
                  onChange={setStrategy} 
                />
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!strategy}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Create Your Account
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Sign up to save your progress and start your journey to financial freedom.
                </p>
              </div>

              <div className="mt-8">
                <AuthForm onSuccess={() => {
                  onOpenChange(false);
                  navigate("/overview");
                }} />
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};