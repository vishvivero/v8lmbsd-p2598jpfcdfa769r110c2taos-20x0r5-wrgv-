import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Debt } from '@/lib/types';
import { Strategy } from '@/lib/strategies';
import { generateMonthlySchedule } from './scheduleCalculator';
import { formatCurrency } from './formatters';
import { DebtStatus } from '../payment/types';

export const generatePayoffStrategyPDF = (
  debts: Debt[],
  allocations: Map<string, number>,
  payoffDetails: { [key: string]: DebtStatus },
  totalMonthlyPayment: number,
  strategy: Strategy
) => {
  const doc = new jsPDF();
  
  // Add title and strategy info
  doc.setFontSize(20);
  doc.text('Debt Payoff Strategy Report', 14, 15);
  doc.setFontSize(12);
  doc.text(`Strategy: ${strategy.name}`, 14, 25);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);
  doc.text(`Total Monthly Payment: ${formatCurrency(totalMonthlyPayment)}`, 14, 39);

  // Add summary table with redistribution info
  const summaryData = debts.map(debt => {
    const details = payoffDetails[debt.id];
    const redistributionCount = details.redistributionHistory?.length || 0;
    const totalRedistributed = details.redistributionHistory?.reduce((sum, r) => sum + r.amount, 0) || 0;

    return [
      debt.name,
      formatCurrency(debt.balance),
      `${debt.interest_rate}%`,
      formatCurrency(debt.minimum_payment),
      formatCurrency(allocations.get(debt.id) || debt.minimum_payment),
      details.payoffDate.toLocaleDateString(),
      formatCurrency(details.totalInterest),
      redistributionCount > 0 ? `${redistributionCount} (${formatCurrency(totalRedistributed)})` : '-'
    ];
  });

  autoTable(doc, {
    startY: 47,
    head: [['Debt Name', 'Balance', 'Rate', 'Min Payment', 'Allocated', 'Payoff Date', 'Total Interest', 'Redistributions']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [0, 124, 176] },
  });

  // Add payment redistribution explanation
  let currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Payment Redistribution Strategy', 14, currentY);
  currentY += 10;
  doc.setFontSize(10);
  doc.text(`When a debt is paid off, its minimum payment (shown as "Released Payment" below)`, 14, currentY);
  currentY += 7;
  doc.text(`will be redistributed to the next highest priority debt based on the ${strategy.name} strategy.`, 14, currentY);
  currentY += 15;

  // Add monthly payment schedule for each debt with redistribution details
  debts.forEach((debt, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.text(`${debt.name} - Monthly Payment Schedule`, 14, currentY);
    currentY += 10;

    const monthlyData = generateMonthlySchedule(
      debt,
      allocations.get(debt.id) || debt.minimum_payment,
      payoffDetails[debt.id].months,
      debts,
      index,
      payoffDetails
    );

    autoTable(doc, {
      startY: currentY,
      head: [['Month', 'Payment', 'Principal', 'Interest', 'Remaining', 'Released Payment', 'Redistributed From']],
      body: monthlyData,
      theme: 'striped',
      headStyles: { fillColor: [0, 124, 176] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 'auto' }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  });

  return doc;
};