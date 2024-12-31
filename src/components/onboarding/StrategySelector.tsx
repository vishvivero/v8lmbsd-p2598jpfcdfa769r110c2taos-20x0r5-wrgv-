import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const strategies = [
  {
    id: "minimize-interest",
    name: "Minimize Interest",
    description: "Focus on high-interest debts first (Avalanche Method)"
  },
  {
    id: "reduce-loans",
    name: "Reduce Loan Count",
    description: "Pay off smaller debts first (Snowball Method)"
  },
  {
    id: "balanced",
    name: "Balanced Approach",
    description: "Distribute payments proportionally across all debts"
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
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label className="text-lg font-semibold">What is most important to you at this moment?</Label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {strategies.map((strategy) => (
          <Button
            key={strategy.id}
            variant={value === strategy.id ? "default" : "outline"}
            className={`h-auto p-6 flex flex-col items-start space-y-2 ${
              value === strategy.id ? "border-primary bg-primary text-white" : ""
            }`}
            onClick={() => onChange(strategy.id)}
          >
            <span className="text-lg font-semibold">{strategy.name}</span>
            <span className={`text-sm ${value === strategy.id ? "text-white/90" : "text-gray-500"}`}>
              {strategy.description}
            </span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};