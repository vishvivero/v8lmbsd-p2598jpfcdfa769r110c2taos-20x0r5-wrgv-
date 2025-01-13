import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { OverviewHeader } from "@/components/overview/OverviewHeader";
import { OverviewProgress } from "@/components/overview/OverviewProgress";
import { OverviewChart } from "@/components/overview/OverviewChart";
import { OverviewSummary } from "@/components/overview/OverviewSummary";
import { DebtFreeCountdown } from "@/components/overview/DebtFreeCountdown";
import { DebtComparison } from "@/components/overview/DebtComparison";

const Overview = () => {
  const [currencySymbol, setCurrencySymbol] = useState<string>('£');
  const { toast } = useToast();
  const { user } = useAuth();
  const { debts, isLoading, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();

  useEffect(() => {
    if (profile?.preferred_currency) {
      setCurrencySymbol(profile.preferred_currency);
    }
  }, [profile]);

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrencySymbol(newCurrency);
    
    if (!user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ preferred_currency: newCurrency })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving currency preference:", error);
      toast({
        title: "Error",
        description: "Failed to save currency preference",
        variant: "destructive",
      });
      return;
    }
  };

  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) ?? 0;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
        <div className="container py-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Your Debt Overview
            </h1>
            <p className="text-gray-600 text-lg">
              Track Your Progress Toward Financial Freedom
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <OverviewProgress
                totalDebt={totalDebt}
                currencySymbol={currencySymbol}
                oneTimeFundings={oneTimeFundings}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <DebtComparison />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <DebtFreeCountdown />
          </div>

          {debts && debts.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <OverviewChart
                  debts={debts}
                  monthlyPayment={totalMinimumPayments}
                  currencySymbol={currencySymbol}
                  oneTimeFundings={oneTimeFundings}
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <OverviewSummary oneTimeFundings={oneTimeFundings} />
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Overview;