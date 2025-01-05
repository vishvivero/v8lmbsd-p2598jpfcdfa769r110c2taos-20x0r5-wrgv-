import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types/debt";

interface AmortizationTableProps {
  debt: Debt;
  amortizationData: Array<{
    date: Date;
    startingBalance: number;
    payment: number;
    principal: number;
    interest: number;
    endingBalance: number;
  }>;
}

export const AmortizationTable = ({ debt, amortizationData }: AmortizationTableProps) => {
  console.log('Rendering amortization table with data:', { 
    debtId: debt.id,
    dataLength: amortizationData?.length,
    firstRow: amortizationData?.[0]
  });

  if (!amortizationData || amortizationData.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Amortization Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Starting Balance</TableHead>
                  <TableHead className="text-right">Payment</TableHead>
                  <TableHead className="text-right">Principal</TableHead>
                  <TableHead className="text-right">Interest</TableHead>
                  <TableHead className="text-right">Ending Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amortizationData.slice(0, 12).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(row.date, 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      {debt.currency_symbol}{row.startingBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.currency_symbol}{row.payment.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.currency_symbol}{row.principal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.currency_symbol}{row.interest.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {debt.currency_symbol}{row.endingBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};