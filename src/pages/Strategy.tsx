import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { useProfile } from "@/hooks/use-profile";
import { StrategyHeader } from "@/components/strategy/StrategyHeader";
import { StrategyContent } from "@/components/strategy/StrategyContent";
import { strategies } from "@/lib/strategies";
import { OverviewChart } from "@/components/overview/OverviewChart";
import { OverviewSummary } from "@/components/overview/OverviewSummary";
import type { Debt } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";

export default function Strategy() {
  const { debts, updateDebt: updateDebtMutation, deleteDebt: deleteDebtMutation, isLoading: isDebtsLoading } = useDebts();
  const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();
  const { oneTimeFundings } = useOneTimeFunding();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  
  const isLoading = isDebtsLoading || isProfileLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!debts || !profile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>No debts found. Add your first debt to get started.</p>
        </div>
      </MainLayout>
    );
  }

  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const totalMonthlyPayment = profile.monthly_payment || totalMinimumPayments;

  const handleStrategyChange = async (strategyId: string) => {
    const newStrategy = strategies.find(s => s.id === strategyId);
    if (newStrategy) {
      setSelectedStrategy(newStrategy);
      
      if (profile) {
        try {
          await updateProfile({
            ...profile,
            selected_strategy: strategyId,
          });
        } catch (error) {
          console.error('Error updating strategy:', error);
        }
      }
    }
  };

  const handleDebtUpdate = async (updatedDebt: Debt) => {
    try {
      await updateDebtMutation(updatedDebt);
    } catch (error) {
      console.error('Error updating debt:', error);
    }
  };

  const handleDebtDelete = async (debtId: string) => {
    try {
      await deleteDebtMutation(debtId);
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] dark:from-gray-900 dark:to-gray-800">
        <div className="container max-w-7xl py-8 space-y-8">
          <StrategyHeader />
          
          {/* PAYOFF TIMELINE Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-[#107A57] mb-6">PAYOFF TIMELINE</h2>
              <OverviewChart
                debts={debts}
                monthlyPayment={totalMonthlyPayment}
                currencySymbol={profile.preferred_currency || "£"}
                oneTimeFundings={oneTimeFundings}
              />
            </div>
          </motion.div>
          
          {/* Debt Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-[#107A57] mb-6">Debt Summary</h2>
              <OverviewSummary oneTimeFundings={oneTimeFundings} />
            </div>
          </motion.div>
          
          <StrategyContent
            debts={debts}
            totalMinimumPayments={totalMinimumPayments}
            totalMonthlyPayment={totalMonthlyPayment}
            selectedStrategy={selectedStrategy}
            onStrategyChange={handleStrategyChange}
            onDebtUpdate={handleDebtUpdate}
            onDebtDelete={handleDebtDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}