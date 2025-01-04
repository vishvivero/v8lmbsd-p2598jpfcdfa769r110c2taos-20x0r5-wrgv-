import { Debt } from "@/lib/types/debt";

export interface AmortizationTabProps {
  debts: Debt[];
  handleDownloadReport: (reportType: string) => void;
}

export function AmortizationTab({ debts, handleDownloadReport }: AmortizationTabProps) {
  return (
    <div>
      <h2>Amortization Report</h2>
      <button onClick={() => handleDownloadReport("amortization")}>
        Download Amortization Report
      </button>
      <table>
        <thead>
          <tr>
            <th>Debt ID</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt) => (
            <tr key={debt.id}>
              <td>{debt.id}</td>
              <td>{debt.amount}</td>
              <td>{debt.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
