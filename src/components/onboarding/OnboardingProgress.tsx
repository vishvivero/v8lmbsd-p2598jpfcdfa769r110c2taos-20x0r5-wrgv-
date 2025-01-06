import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const steps = [
    { id: 1, name: "Welcome" },
    { id: 2, name: "Why Debtfreeo?" },
    { id: 3, name: "Features" },
    { id: 4, name: "Demo" },
    { id: 5, name: "Sign Up" },
  ];

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-[15%] w-[70%] h-0.5 bg-gray-200 -translate-y-1/2" />
      
      <div className="relative flex justify-between max-w-md mx-auto">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center relative z-10"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                step.id === currentStep
                  ? "bg-primary text-white"
                  : step.id < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-white border-2 border-gray-300 text-gray-500"
              )}
            >
              {step.id < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm">{step.id}</span>
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-xs",
                step.id === currentStep
                  ? "text-primary font-medium"
                  : "text-gray-500"
              )}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};