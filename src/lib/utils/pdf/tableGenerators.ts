import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Debt } from '@/lib/types';
import { formatCurrency, formatDate, formatPercentage } from './formatters';
import { PayoffDetails } from '@/lib/calculations';

export const generateDebtSummaryTable = (doc: jsPDF, debts: Debt[], startY: number): number => {
  const tableData = debts.map(debt => [
    debt.name,
    debt.banker_name,
    formatCurrency(debt.balance, debt.currency_symbol),
    formatPercentage(debt.interest_rate),
    formatCurrency(debt.minimum_payment, debt.currency_symbol),
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
  startY: number,
  monthlyPayment: number
): number => {
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length;
  const currencySymbol = debts[0]?.currency_symbol || '£';

  const tableData = [
    ['Total Debt Balance', formatCurrency(totalBalance, currencySymbol)],
    ['Monthly Payment Allocation', formatCurrency(monthlyPayment, currencySymbol)],
    ['Total Minimum Monthly Payment', formatCurrency(totalMinPayment, currencySymbol)],
    ['Extra Payment Available', formatCurrency(monthlyPayment - totalMinPayment, currencySymbol)],
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

export const generateRepaymentScheduleTable = (
  doc: jsPDF,
  debt: Debt,
  payoffDetails: PayoffDetails,
  monthlyAllocation: number,
  isHighPriorityDebt: boolean,
  startY: number
): number => {
  // Add debt header
  doc.setFontSize(14);
  doc.text(`Repayment Schedule: ${debt.name}`, 14, startY);
  startY += 6;
  
  // Add debt details
  doc.setFontSize(10);
  doc.text(`Current Balance: ${formatCurrency(debt.balance, debt.currency_symbol)}`, 14, startY);
  doc.text(`Interest Rate: ${formatPercentage(debt.interest_rate)}`, 14, startY + 5);
  doc.text(`Monthly Allocation: ${formatCurrency(monthlyAllocation, debt.currency_symbol)}`, 14, startY + 10);
  doc.text(`Priority Status: ${isHighPriorityDebt ? 'High Priority' : 'Standard Priority'}`, 14, startY + 15);
  startY += 25;

  const scheduleData = payoffDetails.schedule.map(entry => [
    formatDate(new Date(entry.date)),
    formatCurrency(entry.payment, debt.currency_symbol),
    formatCurrency(entry.principal, debt.currency_symbol),
    formatCurrency(entry.interest, debt.currency_symbol),
    formatCurrency(entry.remainingBalance, debt.currency_symbol),
    entry.redistributedAmount ? formatCurrency(entry.redistributedAmount, debt.currency_symbol) : '-',
    entry.hasRedistribution ? 'Yes' : 'No'
  ]);

  autoTable(doc, {
    startY,
    head: [['Payment Date', 'Payment', 'Principal', 'Interest', 'Balance', 'Redistributed', 'Has Redistribution']],
    body: scheduleData,
    theme: 'striped',
    headStyles: { fillColor: [41, 37, 36] },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 }
  });

  return (doc as any).lastAutoTable.finalY;
};