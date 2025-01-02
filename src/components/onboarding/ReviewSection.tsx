import { useState, useEffect } from "react";
import { useDebts } from "@/hooks/use-debts";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { calculatePayoffTime } from "@/lib/strategies";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/strategies";

export const ReviewSection = () => {
  const { debts, profile } = useDebts();
  const navigate = useNavigate();
  const [extraPayment, setExtraPayment] = useState(0);
  const currencySymbol = profile?.preferred_currency || "£";

  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) || 0;
  const totalMonthlyPayment = totalMinimumPayments + extraPayment;

  // Calculate months to payoff with current payment
  const calculatePayoffMonths = () => {
    if (!debts || debts.length === 0) return { years: 0, months: 0 };
    
    const maxMonths = Math.max(
      ...debts.map(debt => calculatePayoffTime(debt, debt.minimum_payment))
    );

    const years = Math.floor(maxMonths / 12);
    const months = maxMonths % 12;
    
    return { years, months };
  };

  // Calculate projected payoff date
  const getPayoffDate = (years: number, months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + (years * 12) + months);
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const { years, months } = calculatePayoffMonths();
  const payoffDate = getPayoffDate(years, months);

  // Calculate total interest (simplified calculation)
  const calculateTotalInterest = () => {
    if (!debts) return 0;
    return debts.reduce((sum, debt) => {
      const monthlyInterest = (debt.interest_rate / 100 / 12) * debt.balance;
      return sum + monthlyInterest;
    }, 0);
  };

  const monthlyInterest = calculateTotalInterest();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Financial Overview</h2>
          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                Your total debt: {formatCurrency(totalDebt, currencySymbol)}
              </p>
              <p className="text-red-500">
                Debt is stealing: {formatCurrency(monthlyInterest, currencySymbol)} from your income every month
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
          <div className="space-y-2">
            <p className="text-lg">
              If you continue making only minimum payments, you will be debt-free by:
            </p>
            <p className="text-xl font-bold text-primary">
              {years} years and {months} months ({payoffDate})
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">You just took a big step!</h3>
            <p className="text-lg text-gray-700">
              Boost your payments to pay off your debt even faster!
            </p>

            <div className="space-y-4">
              <label className="text-sm font-medium">Extra monthly payment</label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[extraPayment]}
                  onValueChange={(value) => setExtraPayment(value[0])}
                  max={Math.max(totalDebt / 12, totalMinimumPayments * 2)}
                  step={10}
                  className="flex-1"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {currencySymbol}
                  </span>
                  <Input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    className="pl-7 w-32"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                onClick={() => navigate("/planner")}
              >
                Review and Confirm
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};