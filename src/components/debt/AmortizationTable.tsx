import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Debt } from "@/lib/types/debt";

interface AmortizationTableProps {
  debt: Debt;
  amortizationData: Array<{
    date: string;
    balance: number;
    balanceWithExtra?: number;
  }>;
}

export const AmortizationTable = ({ debt, amortizationData }: AmortizationTableProps) => {
  console.log('Rendering amortization table with data:', { 
    debtId: debt.id,
    dataLength: amortizationData.length,
    firstRow: amortizationData[0]
  });

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
                  <TableHead className="text-right">Balance</TableHead>
                  {amortizationData[0]?.balanceWithExtra !== undefined && (
                    <TableHead className="text-right">Balance with Extra Payment</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {amortizationData.slice(0, 12).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(row.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      {debt.currency_symbol}{row.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    {row.balanceWithExtra !== undefined && (
                      <TableCell className="text-right">
                        {debt.currency_symbol}{row.balanceWithExtra.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    )}
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