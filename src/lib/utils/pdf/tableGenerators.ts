import { Debt } from '@/lib/types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, formatPercentage } from './formatters';

export const generateDebtSummaryTable = (doc: jsPDF, debts: Debt[], startY: number) => {
  const tableData = debts.map(debt => [
    debt.name,
    debt.banker_name,
    formatCurrency(debt.balance),
    formatPercentage(debt.interest_rate),
    formatCurrency(debt.minimum_payment),
    debt.next_payment_date ? formatDate(new Date(debt.next_payment_date)) : 'N/A'
  ]);

  autoTable(doc, {
    startY,
    head: [['Debt Name', 'Lender', 'Balance', 'Interest Rate', 'Min Payment', 'Next Payment']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [41, 37, 36] },
  });

  return (doc as any).lastAutoTable.finalY;
};

export const generatePaymentDetailsTable = (
  doc: jsPDF, 
  debts: Debt[], 
  startY: number
) => {
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length;

  const tableData = [
    ['Total Debt Balance', formatCurrency(totalBalance)],
    ['Total Minimum Monthly Payment', formatCurrency(totalMinPayment)],
    ['Average Interest Rate', formatPercentage(avgInterestRate)],
    ['Number of Active Debts', debts.length.toString()]
  ];

  autoTable(doc, {
    startY,
    body: tableData,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' }
    }
  });

  return (doc as any).lastAutoTable.finalY;
};

export const generatePayoffProjectionsTable = (
  doc: jsPDF,
  debts: Debt[],
  startY: number
) => {
  // Sort debts by projected payoff date (using interest rate as a proxy for now)
  const sortedDebts = [...debts].sort((a, b) => b.interest_rate - a.interest_rate);
  
  const tableData = sortedDebts.map(debt => {
    const monthlyInterest = (debt.balance * (debt.interest_rate / 100)) / 12;
    const monthsToPayoff = Math.ceil(debt.balance / (debt.minimum_payment - monthlyInterest));
    const projectedPayoffDate = new Date();
    projectedPayoffDate.setMonth(projectedPayoffDate.getMonth() + monthsToPayoff);

    return [
      debt.name,
      formatCurrency(monthlyInterest),
      monthsToPayoff.toString(),
      formatDate(projectedPayoffDate)
    ];
  });

  autoTable(doc, {
    startY,
    head: [['Debt Name', 'Monthly Interest', 'Months to Payoff', 'Projected Payoff Date']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [41, 37, 36] }
  });

  return (doc as any).lastAutoTable.finalY;
};