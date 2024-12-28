import { Table, TableBody, TableFooter, TableRow, TableCell } from "@/components/ui/table";
import { Debt } from "@/lib/types/debt";
import { DebtTableHeader } from "./DebtTableHeader";
import { DebtTableRow } from "./DebtTableRow";
import { motion } from "framer-motion";

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
  const formatMoneyValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(value).replace('$', currencySymbol);
  };

  const formatInterestRate = (value: number) => {
    return value.toFixed(2) + '%';
  };

  // Calculate totals
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const totalInterest = Object.values(payoffDetails).reduce(
    (sum, detail) => sum + detail.totalInterest,
    0
  );
  const maxMonths = Math.max(
    ...Object.values(payoffDetails).map(detail => detail.months)
  );
  const latestPayoffDate = new Date(Math.max(
    ...Object.values(payoffDetails).map(detail => detail.payoffDate.getTime())
  ));

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
      <TableFooter>
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-muted/50 font-medium"
        >
          <TableCell className="text-center">Total</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-center number-font">
            {formatMoneyValue(totalBalance)}
          </TableCell>
          <TableCell className="text-center number-font">-</TableCell>
          <TableCell className="text-center number-font">
            {formatMoneyValue(totalMinPayment)}
          </TableCell>
          <TableCell className="text-center number-font">
            {formatMoneyValue(totalInterest)}
          </TableCell>
          <TableCell className="text-center number-font">
            {maxMonths} months
          </TableCell>
          <TableCell className="text-center number-font">
            {latestPayoffDate.toLocaleDateString('en-US', { 
              month: 'long',
              year: 'numeric'
            })}
          </TableCell>
          <TableCell></TableCell>
        </motion.tr>
      </TableFooter>
    </Table>
  );
};