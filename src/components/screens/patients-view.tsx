import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  FileText,
  Glasses,
  Receipt,
  Calendar,
  Layers,
  HeartPulse,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Patient } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/src/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton-avatar";
import { formatCurrency, formatDate } from "@/src/lib/utils";

export function PatientsView() {
  const {
    patients,
    addPatient,
    updatePatient,
    selectedPatientId,
    setSelectedPatientId,
    currentView,
    setCurrentView,
    consultations,
    prescriptions,
    labOrders,
    invoices,
    devEmptyState,
    devLoadingState,
    devErrorState,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterInsurance, setFilterInsurance] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"name" | "lastVisit" | "balance">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // New Patient Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "M" as "M" | "F",
    dateOfBirth: "1992-05-10",
    phone: "+509 ",
    email: "",
    address: "",
    city: "Pétion-Ville",
    insuranceProviderId: "INS-01",
    insurancePolicyNo: "",
    diabetes: false,
    hypertension: false,
    contactLensWearer: false,
    ocularHistory: "Routine myopia",
    allergies: "None",
  });

  const isDetailView = currentView === "patient-detail";
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  if (devLoadingState) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  // Filter & sort
  const filteredPatients = patients.filter((p) => {
    const matchesQuery = `${p.firstName} ${p.lastName} ${p.patientNo} ${p.phone} ${p.city}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesIns =
      filterInsurance === "ALL"
        ? true
        : filterInsurance === "INSURED"
        ? Boolean(p.insuranceProviderId)
        : filterInsurance === "SELF_PAY"
        ? !p.insuranceProviderId
        : p.insuranceProviderId === filterInsurance;
    return matchesQuery && matchesIns;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortField === "name") {
      const nameA = `${a.lastName} ${a.firstName}`;
      const nameB = `${b.lastName} ${b.firstName}`;
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    if (sortField === "balance") {
      return sortAsc ? a.balance - b.balance : b.balance - a.balance;
    }
    if (sortField === "lastVisit") {
      return sortAsc
        ? (a.lastVisit || "").localeCompare(b.lastVisit || "")
        : (b.lastVisit || "").localeCompare(a.lastVisit || "");
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedPatients.length / pageSize) || 1;
  const paginatedPatients = sortedPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const birthYear = parseInt(formData.dateOfBirth.split("-")[0]) || 1990;
    const age = 2026 - birthYear;

    addPatient({
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      age,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      insuranceProviderId: formData.insuranceProviderId || undefined,
      insurancePolicyNo: formData.insurancePolicyNo || undefined,
      medicalHistory: {
        ocularHistory: [formData.ocularHistory],
        systemicHistory: {
          diabetes: formData.diabetes,
          hypertension: formData.hypertension,
          cardiac: false,
          autoimmune: false,
        },
        familyOcularHistory: [],
        currentMedications: [],
        allergies: [formData.allergies],
        contactLensWearer: formData.contactLensWearer,
        smoker: false,
      },
    });

    setAddSheetOpen(false);
  };

  // If viewing patient detail page
  if (isDetailView && activePatient) {
    const patientConsultations = consultations.filter((c) => c.patientId === activePatient.id);
    const patientPrescriptions = prescriptions.filter((r) => r.patientId === activePatient.id);
    const patientLabOrders = labOrders.filter((j) => j.patientId === activePatient.id);
    const patientInvoices = invoices.filter((inv) => inv.patientId === activePatient.id);

    return (
      <div className="p-4 sm:p-6 space-y-6">
        {/* Detail Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView("patients")}
              className="text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to List
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  {activePatient.firstName} {activePatient.lastName}
                </h1>
                <Badge variant="outline" className="font-mono text-xs">
                  {activePatient.patientNo}
                </Badge>
                <Badge variant={activePatient.balance > 0 ? "default" : "secondary"}>
                  {activePatient.balance > 0 ? `Due: ${activePatient.balance.toLocaleString()} G` : "Settled"}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500">
                {activePatient.age} yrs · {activePatient.gender === "M" ? "Male" : "Female"} · Registered Client
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setFormData({
                  firstName: activePatient.firstName,
                  lastName: activePatient.lastName,
                  gender: activePatient.gender as any,
                  dateOfBirth: activePatient.dateOfBirth,
                  phone: activePatient.phone,
                  email: activePatient.email,
                  address: activePatient.address,
                  city: activePatient.city,
                  insuranceProviderId: activePatient.insuranceProviderId || "",
                  insurancePolicyNo: activePatient.insurancePolicyNo || "",
                  diabetes: activePatient.medicalHistory.systemicHistory.diabetes,
                  hypertension: activePatient.medicalHistory.systemicHistory.hypertension,
                  contactLensWearer: activePatient.medicalHistory.contactLensWearer,
                  ocularHistory: activePatient.medicalHistory.ocularHistory.join(", "),
                  allergies: activePatient.medicalHistory.allergies.join(", "),
                });
                setEditDialogOpen(true);
              }}
              className="text-xs"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentView("consultations")}
              className="text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Start Exam
            </Button>
          </div>
        </div>

        {/* 8-Tab Detail View */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="consultations">
              Consultations ({patientConsultations.length})
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              Prescriptions ({patientPrescriptions.length})
            </TabsTrigger>
            <TabsTrigger value="orders">Orders ({patientLabOrders.length})</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({patientInvoices.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* TAB 1: Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Contact Card */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">Contact & Demographics</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Phone className="h-4 w-4" /> <span>{activePatient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Mail className="h-4 w-4" /> <span>{activePatient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="h-4 w-4" /> <span>{activePatient.address}, {activePatient.city}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-zinc-500">
                    DOB: {formatDate(activePatient.dateOfBirth)} ({activePatient.age} yrs)
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Card */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">Insurance & Coverage</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Provider:</span>
                    <span className="font-semibold">{activePatient.insuranceProviderId ? "OFATMA / AIC" : "Private Self-Pay"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Policy No:</span>
                    <span className="font-mono">{activePatient.insurancePolicyNo || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Coverage:</span>
                    <Badge variant="secondary">{activePatient.insuranceCoveragePercent ? `${activePatient.insuranceCoveragePercent}%` : "None"}</Badge>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
                    <span className="text-zinc-500">Account Balance:</span>
                    <span className="font-bold">{activePatient.balance.toLocaleString()} HTG</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Clinical Snapshot */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold">Clinical Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Last Visit:</span>
                    <span>{activePatient.lastVisit || "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Next Due:</span>
                    <span>{activePatient.nextVisit || "Not scheduled"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Contact Lens Wearer:</span>
                    <span>{activePatient.medicalHistory.contactLensWearer ? "Yes (Active)" : "No"}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500 block">Notes:</span>
                    <p className="text-zinc-800 dark:text-zinc-200 mt-1 italic">
                      "{activePatient.notes || "No clinical remarks recorded."}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: Medical History */}
          <TabsContent value="medical" className="space-y-4">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Comprehensive Medical & Ocular History</CardTitle>
                <CardDescription className="text-xs">
                  Critical baseline for refraction and ocular disease screening
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                    <div className="font-semibold text-black dark:text-white">Ocular History</div>
                    <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-300 space-y-1">
                      {activePatient.medicalHistory.ocularHistory.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                    <div className="font-semibold text-black dark:text-white">Systemic Conditions</div>
                    <div className="space-y-1 text-zinc-600 dark:text-zinc-300">
                      <div>
                        Diabetes:{" "}
                        <Badge variant={activePatient.medicalHistory.systemicHistory.diabetes ? "default" : "outline"} className="text-[10px]">
                          {activePatient.medicalHistory.systemicHistory.diabetes ? "Positive (Type 2)" : "Negative"}
                        </Badge>
                      </div>
                      <div>
                        Hypertension:{" "}
                        <Badge variant={activePatient.medicalHistory.systemicHistory.hypertension ? "default" : "outline"} className="text-[10px]">
                          {activePatient.medicalHistory.systemicHistory.hypertension ? "Positive (Medicated)" : "Negative"}
                        </Badge>
                      </div>
                      {activePatient.medicalHistory.systemicHistory.other && (
                        <div className="text-[11px] text-zinc-500 mt-1">
                          {activePatient.medicalHistory.systemicHistory.other}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-2">
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <span className="font-semibold block mb-1">Current Medications</span>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {activePatient.medicalHistory.currentMedications.join(", ") || "None declared"}
                    </p>
                  </div>
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <span className="font-semibold block mb-1">Allergies</span>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {activePatient.medicalHistory.allergies.join(", ") || "No known allergies"}
                    </p>
                  </div>
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <span className="font-semibold block mb-1">Family Ocular History</span>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {activePatient.medicalHistory.familyOcularHistory.join(", ") || "No hereditary anomalies noted"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Consultations */}
          <TabsContent value="consultations">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Consultation History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {patientConsultations.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No consultations on record for this patient.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Exam No.</TableHead>
                        <TableHead>Practitioner</TableHead>
                        <TableHead>Chief Complaint</TableHead>
                        <TableHead>IOP (OD/OS)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientConsultations.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-xs">{c.date}</TableCell>
                          <TableCell className="font-mono text-xs">{c.consultationNo}</TableCell>
                          <TableCell className="text-xs">{c.practitionerName}</TableCell>
                          <TableCell className="text-xs max-w-xs truncate">{c.chiefComplaint}</TableCell>
                          <TableCell className="text-xs font-mono">{c.iop.od}/{c.iop.os} mmHg</TableCell>
                          <TableCell>
                            <Badge variant={c.isSigned ? "secondary" : "outline"}>
                              {c.isSigned ? "Signed & Locked" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setCurrentView("consultations")}
                            >
                              Open Exam
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Prescriptions */}
          <TabsContent value="prescriptions">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Prescriptions Issued</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {patientPrescriptions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No prescriptions on record.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Rx Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Prescriber</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientPrescriptions.map((rx) => (
                        <TableRow key={rx.id}>
                          <TableCell>
                            <Badge variant="outline">{rx.type}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs font-medium">{rx.rxNumber}</TableCell>
                          <TableCell className="text-xs">{rx.date}</TableCell>
                          <TableCell className="text-xs">{rx.validUntil}</TableCell>
                          <TableCell className="text-xs">{rx.practitionerName}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setCurrentView("prescriptions")}
                            >
                              Print / View A5
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Lab & Workshop Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {patientLabOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No active workshop orders.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job No</TableHead>
                        <TableHead>Frame Model</TableHead>
                        <TableHead>Lens Type</TableHead>
                        <TableHead>Promised Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Kanban</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientLabOrders.map((j) => (
                        <TableRow key={j.id}>
                          <TableCell className="font-mono text-xs font-medium">{j.orderNo}</TableCell>
                          <TableCell className="text-xs">{j.frameName}</TableCell>
                          <TableCell className="text-xs">{j.lensSpec.type}</TableCell>
                          <TableCell className="text-xs">{j.promisedDate}</TableCell>
                          <TableCell>
                            <Badge variant={j.status === "Delivered" ? "secondary" : "default"}>
                              {j.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setCurrentView("lab")}
                            >
                              Track Job
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: Invoices */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold">Invoices & Financial Ledger</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {patientInvoices.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No invoices generated yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total (HTG)</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientInvoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-xs font-medium">{inv.invoiceNo}</TableCell>
                          <TableCell className="text-xs">{inv.date}</TableCell>
                          <TableCell className="text-xs">{inv.totalHTG.toLocaleString()} G</TableCell>
                          <TableCell className="text-xs">{inv.amountPaidHTG.toLocaleString()} G</TableCell>
                          <TableCell className="text-xs font-semibold">{inv.balanceDueHTG.toLocaleString()} G</TableCell>
                          <TableCell>
                            <Badge variant={inv.status === "Paid" ? "secondary" : "default"}>
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setCurrentView("billing")}
                            >
                              Open A4
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 7: Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Diagnostic Images & Attachments</CardTitle>
                <CardDescription className="text-xs">
                  OCT cross-sections, digital fundus photography, and visual fields
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-center space-y-2">
                    <div className="h-28 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-500">
                      [ OCT Macula B-Scan ]
                    </div>
                    <div className="text-xs font-medium">Spectralis OCT Retinal Map</div>
                    <span className="text-[11px] text-zinc-400 block">Aug 15, 2026</span>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-center space-y-2">
                    <div className="h-28 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-500">
                      [ Fundus Photo 45° ]
                    </div>
                    <div className="text-xs font-medium">Ultra-Wide Color Retinography</div>
                    <span className="text-[11px] text-zinc-400 block">Aug 15, 2026</span>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-center space-y-2">
                    <div className="h-28 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-500">
                      [ Humphrey HFA 24-2 ]
                    </div>
                    <div className="text-xs font-medium">Visual Field SITA-Fast</div>
                    <span className="text-[11px] text-zinc-400 block">Aug 15, 2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 8: Timeline */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Care Journey & Visit Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-4 space-y-6 text-xs">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full bg-black dark:bg-white" />
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Sep 02, 2026</span>
                    <p className="text-zinc-500 mt-0.5">Dispensed Ray-Ban Spectacles with Varilux Progressive Lenses.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full bg-zinc-400" />
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Aug 28, 2026</span>
                    <p className="text-zinc-500 mt-0.5">Comprehensive eye exam performed by Dr. Pierre-Louis. New Rx issued.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 h-2.5 w-2.5 rounded-full bg-zinc-400" />
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Aug 15, 2025</span>
                    <p className="text-zinc-500 mt-0.5">Initial patient file established; baseline autorefraction completed.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Patient Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent onClose={() => setEditDialogOpen(false)} className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Patient Record</DialogTitle>
              <DialogDescription>
                Update contact information and demographic records
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-500 mb-1">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-500 mb-1">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Email</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updatePatient(activePatient.id, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                  });
                  setEditDialogOpen(false);
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // PATIENT DIRECTORY TABLE VIEW
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Patients Directory</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            {patients.length} active registered clinical records
          </p>
        </div>
        <Button onClick={() => setAddSheetOpen(true)} size="sm" className="text-xs">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Register New Patient
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by name, phone, PT #..."
            className="pl-9 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Insurance Filter */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Coverage:</span>
            <select
              value={filterInsurance}
              onChange={(e) => setFilterInsurance(e.target.value)}
              className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-black dark:text-white"
            >
              <option value="ALL">All Patients</option>
              <option value="INSURED">Insured (Third-Party)</option>
              <option value="SELF_PAY">Self-Pay Only</option>
              <option value="INS-01">OFATMA</option>
              <option value="INS-02">AIC Assurances</option>
              <option value="INS-03">SunAssurance</option>
            </select>
          </div>

          {/* Sort trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (sortField === "name") setSortField("balance");
              else if (sortField === "balance") setSortField("lastVisit");
              else setSortField("name");
              setSortAsc(!sortAsc);
            }}
            className="text-xs h-8"
          >
            <ArrowUpDown className="mr-1 h-3 w-3" />
            Sort: {sortField} ({sortAsc ? "Asc" : "Desc"})
          </Button>
        </div>
      </div>

      {/* Patients Data Table */}
      <Card>
        <CardContent className="p-0">
          {devEmptyState || paginatedPatients.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No patients match your search criteria. Click "Register New Patient" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Patient No.</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Age / Gender</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">Insurance</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Visit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setCurrentView("patient-detail");
                    }}
                  >
                    <TableCell className="font-mono text-xs font-medium">
                      {p.patientNo}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.firstName} {p.lastName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-zinc-500">
                      {p.age} yrs · {p.gender}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs">
                      {p.phone}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs">
                      {p.insuranceProviderId ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {p.insurancePolicyNo?.split("-")[0] || "Insured"}
                        </Badge>
                      ) : (
                        <span className="text-zinc-400">Self-Pay</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-zinc-500">
                      {p.lastVisit ? formatDate(p.lastVisit) : "New"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold">
                      {p.balance > 0 ? (
                        <span className="text-black dark:text-white underline">
                          {p.balance.toLocaleString()} G
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-normal">0 G</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2"
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setCurrentView("patient-detail");
                        }}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
            <div>
              Showing {Math.min((currentPage - 1) * pageSize + 1, sortedPatients.length)} to{" "}
              {Math.min(currentPage * pageSize, sortedPatients.length)} of {sortedPatients.length} patients
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 text-xs"
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Patient Sheet */}
      <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen} side="right">
        <SheetHeader>
          <SheetTitle>Register New Patient</SheetTitle>
          <SheetDescription>
            Enter personal demographics, insurance policy, and medical background
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleCreatePatient} className="space-y-4 py-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">First Name *</label>
              <Input
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Jean-Claude"
              />
            </div>
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Last Name *</label>
              <Input
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Augustin"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Date of Birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Phone Number *</label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+509 3000-0000"
              />
            </div>
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-500 mb-1 font-medium">Address & City</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 14 Rue Capois, Port-au-Prince"
            />
          </div>

          {/* Insurance Section */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="font-semibold block">Insurance Provider</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  value={formData.insuranceProviderId}
                  onChange={(e) => setFormData({ ...formData, insuranceProviderId: e.target.value })}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  <option value="">None (Self-Pay)</option>
                  <option value="INS-01">OFATMA</option>
                  <option value="INS-02">AIC Assurances</option>
                  <option value="INS-03">SunAssurance</option>
                  <option value="INS-04">BUH Assurances</option>
                  <option value="INS-05">INASSA</option>
                </select>
              </div>
              <div>
                <Input
                  value={formData.insurancePolicyNo}
                  onChange={(e) => setFormData({ ...formData, insurancePolicyNo: e.target.value })}
                  placeholder="Policy / Card ID #"
                />
              </div>
            </div>
          </div>

          {/* Medical Checkboxes */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="font-semibold block">Systemic & Ocular Screen</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.diabetes}
                  onChange={(e) => setFormData({ ...formData, diabetes: e.target.checked })}
                  className="rounded accent-black dark:accent-white"
                />
                <span>Diabetes Mellitus</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hypertension}
                  onChange={(e) => setFormData({ ...formData, hypertension: e.target.checked })}
                  className="rounded accent-black dark:accent-white"
                />
                <span>Hypertension</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contactLensWearer}
                  onChange={(e) => setFormData({ ...formData, contactLensWearer: e.target.checked })}
                  className="rounded accent-black dark:accent-white"
                />
                <span>Contact Lens Wearer</span>
              </label>
            </div>
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => setAddSheetOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Complete Registration</Button>
          </SheetFooter>
        </form>
      </Sheet>
    </div>
  );
}
