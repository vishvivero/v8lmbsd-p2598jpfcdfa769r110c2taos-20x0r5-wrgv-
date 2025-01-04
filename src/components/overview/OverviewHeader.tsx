import { PlannerHeader } from "@/components/planner/PlannerHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";

interface OverviewHeaderProps {
  currencySymbol: string;
  onCurrencyChange: (currency: string) => void;
  showTip: boolean;
  setShowTip: (show: boolean) => void;
}

export const OverviewHeader = ({
  currencySymbol,
  onCurrencyChange,
  showTip,
  setShowTip,
}: OverviewHeaderProps) => {
  return (
    <>
      <PlannerHeader 
        currencySymbol={currencySymbol}
        onCurrencyChange={onCurrencyChange}
      />

      {showTip && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Alert className="bg-blue-50 border-blue-100">
            <LightbulbIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              You can customize your currency symbol, greeting, and more
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowTip(false)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </>
  );
};