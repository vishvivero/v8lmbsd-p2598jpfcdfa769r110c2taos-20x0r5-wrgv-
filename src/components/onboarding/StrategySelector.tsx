import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const strategies = [
  {
    id: "minimize-interest",
    name: "Minimize Interest",
  },
  {
    id: "reduce-loans",
    name: "Reduce Loan Count",
  },
  {
    id: "balanced",
    name: "Balanced Approach",
  }
];

interface StrategySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const StrategySelector = ({ value, onChange }: StrategySelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-4">
        {strategies.map((strategy) => (
          <Button
            key={strategy.id}
            variant={value === strategy.id ? "default" : "outline"}
            className={`h-auto py-3 ${
              value === strategy.id ? "bg-primary text-white" : ""
            }`}
            onClick={() => onChange(strategy.id)}
          >
            {strategy.name}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};