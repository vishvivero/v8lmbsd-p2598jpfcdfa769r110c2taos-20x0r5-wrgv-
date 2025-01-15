import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";

export const StrategyHeader = () => {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-full bg-primary/10">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Payment Strategy
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Optimize your debt payoff journey
          </p>
        </div>
      </motion.div>
    </div>
  );
};