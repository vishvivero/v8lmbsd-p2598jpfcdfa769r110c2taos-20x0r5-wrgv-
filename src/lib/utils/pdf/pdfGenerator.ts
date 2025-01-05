import { jsPDF } from 'jspdf';
import { Debt } from '@/lib/types';
import { formatDate } from './formatters';
import { 
  generateDebtSummaryTable, 
  generatePaymentDetailsTable,
  generatePayoffProjectionsTable 
} from './tableGenerators';

export const generateDebtOverviewPDF = (debts: Debt[]) => {
  const doc = new jsPDF();
  let currentY = 15;

  // Add title and date
  doc.setFontSize(20);
  doc.text('Debt Overview Report', 14, currentY);
  
  currentY += 10;
  doc.setFontSize(12);
  doc.text(`Generated on ${formatDate(new Date())}`, 14, currentY);
  
  // Add debt summary section
  currentY += 15;
  doc.setFontSize(16);
  doc.text('Current Debt Summary', 14, currentY);
  currentY += 10;
  currentY = generateDebtSummaryTable(doc, debts, currentY);

  // Add payment details section
  currentY += 15;
  doc.setFontSize(16);
  doc.text('Payment Overview', 14, currentY);
  currentY += 10;
  currentY = generatePaymentDetailsTable(doc, debts, currentY);

  // Add new page if needed
  if (currentY > 200) {
    doc.addPage();
    currentY = 15;
  }

  // Add payoff projections section
  currentY += 15;
  doc.setFontSize(16);
  doc.text('Payoff Projections', 14, currentY);
  currentY += 10;
  generatePayoffProjectionsTable(doc, debts, currentY);

  return doc;
};