import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Debt, formatCurrency } from "@/lib/strategies";
import { motion } from "framer-motion";

interface DebtTableProps {
  debts: Debt[];
}

export const DebtTable = ({ debts }: DebtTableProps) => {
  return (
    <div className="rounded-lg border bg-white/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Debt Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Minimum Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.map((debt, index) => (
            <motion.tr
              key={debt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-muted/50"
            >
              <TableCell className="font-medium">{debt.name}</TableCell>
              <TableCell className="number-font">{formatCurrency(debt.balance)}</TableCell>
              <TableCell className="number-font">{debt.interestRate}%</TableCell>
              <TableCell className="number-font">{formatCurrency(debt.minimumPayment)}</TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};