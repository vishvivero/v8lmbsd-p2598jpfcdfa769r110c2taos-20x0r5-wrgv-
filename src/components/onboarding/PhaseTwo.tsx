import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface PhaseTwoProps {
  onNext: (data: { totalDebt: number }) => void;
}

export const PhaseTwo = ({ onNext }: PhaseTwoProps) => {
  const [totalDebt, setTotalDebt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDebt) {
      onNext({ totalDebt: parseFloat(totalDebt) });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">What's Your Total Debt?</h2>
        <p className="text-xl text-gray-600">
          Don't worry about being exact - you can adjust this later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="totalDebt" className="text-sm font-medium">
            Total Debt Amount
          </label>
          <Input
            id="totalDebt"
            type="number"
            placeholder="Enter amount"
            value={totalDebt}
            onChange={(e) => setTotalDebt(e.target.value)}
            className="text-2xl"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};