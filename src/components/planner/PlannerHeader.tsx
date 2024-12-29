import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface PlannerHeaderProps {
  currencySymbol: string;
  onCurrencyChange: (value: string) => void;
}

export const PlannerHeader = ({ currencySymbol, onCurrencyChange }: PlannerHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex justify-end">
        <Select
          value={currencySymbol}
          onValueChange={onCurrencyChange}
        >
          <SelectTrigger className="w-[120px] bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800 hover:bg-white/90">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg">
            <SelectItem value="£">GBP (£)</SelectItem>
            <SelectItem value="$">USD ($)</SelectItem>
            <SelectItem value="€">EUR (€)</SelectItem>
            <SelectItem value="¥">JPY (¥)</SelectItem>
            <SelectItem value="₹">INR (₹)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left"
      >
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Debt Freedom Planner
        </h1>
        <p className="text-gray-600 mt-2">
          Create your personalized debt payoff strategy
        </p>
      </motion.div>
    </div>
  );
};