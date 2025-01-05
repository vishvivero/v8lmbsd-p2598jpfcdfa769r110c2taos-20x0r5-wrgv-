import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { strategies } from "@/lib/strategies";
import { Info, Target } from "lucide-react";
import { useState } from "react";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { useProfile } from "@/hooks/use-profile";
import { motion } from "framer-motion";
import { StrategySelector } from "@/components/StrategySelector";
import { PaymentOverviewSection } from "@/components/strategy/PaymentOverviewSection";
import { OneTimeFundingSection } from "@/components/strategy/OneTimeFundingSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebtTableContainer } from "@/components/DebtTableContainer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DebtColumn } from "@/components/debt/DebtColumn";

export default function Strategy() {
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

  const handleUpdateDebt = (updatedDebt: Debt) => {
    console.log('Updating debt:', updatedDebt);
    updateDebtMutation.mutate(updatedDebt);
  };

  const handleDeleteDebt = (debtId: string) => {
    console.log('Deleting debt:', debtId);
    deleteDebtMutation.mutate(debtId);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-7xl py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Payment Strategy
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Tutorial
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">Optimize your debt payoff plan</p>
            </div>
          </div>

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
                      onUpdateDebt={handleUpdateDebt}
                      onDeleteDebt={handleDeleteDebt}
                      currencySymbol={profile?.preferred_currency}
                      selectedStrategy={selectedStrategy.id}
                    />
                  </CardContent>
                </Card>
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
                    <Target className="h-5 w-5 text-primary" />
                    Strategy Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StrategySelector
                    value={selectedStrategy.id}
                    onChange={(id) => setSelectedStrategy(strategies.find(s => s.id === id) || strategies[0])}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Full-width Debt Repayment Plan section */}
          {debts && debts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle>Debt Repayment Plan</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View upcoming payments for each debt
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <div className="flex space-x-4 p-4">
                      {debts.map((debt) => (
                        <DebtColumn
                          key={debt.id}
                          debt={debt}
                          monthlyPayment={debt.minimum_payment + (extraPayment / debts.length)}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
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