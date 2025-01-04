import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Debt } from '@/lib/types/debt';
import { format } from 'date-fns';

export const generateDebtOverviewPDF = (debts: Debt[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Debt Overview Report', 14, 15);
  doc.setFontSize(11);
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 25);

  // Create table data
  const tableData = debts.map(debt => [
    debt.name,
    debt.banker_name,
    `${debt.currency_symbol}${debt.balance.toLocaleString()}`,
    `${debt.interest_rate}%`,
    `${debt.currency_symbol}${debt.minimum_payment.toLocaleString()}`
  ]);

  // Add table
  autoTable(doc, {
    head: [['Debt Name', 'Lender', 'Balance', 'Interest Rate', 'Min. Payment']],
    body: tableData,
    startY: 35,
  });

  return doc;
};

export const generateAmortizationPDF = (debt: Debt, payoffDetails: any) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Amortization Schedule', 14, 15);
  doc.setFontSize(11);
  doc.text(`For: ${debt.name}`, 14, 25);
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 30);

  // Add debt details
  doc.text(`Original Balance: ${debt.currency_symbol}${debt.balance.toLocaleString()}`, 14, 40);
  doc.text(`Interest Rate: ${debt.interest_rate}%`, 14, 45);
  doc.text(`Monthly Payment: ${debt.currency_symbol}${debt.minimum_payment.toLocaleString()}`, 14, 50);
  doc.text(`Estimated Payoff Date: ${format(payoffDetails.payoffDate, 'MMMM d, yyyy')}`, 14, 55);
  doc.text(`Total Interest: ${debt.currency_symbol}${payoffDetails.totalInterest.toLocaleString()}`, 14, 60);

  return doc;
};

export const generatePaymentTrendsPDF = (payments: any[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Payment Trends Report', 14, 15);
  doc.setFontSize(11);
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 25);

  // Create table data
  const tableData = payments.map(payment => [
    format(new Date(payment.payment_date), 'MMM d, yyyy'),
    `${payment.currency_symbol}${payment.total_payment.toLocaleString()}`
  ]);

  // Add table
  autoTable(doc, {
    head: [['Payment Date', 'Amount']],
    body: tableData,
    startY: 35,
  });

  return doc;
};