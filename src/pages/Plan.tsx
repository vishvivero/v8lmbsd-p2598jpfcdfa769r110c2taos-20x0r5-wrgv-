import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { strategies } from "@/lib/strategies";
import { useState } from "react";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { useProfile } from "@/hooks/use-profile";
import { motion } from "framer-motion";
import { StrategySelector } from "@/components/StrategySelector";
import { PaymentOverviewSection } from "@/components/strategy/PaymentOverviewSection";
import { OneTimeFundingSection } from "@/components/strategy/OneTimeFundingSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebtTableContainer } from "@/components/DebtTableContainer";
import { PlanHeader } from "@/components/debt/PlanHeader";
import { UpcomingPaymentsSection } from "@/components/debt/UpcomingPaymentsSection";

export default function Plan() {
  const { debts, updateDebt: updateDebtMutation, deleteDebt: deleteDebtMutation } = useDebts();
  const { profile, updateProfile } = useProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const extraPayment = profile?.monthly_payment 
    ? Math.max(0, profile.monthly_payment - totalMinimumPayments)
    : 0;

  const handleSaveExtra = async (amount: number) => {
    if (!profile) return;
    
    const totalPayment = totalMinimumPayments + amount;
    console.log('Updating monthly payment to:', totalPayment);
    try {
      await updateProfile.mutateAsync({
        ...profile,
        monthly_payment: totalPayment
      });
    } catch (error) {
      console.error("Failed to update monthly payment:", error);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-7xl py-8 space-y-8">
          <PlanHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <PaymentOverviewSection
                totalMinimumPayments={totalMinimumPayments}
                extraPayment={extraPayment}
                onExtraPaymentChange={handleSaveExtra}
                onOpenExtraPaymentDialog={() => setIsDialogOpen(true)}
                currencySymbol={profile?.preferred_currency}
              />
              
              <OneTimeFundingSection />

              {debts && debts.length > 0 && (
                <Card className="bg-white/95">
                  <CardHeader>
                    <CardTitle>Debt Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DebtTableContainer
                      debts={debts}
                      monthlyPayment={totalMinimumPayments + extraPayment}
                      onUpdateDebt={updateDebtMutation.mutate}
                      onDeleteDebt={deleteDebtMutation.mutate}
                      currencySymbol={profile?.preferred_currency}
                      selectedStrategy={selectedStrategy.id}
                    />
                  </CardContent>
                </Card>
              )}

              {debts && debts.length > 0 && (
                <UpcomingPaymentsSection debts={debts} />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Strategy Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StrategySelector
                    strategies={strategies}
                    selectedStrategy={selectedStrategy}
                    onSelectStrategy={setSelectedStrategy}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <ExtraPaymentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentPayment={totalMinimumPayments}
        onSave={handleSaveExtra}
        currencySymbol={profile?.preferred_currency || "£"}
      />
    </MainLayout>
  );
}