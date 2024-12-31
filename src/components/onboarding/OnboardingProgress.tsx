import { motion } from "framer-motion";

const steps = [
  { id: 1, name: "Get Started" },
  { id: 2, name: "Set a Plan" },
  { id: 3, name: "Review" },
];

export const OnboardingProgress = ({ currentStep = 1 }: { currentStep?: number }) => {
  return (
    <nav className="w-full bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center"
            >
              <div
                className={`flex items-center ${
                  index !== steps.length - 1 ? "w-full" : ""
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.id === currentStep
                      ? "border-primary bg-primary text-white"
                      : step.id < currentStep
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step.id}
                </span>
                <span
                  className={`ml-3 text-sm font-medium ${
                    step.id === currentStep
                      ? "text-primary"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-full mx-4 h-0.5 bg-gray-200"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </nav>
  );
};