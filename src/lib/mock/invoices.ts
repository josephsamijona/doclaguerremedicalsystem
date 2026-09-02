import {
  Invoice,
  InvoiceStatus,
  DocumentType,
  PaymentTransaction,
  CashRegisterSession,
} from "@/src/types";
import { mockPatients } from "./patients";
import { mockInsurers } from "./insurers";

export const EXCHANGE_RATE_USD_HTG = 132.50;

export const mockInvoices: Invoice[] = [];

// Generate ~90 Invoices / Quotes / Receipts / Credit Notes
for (let i = 0; i < 90; i++) {
  const patient = mockPatients[i % mockPatients.length];
  const insurer = patient.insuranceProviderId ? mockInsurers.find(ins => ins.id === patient.insuranceProviderId) : undefined;
  
  let docType: DocumentType = "Invoice";
  if (i === 10 || i === 25 || i === 42) docType = "Quote";
  else if (i === 15 || i === 35) docType = "Receipt";
  else if (i === 60 || i === 75) docType = "Credit Note";

  const isQuote = docType === "Quote";
  const isCredit = docType === "Credit Note";

  const framePrice = 16000 + (i % 6) * 3500;
  const lensPrice = 8500 + (i % 4) * 4000;
  const examFee = 3500;
  const coatingFee = 2500;

  const items = isCredit ? [
    {
      id: `LI-${i}-1`,
      description: "Credit Return: Frame restocking refund",
      category: "Frame" as const,
      quantity: 1,
      unitPriceHTG: -16000,
      discountHTG: 0,
      taxPercent: 0,
      totalHTG: -16000,
    }
  ] : [
    {
      id: `LI-${i}-1`,
      description: "Comprehensive Optometric Examination & Refraction",
      category: "Clinical Act" as const,
      quantity: 1,
      unitPriceHTG: examFee,
      discountHTG: 0,
      taxPercent: 0,
      totalHTG: examFee,
    },
    {
      id: `LI-${i}-2`,
      description: `Designer Frame: Ray-Ban / Tom Ford Optical Frame`,
      category: "Frame" as const,
      quantity: 1,
      unitPriceHTG: framePrice,
      discountHTG: i % 5 === 0 ? 1500 : 0,
      taxPercent: 10,
      totalHTG: (framePrice - (i % 5 === 0 ? 1500 : 0)) * 1.10,
    },
    {
      id: `LI-${i}-3`,
      description: `Prescription Lenses: Progressive Anti-Reflective Crizal`,
      category: "Lenses" as const,
      quantity: 2,
      unitPriceHTG: lensPrice / 2,
      discountHTG: 0,
      taxPercent: 10,
      totalHTG: lensPrice * 1.10,
    },
    {
      id: `LI-${i}-4`,
      description: `Blue Light UV400 Protection Coating Treatment`,
      category: "Coatings" as const,
      quantity: 2,
      unitPriceHTG: coatingFee / 2,
      discountHTG: 0,
      taxPercent: 10,
      totalHTG: coatingFee * 1.10,
    },
  ];

  const subtotalHTG = items.reduce((acc, item) => acc + (item.quantity * item.unitPriceHTG) - item.discountHTG, 0);
  const taxTotalHTG = Math.round(items.reduce((acc, item) => acc + (item.totalHTG - (item.quantity * item.unitPriceHTG - item.discountHTG)), 0));
  const totalHTG = subtotalHTG + taxTotalHTG;

  let insurerShareHTG = 0;
  let patientShareHTG = totalHTG;

  if (insurer && !isCredit && !isQuote) {
    insurerShareHTG = Math.round(totalHTG * (insurer.standardCoveragePercent / 100));
    patientShareHTG = totalHTG - insurerShareHTG;
  }

  let status: InvoiceStatus = "Paid";
  let amountPaidHTG = totalHTG;
  let balanceDueHTG = 0;

  if (isQuote) {
    status = "Draft";
    amountPaidHTG = 0;
    balanceDueHTG = totalHTG;
  } else if (isCredit) {
    status = "Paid";
    amountPaidHTG = totalHTG;
    balanceDueHTG = 0;
  } else if (i % 7 === 0) {
    status = "Unpaid";
    amountPaidHTG = 0;
    balanceDueHTG = patientShareHTG;
  } else if (i % 5 === 0) {
    status = "Partial";
    amountPaidHTG = Math.round(patientShareHTG * 0.5);
    balanceDueHTG = patientShareHTG - amountPaidHTG;
  } else if (i % 11 === 0) {
    status = "Overdue";
    amountPaidHTG = 0;
    balanceDueHTG = patientShareHTG;
  }

  const payments: PaymentTransaction[] = amountPaidHTG > 0 ? [
    {
      id: `PMT-${i}-1`,
      date: `2026-08-${String(Math.max(1, 30 - Math.floor(i / 3))).padStart(2, "0")}`,
      amountHTG: amountPaidHTG,
      amountUSD: Math.round((amountPaidHTG / EXCHANGE_RATE_USD_HTG) * 100) / 100,
      exchangeRateUsed: EXCHANGE_RATE_USD_HTG,
      currency: i % 2 === 0 ? "HTG" : "USD",
      method: i % 4 === 0 ? "Cash" : i % 4 === 1 ? "Credit Card" : i % 4 === 2 ? "MonCash" : "Bank Transfer",
      referenceNo: `TRX-${10000 + i * 47}`,
      cashierName: "Marie-Ange Joseph",
      type: "Payment",
    }
  ] : [];

  const invoiceDay = Math.max(1, 30 - Math.floor(i / 3));
  const dateStr = `2026-08-${String(invoiceDay).padStart(2, "0")}`;
  const dueDateStr = `2026-09-${String(Math.min(28, invoiceDay + 14)).padStart(2, "0")}`;

  mockInvoices.push({
    id: `INV-2024-${String(i + 1).padStart(3, "0")}`,
    invoiceNo: `${isQuote ? "QUO" : isCredit ? "CRN" : "INV"}-2026-${String(i + 1).padStart(4, "0")}`,
    documentType: docType,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    patientPhone: patient.phone,
    patientAddress: patient.address + ", " + patient.city,
    date: dateStr,
    dueDate: dueDateStr,
    items,
    subtotalHTG,
    taxTotalHTG,
    discountTotalHTG: i % 5 === 0 ? 1500 : 0,
    totalHTG,
    insurerId: insurer?.id,
    insurerName: insurer?.name,
    insurerShareHTG,
    patientShareHTG,
    status,
    payments,
    amountPaidHTG,
    balanceDueHTG,
    notes: "Thank you for choosing Optique Vision Caraïbes. Warranty 12 months on optical frames and coating.",
    installmentPlan: i % 8 === 0 ? {
      enabled: true,
      installments: [
        { number: 1, dueDate: dateStr, amountHTG: Math.round(totalHTG / 3), isPaid: true, paidAt: dateStr },
        { number: 2, dueDate: "2026-09-15", amountHTG: Math.round(totalHTG / 3), isPaid: false },
        { number: 3, dueDate: "2026-10-15", amountHTG: Math.round(totalHTG / 3), isPaid: false },
      ]
    } : undefined,
  });
}

export const mockCashRegister: CashRegisterSession = {
  id: "CS-2026-0902",
  cashierName: "Marie-Ange Joseph (Reception & Billing)",
  openedAt: "2026-09-02 07:45:00",
  openingFloatHTG: 25000,
  openingFloatUSD: 300,
  expectedCashHTG: 98500,
  expectedCashUSD: 850,
  status: "Open",
  transactionsCount: 14,
};
