import { PlannerHeader } from "@/components/planner/PlannerHeader";

interface OverviewHeaderProps {
  currencySymbol: string;
  onCurrencyChange: (currency: string) => void;
}

export const OverviewHeader = ({
  currencySymbol,
  onCurrencyChange,
}: OverviewHeaderProps) => {
  return (
    <PlannerHeader 
      currencySymbol={currencySymbol}
      onCurrencyChange={onCurrencyChange}
    />
  );
};