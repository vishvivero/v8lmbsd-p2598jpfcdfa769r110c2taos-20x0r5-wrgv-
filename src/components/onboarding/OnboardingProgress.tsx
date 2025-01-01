import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { id: 1, name: "Get Started" },
  { id: 2, name: "Set a Plan" },
  { id: 3, name: "Finish" },
];

export const OnboardingProgress = ({ currentStep = 1 }: { currentStep?: number }) => {
  return (
    <div className="relative py-8">
      {/* Progress line */}
      <div className="absolute top-1/2 left-1/2 w-[60%] h-[1px] bg-gray-200 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative flex justify-center gap-x-[30%]">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center relative z-10"
          >
            <div
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                step.id === currentStep
                  ? "border-primary bg-primary text-white"
                  : step.id < currentStep
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300 bg-white text-gray-500"
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
                  ? "text-primary font-medium"
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