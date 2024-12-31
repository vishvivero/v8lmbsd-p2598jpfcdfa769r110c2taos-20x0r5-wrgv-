import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PhaseOneProps {
  onNext: () => void;
}

export const PhaseOne = ({ onNext }: PhaseOneProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8 text-center"
    >
      <h2 className="text-3xl font-bold">Welcome to Your Debt-Free Journey</h2>
      <p className="text-xl text-gray-600">
        Let's start by understanding your current financial situation.
      </p>
      <Button 
        onClick={onNext}
        size="lg"
        className="mt-8"
      >
        Let's Begin <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};