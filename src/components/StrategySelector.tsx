import { Strategy } from "@/lib/strategies";
import { motion } from "framer-motion";

interface StrategySelectorProps {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  onSelectStrategy: (strategy: Strategy) => void;
}

export const StrategySelector = ({
  strategies,
  selectedStrategy,
  onSelectStrategy,
}: StrategySelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {strategies.map((strategy, index) => (
        <motion.div
          key={strategy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`strategy-card ${
            selectedStrategy.id === strategy.id ? "active" : ""
          }`}
          onClick={() => onSelectStrategy(strategy)}
        >
          <h3 className="text-lg font-semibold mb-2">{strategy.name}</h3>
          <p className="text-sm text-gray-600">{strategy.description}</p>
        </motion.div>
      ))}
    </div>
  );
};