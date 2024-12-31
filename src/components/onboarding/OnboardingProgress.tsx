import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { id: 1, name: "Get Started" },
  { id: 2, name: "Set a Plan" },
  { id: 3, name: "Review" },
];

export const OnboardingProgress = ({ currentStep = 1 }: { currentStep?: number }) => {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                step.id === currentStep
                  ? "border-primary bg-primary text-white"
                  : step.id < currentStep
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {step.id < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                step.id === currentStep
                  ? "text-primary"
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