import { TableCell, TableRow } from "@/components/ui/table";
import { Debt } from "@/lib/types/debt";

interface DebtTableFooterProps {
  debts: Debt[];
  monthlyPayment: number;
  payoffDetails: any;
  formatMoneyValue: (value: number) => string;
}

export const DebtTableFooter = ({
  debts,
  monthlyPayment,
  payoffDetails,
  formatMoneyValue,
}: DebtTableFooterProps) => {
  const totals = debts.reduce(
    (acc, debt) => {
      const details = payoffDetails[debt.id] || { 
        totalInterest: 0, 
        proposedPayment: debt.minimum_payment 
      };
      
      return {
        balance: acc.balance + debt.balance,
        minimumPayment: acc.minimumPayment + debt.minimum_payment,
        totalInterest: acc.totalInterest + details.totalInterest,
      };
    },
    { balance: 0, minimumPayment: 0, totalInterest: 0 }
  );

  return (
    <TableRow className="font-bold bg-muted/20">
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell className="number-font">{formatMoneyValue(totals.balance)}</TableCell>
      <TableCell>-</TableCell>
      <TableCell className="number-font">{formatMoneyValue(totals.minimumPayment)}</TableCell>
      <TableCell className="number-font">{formatMoneyValue(monthlyPayment)}</TableCell>
      <TableCell className="number-font">{formatMoneyValue(totals.totalInterest)}</TableCell>
      <TableCell colSpan={3}>-</TableCell>
    </TableRow>
  );
};