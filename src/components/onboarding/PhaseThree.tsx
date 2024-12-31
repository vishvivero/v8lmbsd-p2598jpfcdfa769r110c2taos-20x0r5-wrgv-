import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface PhaseThreeProps {
  onNext: (data: { monthlyPayment: number }) => void;
}

export const PhaseThree = ({ onNext }: PhaseThreeProps) => {
  const [monthlyPayment, setMonthlyPayment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monthlyPayment) {
      onNext({ monthlyPayment: parseFloat(monthlyPayment) });
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
        <h2 className="text-3xl font-bold mb-4">How Much Can You Pay Monthly?</h2>
        <p className="text-xl text-gray-600">
          This helps us create your personalized payment plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="monthlyPayment" className="text-sm font-medium">
            Monthly Payment Amount
          </label>
          <Input
            id="monthlyPayment"
            type="number"
            placeholder="Enter amount"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
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