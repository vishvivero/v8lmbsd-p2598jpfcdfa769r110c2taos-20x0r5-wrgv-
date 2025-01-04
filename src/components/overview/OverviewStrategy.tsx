import { motion } from "framer-motion";
import { StrategySelector } from "@/components/StrategySelector";
import { Strategy } from "@/lib/strategies";

interface OverviewStrategyProps {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  onSelectStrategy: (strategy: Strategy) => void;
}

export const OverviewStrategy = ({
  strategies,
  selectedStrategy,
  onSelectStrategy,
}: OverviewStrategyProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Choose Your Strategy</h2>
      <StrategySelector
        strategies={strategies}
        selectedStrategy={selectedStrategy}
        onSelectStrategy={onSelectStrategy}
      />
    </motion.section>
  );
};