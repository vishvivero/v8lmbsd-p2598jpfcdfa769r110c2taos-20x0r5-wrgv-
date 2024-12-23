import { useState } from "react";
import { motion } from "framer-motion";
import { DebtTable } from "@/components/DebtTable";
import { StrategySelector } from "@/components/StrategySelector";
import { DebtChart } from "@/components/DebtChart";
import { AddDebtForm } from "@/components/AddDebtForm";
import { AIRecommendations } from "@/components/AIRecommendations";
import { Debt, Strategy, strategies } from "@/lib/strategies";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(500);
  const { toast } = useToast();

  const handleAddDebt = (newDebt: Omit<Debt, "id">) => {
    const debt: Debt = {
      ...newDebt,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDebts([...debts, debt]);
    toast({
      title: "Debt Added",
      description: `${newDebt.name} has been added to your debt list.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight">Debt Freedom Planner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take control of your financial future with our intelligent debt management
            platform. Track your progress, compare strategies, and get personalized
            recommendations.
          </p>
        </motion.div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Add New Debt</h2>
            <AddDebtForm onAddDebt={handleAddDebt} />
          </section>

          {debts.length > 0 && (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-4">Your Debts</h2>
                <DebtTable debts={debts} />
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Monthly Payment</h2>
                <div className="max-w-xs">
                  <Input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    className="text-lg"
                    min="0"
                  />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Repayment Strategy</h2>
                <StrategySelector
                  strategies={strategies}
                  selectedStrategy={selectedStrategy}
                  onSelectStrategy={setSelectedStrategy}
                />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Payoff Projection</h2>
                    <DebtChart debts={selectedStrategy.calculate(debts)} monthlyPayment={monthlyPayment} />
                  </section>
                </div>
                <div>
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Smart Insights</h2>
                    <AIRecommendations debts={debts} selectedStrategy={selectedStrategy} />
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;