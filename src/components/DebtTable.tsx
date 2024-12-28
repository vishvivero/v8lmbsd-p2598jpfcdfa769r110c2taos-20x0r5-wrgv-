import { Table, TableBody } from "@/components/ui/table";
import { Debt } from "@/lib/types/debt";
import { DebtTableHeader } from "./DebtTableHeader";
import { DebtTableRow } from "./DebtTableRow";

interface DebtTableProps {
  debts: Debt[];
  payoffDetails: {
    [key: string]: {
      months: number;
      totalInterest: number;
      payoffDate: Date;
    };
  };
  onUpdateDebt: (updatedDebt: Debt) => void;
  onDeleteClick: (debt: Debt) => void;
  showDecimals: boolean;
  currencySymbol: string;
}

export const DebtTable = ({
  debts,
  payoffDetails,
  onUpdateDebt,
  onDeleteClick,
  showDecimals,
  currencySymbol
}: DebtTableProps) => {
  return (
    <Table>
      <DebtTableHeader />
      <TableBody>
        {debts.map((debt, index) => (
          <DebtTableRow
            key={debt.id}
            debt={debt}
            index={index}
            payoffDetails={payoffDetails[debt.id]}
            onUpdateDebt={onUpdateDebt}
            onDeleteClick={onDeleteClick}
            showDecimals={showDecimals}
            currencySymbol={currencySymbol}
          />
        ))}
      </TableBody>
    </Table>
  );
};