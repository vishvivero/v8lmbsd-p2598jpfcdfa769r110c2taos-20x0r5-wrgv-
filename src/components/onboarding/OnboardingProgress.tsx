import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { id: 1, name: "Add Debts" },
  { id: 2, name: "Select Strategy" },
  { id: 3, name: "Create Account" },
];

export const OnboardingProgress = ({ currentStep = 1 }: { currentStep?: number }) => {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-[15%] w-[70%] h-0.5 bg-gray-200 -translate-y-1/2" />
      
      <div className="relative flex justify-between max-w-md mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center relative z-10"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                step.id === currentStep
                  ? "bg-blue-600 text-white"
                  : step.id < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-white border-2 border-gray-300 text-gray-500"
              }`}
            >
              {step.id < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm">{step.id}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm ${
                step.id === currentStep
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};