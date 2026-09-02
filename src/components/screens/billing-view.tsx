import React, { useState } from "react";
import {
  Receipt,
  Plus,
  DollarSign,
  Printer,
  Calendar,
  CreditCard,
  Building,
  CheckCircle,
  FileText,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Wallet,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Invoice, DocumentType, Currency, PaymentTransaction } from "@/src/types";
import { EXCHANGE_RATE_USD_HTG } from "@/src/lib/mock/invoices";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { toast } from "sonner";

export function BillingView() {
  const {
    invoices,
    patients,
    addInvoice,
    recordPayment,
    cashRegister,
    selectedInvoiceId,
    setSelectedInvoiceId,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"Invoices" | "Quotes" | "Receipts" | "CreditNotes" | "CashRegister">("Invoices");
  const [previewInvoice, setPreviewInvoice] = useState<Invoice>(
    invoices.find((i) => i.id === selectedInvoiceId) || invoices[0]
  );
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [newInvoiceModalOpen, setNewInvoiceModalOpen] = useState(false);

  // Payment Form State
  const [payAmount, setPayAmount] = useState(previewInvoice.balanceDueHTG || 15000);
  const [payCurrency, setPayCurrency] = useState<Currency>("HTG");
  const [payMethod, setPayMethod] = useState("Cash");
  const [cashierName, setCashierName] = useState("Marie-Ange Joseph");

  // New Invoice Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || "PT-001");
  const [docType, setDocType] = useState<DocumentType>("Invoice");
  const [frameItemPrice, setFrameItemPrice] = useState(18500);
  const [lensItemPrice, setLensItemPrice] = useState(8500);
  const [examItemPrice, setExamItemPrice] = useState(3500);
  const [discountAmount, setDiscountAmount] = useState(0);

  const getFilteredDocs = () => {
    switch (activeTab) {
      case "Invoices":
        return invoices.filter((i) => i.documentType === "Invoice");
      case "Quotes":
        return invoices.filter((i) => i.documentType === "Quote");
      case "Receipts":
        return invoices.filter((i) => i.documentType === "Receipt");
      case "CreditNotes":
        return invoices.filter((i) => i.documentType === "Credit Note");
      default:
        return invoices;
    }
  };

  const handleOpenPreview = (inv: Invoice) => {
    setPreviewInvoice(inv);
    setSelectedInvoiceId(inv.id);
    setPayAmount(inv.balanceDueHTG > 0 ? inv.balanceDueHTG : inv.totalHTG);
    setPreviewModalOpen(true);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setPreviewInvoice(inv);
    setSelectedInvoiceId(inv.id);
    setPayAmount(inv.balanceDueHTG > 0 ? inv.balanceDueHTG : inv.totalHTG);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    const finalHTG =
      payCurrency === "USD" ? Math.round(payAmount * EXCHANGE_RATE_USD_HTG) : payAmount;
    recordPayment(previewInvoice.id, finalHTG, payCurrency, payMethod, cashierName);
    setPaymentModalOpen(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const sub = frameItemPrice + lensItemPrice + examItemPrice - discountAmount;
    const tax = Math.round(sub * 0.10);
    const total = sub + tax;

    addInvoice({
      documentType: docType,
      patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Walk-in",
      patientPhone: patient?.phone,
      patientAddress: patient?.address,
      subtotalHTG: sub,
      taxTotalHTG: tax,
      discountTotalHTG: discountAmount,
      totalHTG: total,
      patientShareHTG: total,
      items: [
        {
          id: "item-1",
          description: "Comprehensive Optometric Clinical Examination",
          category: "Clinical Act",
          quantity: 1,
          unitPriceHTG: examItemPrice,
          discountHTG: 0,
          taxPercent: 0,
          totalHTG: examItemPrice,
        },
        {
          id: "item-2",
          description: "Designer Optical Frame",
          category: "Frame",
          quantity: 1,
          unitPriceHTG: frameItemPrice,
          discountHTG: discountAmount,
          taxPercent: 10,
          totalHTG: (frameItemPrice - discountAmount) * 1.10,
        },
        {
          id: "item-3",
          description: "Anti-Reflective Prescription Lenses (Pair)",
          category: "Lenses",
          quantity: 1,
          unitPriceHTG: lensItemPrice,
          discountHTG: 0,
          taxPercent: 10,
          totalHTG: lensItemPrice * 1.10,
        },
      ],
    });

    setNewInvoiceModalOpen(false);
  };

  const totalOutstanding = invoices
    .filter((i) => i.documentType === "Invoice")
    .reduce((sum, i) => sum + i.balanceDueHTG, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Billing & Financial Documents</h1>
            <Badge variant="outline" className="text-xs">
              Exchange Rate: 1 USD = {EXCHANGE_RATE_USD_HTG} HTG
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Generate Quotes, Invoices, Receipts, and manage dual-currency cash register sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setNewInvoiceModalOpen(true)} size="sm" className="text-xs">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Document
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="Invoices">
            Invoices ({invoices.filter((i) => i.documentType === "Invoice").length})
          </TabsTrigger>
          <TabsTrigger value="Quotes">Quotes & Estimates</TabsTrigger>
          <TabsTrigger value="Receipts">Receipts</TabsTrigger>
          <TabsTrigger value="CreditNotes">Credit Notes</TabsTrigger>
          <TabsTrigger value="CashRegister">Daily Cash Register</TabsTrigger>
        </TabsList>

        {/* TAB 1-4: Invoices / Quotes / Receipts / Credit Notes Table */}
        {activeTab !== "CashRegister" && (
          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doc Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Total (HTG)</TableHead>
                      <TableHead>Insurer Share</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Balance Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDocs().map((inv) => (
                      <TableRow
                        key={inv.id}
                        className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                        onClick={() => handleOpenPreview(inv)}
                      >
                        <TableCell className="font-mono text-xs font-semibold">{inv.invoiceNo}</TableCell>
                        <TableCell className="text-xs">{inv.date}</TableCell>
                        <TableCell className="font-medium text-xs">{inv.patientName}</TableCell>
                        <TableCell className="text-xs font-mono font-bold">
                          {inv.totalHTG.toLocaleString()} G
                        </TableCell>
                        <TableCell className="text-xs text-zinc-500 font-mono">
                          {inv.insurerShareHTG > 0 ? `${inv.insurerShareHTG.toLocaleString()} G` : "-"}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {inv.amountPaidHTG.toLocaleString()} G
                        </TableCell>
                        <TableCell className="text-xs font-mono font-semibold">
                          {inv.balanceDueHTG > 0 ? (
                            <span className="text-black dark:text-white underline">{inv.balanceDueHTG.toLocaleString()} G</span>
                          ) : (
                            <span className="text-zinc-400 font-normal">0 G</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inv.status === "Paid"
                                ? "secondary"
                                : inv.status === "Partial"
                                ? "outline"
                                : inv.status === "Overdue"
                                ? "destructive"
                                : "default"
                            }
                            className="text-[10px]"
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleOpenPreview(inv)}
                          >
                            <Printer className="h-3 w-3 mr-1" /> View A4
                          </Button>
                          {inv.balanceDueHTG > 0 && (
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleOpenPayment(inv)}
                            >
                              <DollarSign className="h-3 w-3 mr-1" /> Pay
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB 5: CASH REGISTER MANAGEMENT */}
        {activeTab === "CashRegister" && (
          <TabsContent value="CashRegister" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase text-zinc-500">
                    Session Status & Cashier
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Current Status:</span>
                    <Badge variant="secondary">Active & Open</Badge>
                  </div>
                  <div>Cashier: <span className="font-semibold">{cashRegister.cashierName}</span></div>
                  <div>Opened At: <span className="font-mono text-zinc-500">{cashRegister.openedAt}</span></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase text-zinc-500">
                    Opening Floats (Fonds de Caisse)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">HTG Float:</span>
                    <span className="font-bold">{cashRegister.openingFloatHTG.toLocaleString()} HTG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">USD Float:</span>
                    <span className="font-bold">${cashRegister.openingFloatUSD} USD</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase text-zinc-500">
                    Expected Drawer Total
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Expected HTG:</span>
                    <span className="font-bold text-sm">{cashRegister.expectedCashHTG.toLocaleString()} HTG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Expected USD:</span>
                    <span className="font-bold text-sm">${cashRegister.expectedCashUSD} USD</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">End-of-Day Cash Register Reconciliation</CardTitle>
                  <CardDescription className="text-xs">
                    Perform physical cash count and generate Z-Report closure
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => toast.success("Mid-day cash drawer audit printed (X-Report)")}
                  >
                    Print X-Report
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => toast.success("Cash register session closed with 0 variance. Z-Report printed.")}
                  >
                    Close Register (Z-Report)
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Printable A4 Invoice Preview Dialog */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent onClose={() => setPreviewModalOpen(false)} className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-black dark:text-white space-y-6">
            {/* Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-black dark:border-white pb-6">
              <div>
                <h1 className="text-lg font-bold tracking-tight uppercase">
                  CLINIQUE OPTIQUE VISION CARAÏBES
                </h1>
                <p className="text-xs text-zinc-500">
                  Centre d'Optométrie Médicale & Réfraction Avancée
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  NIF: 001-829-440-9 · Registre: MSPP-DE-88219-OPT<br />
                  42 Angle Rue Grégoire et Panaméricaine, Pétion-Ville · +509 2940-8800
                </p>
              </div>

              <div className="text-right">
                <Badge variant="outline" className="text-sm font-mono font-bold px-3 py-1">
                  {previewInvoice.invoiceNo}
                </Badge>
                <div className="text-xs text-zinc-500 mt-2">
                  Date: {previewInvoice.date}<br />
                  Due Date: {previewInvoice.dueDate}
                </div>
              </div>
            </div>

            {/* Bill To & Insurer Header */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
              <div>
                <span className="text-zinc-500 uppercase font-semibold text-[10px] block mb-1">
                  Bill To (Patient):
                </span>
                <div className="font-bold text-sm">{previewInvoice.patientName}</div>
                <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">{previewInvoice.patientPhone}</div>
                <div className="text-zinc-500">{previewInvoice.patientAddress}</div>
              </div>

              <div className="text-right">
                <span className="text-zinc-500 uppercase font-semibold text-[10px] block mb-1">
                  Third-Party Insurance:
                </span>
                <div className="font-bold">
                  {previewInvoice.insurerName || "Direct Patient Self-Pay"}
                </div>
                {previewInvoice.insurerShareHTG > 0 && (
                  <div className="text-zinc-500 mt-0.5">
                    Insurer Coverage: {previewInvoice.insurerShareHTG.toLocaleString()} HTG
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
                  <tr>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-center w-16">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Discount</th>
                    <th className="p-3 text-right">Tax (10%)</th>
                    <th className="p-3 text-right">Total (HTG)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                  {previewInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-sans font-medium text-left">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{item.unitPriceHTG.toLocaleString()} G</td>
                      <td className="p-3 text-right">{item.discountHTG > 0 ? `-${item.discountHTG} G` : "-"}</td>
                      <td className="p-3 text-right">{item.taxPercent > 0 ? `${item.taxPercent}%` : "0%"}</td>
                      <td className="p-3 text-right font-bold">{item.totalHTG.toLocaleString()} G</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-72 space-y-2 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 font-mono">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="font-sans">Subtotal HT:</span>
                  <span>{previewInvoice.subtotalHTG.toLocaleString()} HTG</span>
                </div>
                {previewInvoice.discountTotalHTG > 0 && (
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="font-sans">Discount:</span>
                    <span>-{previewInvoice.discountTotalHTG.toLocaleString()} HTG</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="font-sans">TCA / VAT (10%):</span>
                  <span>{previewInvoice.taxTotalHTG.toLocaleString()} HTG</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-bold text-sm">
                  <span className="font-sans">Total Amount:</span>
                  <span>{previewInvoice.totalHTG.toLocaleString()} HTG</span>
                </div>
                {previewInvoice.insurerShareHTG > 0 && (
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="font-sans">Insurer Portion:</span>
                    <span>-{previewInvoice.insurerShareHTG.toLocaleString()} HTG</span>
                  </div>
                )}
                <div className="pt-2 border-t border-black dark:border-white flex justify-between font-bold text-sm text-black dark:text-white">
                  <span className="font-sans">Patient Due:</span>
                  <span>{previewInvoice.patientShareHTG.toLocaleString()} HTG</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span className="font-sans">Paid to date:</span>
                  <span>{previewInvoice.amountPaidHTG.toLocaleString()} HTG</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-zinc-200 dark:border-zinc-700">
                  <span className="font-sans">Balance Remaining:</span>
                  <span>{previewInvoice.balanceDueHTG.toLocaleString()} HTG</span>
                </div>
              </div>
            </div>

            {/* Installment Plan if enabled */}
            {previewInvoice.installmentPlan?.enabled && (
              <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded text-xs space-y-2">
                <span className="font-bold block">Installment Payment Schedule (3x Facility)</span>
                <div className="grid grid-cols-3 gap-2">
                  {previewInvoice.installmentPlan.installments.map((inst) => (
                    <div key={inst.number} className="p-2 border rounded bg-zinc-50 dark:bg-zinc-900">
                      <div className="font-semibold">Term #{inst.number}</div>
                      <div className="font-mono text-xs">{inst.amountHTG.toLocaleString()} HTG</div>
                      <Badge variant={inst.isPaid ? "secondary" : "outline"} className="text-[9px] mt-1">
                        {inst.isPaid ? "Paid" : `Due ${inst.dueDate}`}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                window.print();
                toast.success("Print dialog opened for A4 Invoice");
              }}
            >
              <Printer className="h-3.5 w-3.5 mr-1" /> Print Official A4
            </Button>

            {previewInvoice.balanceDueHTG > 0 && (
              <Button
                size="sm"
                className="text-xs"
                onClick={() => {
                  setPreviewModalOpen(false);
                  handleOpenPayment(previewInvoice);
                }}
              >
                <DollarSign className="h-3.5 w-3.5 mr-1" /> Process Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dual Currency Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent onClose={() => setPaymentModalOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment: {previewInvoice.invoiceNo}</DialogTitle>
            <DialogDescription>
              Patient: {previewInvoice.patientName} · Balance Due: {previewInvoice.balanceDueHTG.toLocaleString()} HTG
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Currency</label>
                <select
                  value={payCurrency}
                  onChange={(e) => setPayCurrency(e.target.value as Currency)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  <option value="HTG">HTG (Haitian Gourdes)</option>
                  <option value="USD">USD (US Dollars)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">
                  Payment Amount ({payCurrency})
                </label>
                <Input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="font-mono font-bold"
                />
              </div>
            </div>

            {payCurrency === "USD" && (
              <div className="p-2.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-zinc-500 text-[11px] flex justify-between">
                <span>Converted HTG Equivalent:</span>
                <span className="font-bold text-black dark:text-white">
                  {(payAmount * EXCHANGE_RATE_USD_HTG).toLocaleString()} HTG
                </span>
              </div>
            )}

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Payment Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                <option value="Cash">Cash (Comptant)</option>
                <option value="Credit Card">Credit / Debit Card (Visa/Mastercard)</option>
                <option value="MonCash">MonCash Digicel</option>
                <option value="Natcash">Natcash Natcom</option>
                <option value="Bank Transfer">Unibank / SOGEBANK Transfer</option>
                <option value="Check">Certified Check</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment}>
              Confirm & Issue Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Invoice Builder Modal */}
      <Dialog open={newInvoiceModalOpen} onOpenChange={setNewInvoiceModalOpen}>
        <DialogContent onClose={() => setNewInvoiceModalOpen(false)} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Generate Financial Document</DialogTitle>
            <DialogDescription>
              Build an itemized invoice, quotation estimate, or receipt
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.patientNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  <option value="Invoice">Invoice (Facture)</option>
                  <option value="Quote">Quote / Devis</option>
                  <option value="Receipt">Receipt (Reçu)</option>
                </select>
              </div>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2 bg-zinc-50/50 dark:bg-zinc-900/40">
              <span className="font-bold block">Itemized Line Charges (HTG)</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 text-[10px]">Clinical Exam Fee</label>
                  <Input
                    type="number"
                    value={examItemPrice}
                    onChange={(e) => setExamItemPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-[10px]">Optical Frame</label>
                  <Input
                    type="number"
                    value={frameItemPrice}
                    onChange={(e) => setFrameItemPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-[10px]">Lenses & Treatments</label>
                  <Input
                    type="number"
                    value={lensItemPrice}
                    onChange={(e) => setLensItemPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewInvoiceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Document</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
