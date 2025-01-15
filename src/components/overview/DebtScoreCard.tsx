import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Info, Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebts } from "@/hooks/use-debts";
import { DebtComparison } from "./DebtComparison";
import { calculateDebtScore, getScoreCategory } from "@/lib/utils/scoring/debtScoreCalculator";
import { unifiedDebtCalculationService } from "@/lib/services/UnifiedDebtCalculationService";
import { strategies } from "@/lib/strategies";
import { AddDebtDialog } from "@/components/debt/AddDebtDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Debt } from "@/lib/types";

export const DebtScoreCard = () => {
  const { debts, profile, addDebt } = useDebts();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  console.log('Rendering DebtScoreCard with debts:', {
    debtCount: debts?.length,
    totalBalance: debts?.reduce((sum, debt) => sum + debt.balance, 0),
  });

  const handleAddDebt = async (debt: Omit<Debt, "id">) => {
    try {
      await addDebt.mutateAsync(debt);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Debt added successfully",
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

  // Get currency symbol from profile, default to £ if not set
  const currencySymbol = profile?.preferred_currency || "£";
  
  // Calculate total debt
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
  
  const hasNoDebts = !debts || debts.length === 0;
  const isDebtFree = debts && debts.length > 0 && totalDebt === 0;
  
  // Calculate debt score only if there are active debts
  const calculateScore = () => {
    if (!debts || debts.length === 0 || !profile?.monthly_payment) return null;

    const selectedStrategy = strategies.find(s => s.id === profile?.selected_strategy) || strategies[0];
    
    const originalPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      debts.reduce((sum, debt) => sum + debt.minimum_payment, 0),
      selectedStrategy,
      []
    );

    const optimizedPayoff = unifiedDebtCalculationService.calculatePayoffDetails(
      debts,
      profile.monthly_payment,
      selectedStrategy,
      []
    );

    return calculateDebtScore(
      debts,
      originalPayoff,
      optimizedPayoff,
      selectedStrategy,
      profile.monthly_payment
    );
  };

  const scoreDetails = calculateScore();
  const scoreCategory = scoreDetails ? getScoreCategory(scoreDetails.totalScore) : null;

  const renderCircularProgress = () => {
    if (!scoreDetails) return null;

    return (
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#gradient)"
            strokeWidth="16"
            fill="none"
            strokeDasharray={553}
            strokeDashoffset={553 - (553 * scoreDetails.totalScore) / 100}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-5xl font-bold text-gray-900">
            {Math.round(scoreDetails.totalScore)}
          </div>
          <div className="text-emerald-500 font-medium">
            {scoreCategory?.label}
          </div>
        </div>
      </div>
    );
  };

  const renderScoreBreakdown = () => {
    if (!scoreDetails) return null;

    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Your debt repayment plan is fully optimized for interest and duration savings.
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/50 rounded-lg">
            <div className="text-gray-600">Interest Savings</div>
            <div className="text-lg font-semibold text-emerald-600">
              {scoreDetails.interestScore.toFixed(1)}/50
            </div>
          </div>
          <div className="p-4 bg-blue-50/50 rounded-lg">
            <div className="text-gray-600">Duration Reduction</div>
            <div className="text-lg font-semibold text-blue-600">
              {scoreDetails.durationScore.toFixed(1)}/30
            </div>
          </div>
          <div className="p-4 bg-purple-50/50 rounded-lg">
            <div className="text-gray-600">Payment Behavior</div>
            <div className="text-lg font-semibold text-purple-600">
              {(scoreDetails.behaviorScore.ontimePayments + 
                scoreDetails.behaviorScore.excessPayments + 
                scoreDetails.behaviorScore.strategyUsage).toFixed(1)}/20
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (hasNoDebts) {
      return (
        <div className="text-center space-y-6 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-emerald-50 rounded-full"
          >
            <Plus className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900">No Debts Added Yet!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Start tracking your debts to begin your journey to financial freedom. Add your first debt to see how Debtfreeo can help you become debt-free faster.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Add Your First Debt
          </Button>

          <AddDebtDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onAddDebt={handleAddDebt}
            currencySymbol={currencySymbol}
          />
        </div>
      );
    }

    if (isDebtFree) {
      return (
        <div className="text-center space-y-6 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-emerald-50 rounded-full"
          >
            <Award className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-emerald-600">
              🎉 Congratulations! You're Debt-Free! 🎉
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              You've achieved financial freedom! Keep up the great work and consider your next financial goals.
            </p>
          </motion.div>
        </div>
      );
    }

    // Default view with active debts
    return (
      <>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-emerald-700">YOUR DEBT SCORE</h2>
            <p className="text-gray-600 mt-1">Track your progress to debt freedom</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-5 h-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Your debt score is calculated based on interest savings, duration reduction, 
                  and payment behavior. A higher score means you're optimizing your debt payoff journey.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            {renderCircularProgress()}
          </div>
          <div className="flex-grow">
            {renderScoreBreakdown()}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <DebtComparison />
        </div>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-white p-6 relative overflow-hidden">
        {renderContent()}
      </Card>
    </motion.div>
  );
};