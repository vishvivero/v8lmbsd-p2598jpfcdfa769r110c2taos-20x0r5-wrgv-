import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Debt } from '@/lib/types/debt';
import { Strategy } from '@/lib/strategies';
import { format, addMonths } from 'date-fns';

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

export const generatePayoffStrategyPDF = (
  debts: Debt[],
  allocations: Map<string, number>,
  payoffDetails: { [key: string]: any },
  totalMonthlyPayment: number,
  strategy: Strategy
) => {
  const doc = new jsPDF();
  
  // Add title and strategy info
  doc.setFontSize(20);
  doc.text('Debt Payoff Strategy Report', 14, 15);
  doc.setFontSize(12);
  doc.text(`Strategy: ${strategy.name}`, 14, 25);
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 32);
  doc.text(`Total Monthly Payment: ${formatCurrency(totalMonthlyPayment)}`, 14, 39);

  // Add summary table
  const summaryData = debts.map(debt => [
    debt.name,
    formatCurrency(debt.balance),
    `${debt.interest_rate}%`,
    formatCurrency(debt.minimum_payment),
    formatCurrency(allocations.get(debt.id) || debt.minimum_payment),
    format(payoffDetails[debt.id].payoffDate, 'MMM yyyy'),
    formatCurrency(payoffDetails[debt.id].totalInterest)
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Debt Name', 'Balance', 'Rate', 'Min Payment', 'Allocated', 'Payoff Date', 'Total Interest']],
    body: summaryData,
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

  // Add monthly payment schedule for each debt
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
      index
    );

    autoTable(doc, {
      startY: currentY,
      head: [['Month', 'Payment', 'Principal', 'Interest', 'Remaining', 'Released Payment', 'Redistributed From']],
      body: monthlyData,
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
  });

  return doc;
};

const generateMonthlySchedule = (
  debt: Debt,
  monthlyPayment: number,
  totalMonths: number,
  allDebts: Debt[],
  debtIndex: number
): string[][] => {
  const schedule: string[][] = [];
  let balance = debt.balance;
  let currentDate = new Date();
  const monthlyRate = debt.interest_rate / 1200;
  let releasedPayments = new Map<string, number>();
  let redistributedAmount = 0;

  // Track which debts are paid off in which month
  const paidOffDebts = new Map<number, Debt>();

  for (let month = 1; month <= totalMonths && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let actualPayment = monthlyPayment;
    
    // Add any redistributed payments from previously paid off debts
    const redistributedFrom: string[] = [];
    paidOffDebts.forEach((paidDebt, paidMonth) => {
      if (paidMonth < month && debtIndex > allDebts.indexOf(paidDebt)) {
        redistributedAmount += paidDebt.minimum_payment;
        redistributedFrom.push(paidDebt.name);
      }
    });
    
    actualPayment += redistributedAmount;
    const principal = Math.min(actualPayment - interest, balance);
    balance = Math.max(0, balance - principal);

    // Check if this debt is being paid off this month
    const isPayingOff = balance <= 0.01;
    if (isPayingOff) {
      paidOffDebts.set(month, debt);
      releasedPayments.set(debt.name, debt.minimum_payment);
    }

    schedule.push([
      format(addMonths(currentDate, month - 1), 'MMM yyyy'),
      formatCurrency(actualPayment),
      formatCurrency(principal),
      formatCurrency(interest),
      formatCurrency(balance),
      isPayingOff ? formatCurrency(debt.minimum_payment) : '-',
      redistributedFrom.length > 0 ? redistributedFrom.join(', ') : '-'
    ]);

    if (balance <= 0.01) break;
  }

  return schedule;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};