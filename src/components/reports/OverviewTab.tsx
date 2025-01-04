import { Debt } from "@/lib/types/debt";
import { Card } from "@/components/ui/card";
import { DebtOverviewChart } from "./DebtOverviewChart";

export interface OverviewTabProps {
  debts: Debt[];
  handleDownloadReport: (reportType: string) => void;
}

export function OverviewTab({ debts, handleDownloadReport }: OverviewTabProps) {
  return (
    <Card>
      <h2 className="text-lg font-bold">Debt Overview</h2>
      <DebtOverviewChart debts={debts} />
      <button
        onClick={() => handleDownloadReport("overview")}
        className="mt-4 btn"
      >
        Download Overview Report
      </button>
    </Card>
  );
}