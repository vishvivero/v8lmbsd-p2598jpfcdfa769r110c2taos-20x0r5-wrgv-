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
    <div className="w-full max-w-md mx-auto px-4">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
          style={{ 
            width: `${(currentStep / totalSteps) * 100}%`,
          }}
        />
      </div>
      
      {/* Step Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col items-center transition-colors",
              step.id === currentStep && "text-primary font-medium",
              step.id < currentStep && "text-primary"
            )}
          >
            <span>{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};