import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDebts } from "@/hooks/use-debts";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/components/ui/use-toast";
import { strategies } from "@/lib/strategies";
import { Strategy as StrategyType } from "@/lib/strategies";
import { StrategySelector } from "@/components/StrategySelector";
import { PaymentOverview } from "@/components/strategy/PaymentOverview";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { StrategyHeader } from "@/components/strategy/StrategyHeader";
import { PaymentScheduleCard } from "@/components/strategy/PaymentScheduleCard";

export default function Strategy() {
  const { debts } = useDebts();
  const { profile, updateProfile } = useProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(
    strategies.find(s => s.id === (profile?.selected_strategy || 'avalanche')) || strategies[0]
  );

  const handleStrategyChange = async (strategy: StrategyType) => {
    if (!profile) return;

    setSelectedStrategy(strategy);
    console.log('Updating strategy to:', strategy.id);

    try {
      await updateProfile.mutateAsync({
        ...profile,
        selected_strategy: strategy.id
      });
      
      toast({
        title: "Success",
        description: "Payment strategy updated successfully",
      });
    } catch (error) {
      console.error('Error updating strategy:', error);
      toast({
        title: "Error",
        description: "Failed to update payment strategy",
        variant: "destructive",
      });
    }
  };

  const handleSaveExtra = async (amount: number) => {
    if (!profile) return;
    
    try {
      await updateProfile.mutateAsync({
        ...profile,
        monthly_payment: amount
      });
      
      toast({
        title: "Success",
        description: "Monthly payment updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update monthly payment",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-7xl py-8 space-y-8">
          <StrategyHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <PaymentOverview
                debts={debts || []}
                monthlyPayment={profile?.monthly_payment || 0}
                selectedStrategy={selectedStrategy.id}
                currencySymbol={profile?.preferred_currency || '£'}
                onExtraPaymentClick={() => setIsDialogOpen(true)}
                onSaveExtra={handleSaveExtra}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <StrategySelector
                strategies={strategies}
                selectedStrategy={selectedStrategy}
                onSelectStrategy={handleStrategyChange}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PaymentScheduleCard />
          </motion.div>
        </div>
      </div>

      <ExtraPaymentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentPayment={profile?.monthly_payment || 0}
        onSave={handleSaveExtra}
        currencySymbol={profile?.preferred_currency || "£"}
      />
    </MainLayout>
  );
}