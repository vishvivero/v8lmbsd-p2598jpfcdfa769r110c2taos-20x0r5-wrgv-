import { Strategy } from "@/lib/strategies";
import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Target, Balance } from "lucide-react";

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
  const getStrategyIcon = (id: string) => {
    switch (id) {
      case 'avalanche':
        return <TrendingDown className="h-6 w-6" />;
      case 'snowball':
        return <Target className="h-6 w-6" />;
      case 'balance-ratio':
        return <Balance className="h-6 w-6" />;
      default:
        return <ArrowRight className="h-6 w-6" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {strategies.map((strategy, index) => (
        <motion.div
          key={strategy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectStrategy(strategy)}
          className={`
            cursor-pointer rounded-xl p-6 transition-all duration-200
            ${
              selectedStrategy.id === strategy.id
                ? "bg-primary text-white shadow-lg scale-[1.02]"
                : "bg-white hover:bg-primary/5"
            }
          `}
        >
          <div className="flex flex-col space-y-4">
            <div className={`
              p-3 rounded-full w-fit
              ${selectedStrategy.id === strategy.id 
                ? "bg-white/20" 
                : "bg-primary/10"}
            `}>
              {getStrategyIcon(strategy.id)}
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                selectedStrategy.id === strategy.id 
                  ? "text-white" 
                  : "text-gray-900"
              }`}>
                {strategy.name}
              </h3>
              <p className={`text-sm ${
                selectedStrategy.id === strategy.id 
                  ? "text-white/90" 
                  : "text-gray-600"
              }`}>
                {strategy.description}
              </p>
            </div>

            <div className={`
              flex items-center text-sm font-medium
              ${selectedStrategy.id === strategy.id 
                ? "text-white" 
                : "text-primary"}
            `}>
              Select Strategy
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};