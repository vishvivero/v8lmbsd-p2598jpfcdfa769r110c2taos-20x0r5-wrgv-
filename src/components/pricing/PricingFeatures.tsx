import { Check } from "lucide-react";

interface PricingFeaturesProps {
  features: string[];
  isPro?: boolean;
}

export const PricingFeatures = ({ features, isPro = false }: PricingFeaturesProps) => {
  return (
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className={`w-5 h-5 ${isPro ? 'text-primary' : 'text-gray-400'} mt-0.5`} />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
  );
};