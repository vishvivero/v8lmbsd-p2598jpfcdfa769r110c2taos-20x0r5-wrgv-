import { jsPDF } from 'jspdf';
import { Debt } from '@/lib/types';
import { formatDate } from './pdf/formatters';
import { 
  generateDebtSummaryTable, 
  generatePaymentDetailsTable,
  generateRepaymentScheduleTable
} from './pdf/tableGenerators';
import { Strategy } from '@/lib/strategies';

export const generateDebtOverviewPDF = (
  debts: Debt[],
  allocations: Map<string, number>,
  payoffDetails: { [key: string]: { months: number, redistributionHistory?: any[] } },
  totalMonthlyPayment: number,
  selectedStrategy: Strategy
) => {
  console.log('Generating PDF with:', {
    numberOfDebts: debts.length,
    totalMonthlyPayment,
    strategy: selectedStrategy.name,
    allocations: Array.from(allocations.entries())
  });

  const doc = new jsPDF();
  let currentY = 15;

  // Add title and date
  doc.setFontSize(20);
  doc.text('Debt Overview Report', 14, currentY);
  
  currentY += 10;
  doc.setFontSize(12);
  doc.text(`Generated on ${formatDate(new Date())}`, 14, currentY);
  doc.text(`Strategy: ${selectedStrategy.name}`, 14, currentY + 6);
  
  // Add debt summary section
  currentY += 20;
  doc.setFontSize(16);
  doc.text('Current Debt Summary', 14, currentY);
  currentY += 10;
  currentY = generateDebtSummaryTable(doc, debts, currentY);

  // Add payment details section
  currentY += 15;
  doc.setFontSize(16);
  doc.text('Payment Overview', 14, currentY);
  currentY += 10;
  currentY = generatePaymentDetailsTable(doc, debts, currentY, totalMonthlyPayment);

  // Add individual repayment schedules
  debts.forEach((debt, index) => {
    // Add new page for each debt's repayment schedule
    doc.addPage();
    currentY = 15;
    
    const monthlyAllocation = allocations.get(debt.id) || debt.minimum_payment;
    const details = payoffDetails[debt.id];
    const isHighPriorityDebt = index === 0; // First debt in sorted list is highest priority

    console.log(`Generating repayment schedule for ${debt.name}:`, {
      monthlyAllocation,
      months: details?.months,
      hasRedistributions: details?.redistributionHistory?.length > 0,
      isHighPriorityDebt
    });

    currentY = generateRepaymentScheduleTable(
      doc,
      debt,
      details,
      monthlyAllocation,
      isHighPriorityDebt,
      currentY
    );
  });

  return doc;
};

// Alias for backward compatibility
export const generatePayoffStrategyPDF = generateDebtOverviewPDF;

export const generateAmortizationPDF = (
  debt: Debt,
  payoffDetails: { months: number, redistributionHistory?: any[] }
) => {
  const doc = new jsPDF();
  let currentY = 15;

  // Add title and debt info
  doc.setFontSize(20);
  doc.text(`Amortization Schedule: ${debt.name}`, 14, currentY);
  
  currentY += 15;
  doc.setFontSize(12);
  doc.text(`Generated on ${formatDate(new Date())}`, 14, currentY);
  
  currentY += 20;
  currentY = generateRepaymentScheduleTable(
    doc,
    debt,
    payoffDetails,
    debt.minimum_payment,
    false,
    currentY
  );

  return doc;
};

export const generatePaymentTrendsPDF = (payments: any[]) => {
  const doc = new jsPDF();
  let currentY = 15;

  // Add title
  doc.setFontSize(20);
  doc.text('Payment Trends Report', 14, currentY);
  
  currentY += 15;
  doc.setFontSize(12);
  doc.text(`Generated on ${formatDate(new Date())}`, 14, currentY);
  
  currentY += 20;
  doc.setFontSize(16);
  doc.text('Payment History', 14, currentY);
  
  // Add payment history table
  currentY += 10;
  payments.forEach((payment) => {
    doc.setFontSize(12);
    doc.text(`${formatDate(new Date(payment.payment_date))}`, 14, currentY);
    doc.text(`${payment.currency_symbol}${payment.total_payment.toLocaleString()}`, 100, currentY);
    currentY += 10;
  });

  return doc;
};