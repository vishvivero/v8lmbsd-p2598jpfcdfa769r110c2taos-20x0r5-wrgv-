import { Debt } from "@/lib/types/debt";

export interface OverviewTabProps {
  debts: Debt[];
  handleDownloadReport: (reportType: string) => void;
}

export function OverviewTab({ debts, handleDownloadReport }: OverviewTabProps) {
  return (
    <div>
      <h2>Overview of Debts</h2>
      <button onClick={() => handleDownloadReport("overview")}>Download Report</button>
      <ul>
        {debts.map((debt) => (
          <li key={debt.id}>
            <span>{debt.name}</span> - <span>{debt.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
