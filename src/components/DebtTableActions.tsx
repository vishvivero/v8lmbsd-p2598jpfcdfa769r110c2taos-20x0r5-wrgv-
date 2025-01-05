import { DecimalToggle } from "./DecimalToggle";
import { Button } from "./ui/button";
import { FileDown } from "lucide-react";

interface DebtTableActionsProps {
  showDecimals: boolean;
  onToggleDecimals: (value: boolean) => void;
  onDownloadPDF: () => void;
}

export const DebtTableActions = ({
  showDecimals,
  onToggleDecimals,
  onDownloadPDF
}: DebtTableActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <DecimalToggle showDecimals={showDecimals} onToggle={onToggleDecimals} />
      <Button 
        onClick={onDownloadPDF}
        className="bg-primary hover:bg-primary/90 flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Download Overview Report
      </Button>
    </div>
  );
};