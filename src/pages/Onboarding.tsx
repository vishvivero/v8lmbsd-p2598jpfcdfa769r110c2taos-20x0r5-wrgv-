import { useState } from "react";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { WelcomeSection } from "@/components/onboarding/WelcomeSection";
import { StrategySelector } from "@/components/onboarding/StrategySelector";
import { AddDebtForm } from "@/components/AddDebtForm";
import { useDebts } from "@/hooks/use-debts";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Onboarding = () => {
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
    <div className="min-h-screen bg-gray-50">
      <OnboardingProgress currentStep={1} totalSteps={5} />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <WelcomeSection />
        
        <div className="grid gap-8 max-w-4xl">
          <StrategySelector 
            value={strategy} 
            onChange={setStrategy} 
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Debt Details</Label>
              <p className="text-gray-600">
                Add your current debts to get started
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
              onClick={() => navigate("/onboarding/plan")}
              disabled={!strategy}
            >
              Continue to Plan
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;