import { Debt } from '@/lib/types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, formatPercentage } from './formatters';
import { generateMonthlySchedule } from './scheduleCalculator';

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
  startY: number,
  monthlyPayment: number
) => {
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length;

  const tableData = [
    ['Total Debt Balance', formatCurrency(totalBalance)],
    ['Monthly Payment Allocation', formatCurrency(monthlyPayment)],
    ['Total Minimum Monthly Payment', formatCurrency(totalMinPayment)],
    ['Extra Payment Available', formatCurrency(monthlyPayment - totalMinPayment)],
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
  payoffDetails: { months: number, redistributionHistory?: any[] },
  monthlyAllocation: number,
  isHighPriorityDebt: boolean,
  startY: number
) => {
  // Add debt header
  doc.setFontSize(14);
  doc.text(`Repayment Schedule: ${debt.name}`, 14, startY);
  startY += 6;
  
  // Add debt details
  doc.setFontSize(10);
  doc.text(`Current Balance: ${formatCurrency(debt.balance)}`, 14, startY);
  doc.text(`Interest Rate: ${formatPercentage(debt.interest_rate)}`, 14, startY + 5);
  doc.text(`Monthly Allocation: ${formatCurrency(monthlyAllocation)}`, 14, startY + 10);
  doc.text(`Priority Status: ${isHighPriorityDebt ? 'High Priority' : 'Standard Priority'}`, 14, startY + 15);
  startY += 25;

  // Generate monthly schedule data
  const scheduleData = generateMonthlySchedule(
    debt,
    payoffDetails,
    monthlyAllocation,
    isHighPriorityDebt
  );

  autoTable(doc, {
    startY,
    head: [
      [
        'Payment Date',
        'Payment Amount',
        'Principal',
        'Interest',
        'Remaining Balance',
        'Redistributed Amount',
        'Has Redistribution'
      ]
    ],
    body: scheduleData,
    theme: 'striped',
    headStyles: { fillColor: [41, 37, 36] },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 }
  });

  return (doc as any).lastAutoTable.finalY;
};