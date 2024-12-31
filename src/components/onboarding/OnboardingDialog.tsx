import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingProgress } from "./OnboardingProgress";
import { WelcomeSection } from "./WelcomeSection";
import { StrategySelector } from "./StrategySelector";
import { AddDebtForm } from "@/components/AddDebtForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebts } from "@/hooks/use-debts";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
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
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <OnboardingProgress currentStep={1} />
        
        <div className="grid grid-cols-12 gap-8 mt-8">
          {/* Left side text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-4"
          >
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <p className="text-2xl font-semibold text-gray-900">
                You are one step away from setting a plan
              </p>
            </div>
          </motion.div>

          {/* Right side content */}
          <div className="col-span-8 space-y-6">
            <WelcomeSection />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="strategy" className="border rounded-lg p-4 mb-4">
                <AccordionTrigger className="text-lg font-semibold">
                  Payment Strategy
                </AccordionTrigger>
                <AccordionContent>
                  <StrategySelector 
                    value={strategy} 
                    onChange={setStrategy} 
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="debt-details" className="border rounded-lg p-4">
                <AccordionTrigger className="text-lg font-semibold">
                  Debt Details
                </AccordionTrigger>
                <AccordionContent>
                  <AddDebtForm 
                    onAddDebt={handleAddDebt}
                    currencySymbol={profile?.preferred_currency || "£"}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end">
              <Button 
                size="lg"
                onClick={() => navigate("/onboarding/plan")}
                disabled={!strategy}
                className="bg-primary hover:bg-primary/90"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};