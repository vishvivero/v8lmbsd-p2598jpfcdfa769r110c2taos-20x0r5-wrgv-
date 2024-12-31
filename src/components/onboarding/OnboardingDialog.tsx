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
import { Debt } from "@/lib/types/debt";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const [strategy, setStrategy] = useState("");
  const [debts, setDebts] = useState<Debt[]>([]);
  const { addDebt, profile } = useDebts();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddDebt = async (debt: any) => {
    try {
      await addDebt.mutateAsync(debt);
      setDebts([...debts, debt]);
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

  const calculateTotal = () => {
    return debts.reduce((sum, debt) => sum + debt.balance, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] overflow-y-auto p-0">
        <div className="p-6">
          <OnboardingProgress currentStep={1} />
        </div>
        
        <div className="grid grid-cols-12 gap-8 p-6">
          {/* Left side text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-4 flex items-center"
          >
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg w-full h-full flex items-center justify-center">
              <p className="text-xl text-gray-900">
                You are one step away from setting a plan
              </p>
            </div>
          </motion.div>

          {/* Right side content */}
          <div className="col-span-8 space-y-6">
            <WelcomeSection />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="strategy" className="border rounded-lg p-4 mb-4">
                <AccordionTrigger className="text-base font-normal">
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
                <AccordionTrigger className="text-base font-normal">
                  Debt Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <AddDebtForm 
                      onAddDebt={handleAddDebt}
                      currencySymbol={profile?.preferred_currency || "£"}
                    />

                    {debts.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-base font-medium">Added Debts</h3>
                        <div className="space-y-3">
                          {debts.map((debt, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                              <div>{debt.banker_name}</div>
                              <div>{debt.name}</div>
                              <div>{debt.currency_symbol}{debt.balance}</div>
                              <div>{debt.interest_rate}%</div>
                              <div>{debt.currency_symbol}{debt.minimum_payment}</div>
                            </div>
                          ))}
                          <div className="flex justify-between pt-4 border-t">
                            <span className="font-medium">Total Balance:</span>
                            <span className="font-medium">{profile?.preferred_currency || "£"}{calculateTotal()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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