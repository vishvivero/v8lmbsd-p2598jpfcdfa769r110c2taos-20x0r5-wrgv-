import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface PhaseFourProps {
  onNext: (data: { strategy: string }) => void;
}

export const PhaseFour = ({ onNext }: PhaseFourProps) => {
  const [strategy, setStrategy] = useState("avalanche");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ strategy });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Repayment Strategy</h2>
        <p className="text-xl text-gray-600">
          Select the method that best fits your goals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup
          defaultValue="avalanche"
          onValueChange={setStrategy}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="avalanche" id="avalanche" />
            <Label htmlFor="avalanche" className="flex-1 cursor-pointer">
              <div className="font-medium">Debt Avalanche</div>
              <div className="text-sm text-gray-500">
                Pay off highest interest debts first (saves the most money)
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="snowball" id="snowball" />
            <Label htmlFor="snowball" className="flex-1 cursor-pointer">
              <div className="font-medium">Debt Snowball</div>
              <div className="text-sm text-gray-500">
                Pay off smallest debts first (builds momentum)
              </div>
            </Label>
          </div>
        </RadioGroup>

        <Button type="submit" size="lg" className="w-full">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};