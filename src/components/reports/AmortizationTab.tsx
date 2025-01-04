import { Debt } from "@/lib/types/debt";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export interface AmortizationTabProps {
  debts: Debt[];
  handleDownloadReport: (reportType: string) => void;
}

export function AmortizationTab({ debts, handleDownloadReport }: AmortizationTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Amortization Schedule</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadReport("Amortization")}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Schedule
        </Button>
      </div>

      <div className="grid gap-4">
        {debts.map((debt) => (
          <Card key={debt.id} className="p-4">
            <h3 className="font-semibold mb-4">{debt.name}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment #</TableHead>
                  <TableHead>Payment Amount</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateAmortization(debt).map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{payment.number}</TableCell>
                    <TableCell>{formatCurrency(payment.payment)}</TableCell>
                    <TableCell>{formatCurrency(payment.principal)}</TableCell>
                    <TableCell>{formatCurrency(payment.interest)}</TableCell>
                    <TableCell>{formatCurrency(payment.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    </div>
  );
}

function calculateAmortization(debt: Debt) {
  const monthlyRate = (debt.interestRate || 0) / 12 / 100;
  const numberOfPayments = debt.term || 12;
  const loanAmount = debt.amount || 0;

  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const schedule = [];
  let balance = loanAmount;

  for (let i = 1; i <= numberOfPayments; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance = balance - principal;

    schedule.push({
      number: i,
      payment: monthlyPayment,
      principal: principal,
      interest: interest,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}