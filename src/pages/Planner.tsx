import { AddDebtForm } from "@/components/AddDebtForm";
import { DebtTable } from "@/components/DebtTable";
import { StrategySelector } from "@/components/StrategySelector";
import { DebtChart } from "@/components/DebtChart";
import { AIRecommendations } from "@/components/AIRecommendations";
import { useState } from "react";
import { Debt, Strategy, strategies } from "@/lib/strategies";
import { motion } from "framer-motion";

const Planner = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(strategies[0]);
  const [monthlyPayment, setMonthlyPayment] = useState(500);

  const handleAddDebt = (newDebt: Omit<Debt, "id">) => {
    const debt: Debt = {
      ...newDebt,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDebts([...debts, debt]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight">Debt Freedom Planner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add your debts, choose a strategy, and let our AI help you create the perfect payoff plan.
          </p>
        </motion.div>

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
              <h2 className="text-2xl font-semibold mb-4">Choose Your Strategy</h2>
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
                  <h2 className="text-2xl font-semibold mb-4">AI Insights</h2>
                  <AIRecommendations debts={debts} selectedStrategy={selectedStrategy} />
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;