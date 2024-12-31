import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Payment Strategy</Label>
        <p className="text-gray-600">
          What is most important to you at this moment?
        </p>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="E.g., Reduce Number of Loans (Snowball Method)" />
        </SelectTrigger>
        <SelectContent>
          {strategies.map((strategy) => (
            <SelectItem key={strategy.id} value={strategy.id}>
              <div className="space-y-1">
                <div className="font-medium">{strategy.name}</div>
                <div className="text-sm text-gray-500">{strategy.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};