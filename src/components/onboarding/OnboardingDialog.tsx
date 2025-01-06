import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingProgress } from "./OnboardingProgress";
import { WelcomeSection } from "./WelcomeSection";
import { StrategySelector } from "./StrategySelector";
import { AddDebtForm } from "@/components/AddDebtForm";
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
        title: "Debt added successfully",
        description: "Your debt has been added to your profile.",
      });
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
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <OnboardingProgress currentStep={currentStep} />
        </div>
        
        {currentStep === 1 && (
          <div className="grid grid-cols-12 gap-8 p-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"
            >
              <div className="h-full flex items-center justify-center p-6">
                <p className="text-lg text-gray-900 text-center">
                  You are one step away from setting a plan
                </p>
              </div>
            </motion.div>

            <div className="col-span-9 space-y-6">
              <WelcomeSection />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label className="text-lg font-semibold">Choose Your Strategy</Label>
                <p className="text-gray-600 mb-4">
                  Select how you'd like to tackle your debt
                </p>
                <StrategySelector 
                  value={strategy} 
                  onChange={setStrategy} 
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Add Your First Debt</Label>
                  <p className="text-gray-600">
                    Let's start by adding your current debts
                  </p>
                </div>

                <AddDebtForm 
                  onAddDebt={handleAddDebt}
                  currencySymbol={profile?.preferred_currency || "£"}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end"
              >
                <Button 
                  size="lg"
                  onClick={() => setCurrentStep(2)}
                  disabled={!strategy}
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold">Ready to Start Your Debt-Free Journey?</h2>
              <p className="text-gray-600">
                Create your account now to save your progress and get personalized recommendations
                for paying off your debt faster.
              </p>
              <div className="pt-4">
                <AuthForm onSuccess={() => {
                  onOpenChange(false);
                  navigate("/overview");
                }} />
              </div>
            </motion.div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};